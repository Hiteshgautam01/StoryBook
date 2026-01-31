/**
 * Hybrid Face Swap Pipeline - Main Orchestrator
 *
 * Two-stage architecture for high-quality face personalization:
 *
 * Stage 1: Generate 7 stylized watercolor portraits using InstantID
 *   - One portrait per pose type (profile-left, profile-right, etc.)
 *   - Run in parallel for speed
 *   - Portraits are reused across pages with the same pose
 *
 * Stage 2: Composite portraits onto illustrations using Easel
 *   - Process pages in batches of 3 for balance
 *   - Uses stylized portrait matching the page's pose
 *   - Falls back through chain if primary method fails
 */

import {
  HybridPipelineConfig,
  HybridPipelineResult,
  PageProcessingResult,
  PortraitCache,
  PortraitPose,
  FaceSwapMethod,
  SSEEvent,
} from "./types";
import { generateAllPortraits } from "./instant-id";
import { easelFaceSwapWithRetry } from "./easel-face-swap";
import { executeFallbackChain, processNonChildPage } from "./fallback-chain";
import { getPoseForPage, getPagesNeedingFaceSwap } from "./pose-mapper";
import { getPageConfig, getPageImageUrl, TOTAL_PAGES, personalizeArabicText } from "@/lib/prompts/story-pages";
import { ALL_POSES } from "@/lib/prompts/pose-prompts";

/**
 * Send Server-Sent Event to client
 */
type SSESender = (event: SSEEvent) => void;

/**
 * Split array into batches
 */
function batchArray<T>(arr: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < arr.length; i += batchSize) {
    batches.push(arr.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * Process a single page using the hybrid pipeline
 */
async function processPage(
  pageNumber: number,
  config: HybridPipelineConfig,
  portraits: PortraitCache,
  sendSSE?: SSESender
): Promise<PageProcessingResult> {
  const startTime = Date.now();
  const pageConfig = getPageConfig(pageNumber);

  if (!pageConfig) {
    return {
      pageNumber,
      success: false,
      imageUrl: "",
      arabicText: "",
      method: "original",
      error: `Page ${pageNumber} not found`,
      processingTime: 0,
    };
  }

  // Get illustration URL
  const illustrationUrl = getPageImageUrl(pageNumber, config.baseUrl);
  const personalizedText = personalizeArabicText(pageConfig.arabicText, config.childName);

  // If page doesn't have a child, return original
  if (!pageConfig.hasChild) {
    return {
      pageNumber,
      success: true,
      imageUrl: illustrationUrl,
      arabicText: personalizedText,
      method: "original",
      processingTime: 0,
    };
  }

  // Send page start event
  sendSSE?.({
    type: "page_start",
    pageNumber,
  });

  // Get required pose for this page
  const pose = getPoseForPage(pageNumber);

  // Try primary method: Easel + stylized portrait
  if (pose) {
    const portrait = portraits.get(pose);

    if (portrait) {
      console.log(`[Pipeline] Page ${pageNumber}: Using ${pose} portrait...`);

      try {
        const result = await easelFaceSwapWithRetry({
          baseImageUrl: illustrationUrl,
          swapImageUrl: portrait.imageUrl,
          upscale: true,
        });

        if (result) {
          return {
            pageNumber,
            success: true,
            imageUrl: result.imageUrl,
            arabicText: personalizedText,
            method: "easel-stylized",
            processingTime: Date.now() - startTime,
          };
        }
      } catch (error) {
        console.error(`[Pipeline] Page ${pageNumber}: Primary method failed, using fallback chain`);
      }
    }
  }

  // Primary failed, execute fallback chain
  const fallbackResult = await executeFallbackChain({
    pageNumber,
    illustrationUrl,
    childPhotoUrl: config.childPhotoUrl,
    portraits,
    enableNanoBanana: config.enableFallbacks !== false,
    enableBasicSwap: config.enableFallbacks !== false,
  });

  return {
    pageNumber,
    success: fallbackResult.success,
    imageUrl: fallbackResult.imageUrl,
    arabicText: personalizedText,
    method: fallbackResult.method,
    processingTime: Date.now() - startTime,
  };
}

/**
 * Execute the full hybrid pipeline
 *
 * Main entry point for the face personalization system.
 */
export async function executeHybridPipeline(
  config: HybridPipelineConfig,
  sendSSE?: SSESender
): Promise<HybridPipelineResult> {
  const pipelineStartTime = Date.now();
  const concurrency = config.concurrency || 3;

  const pagesNeedingSwap = getPagesNeedingFaceSwap();

  // Send start event
  sendSSE?.({
    type: "start",
    totalPages: TOTAL_PAGES,
    pagesNeedingSwap: pagesNeedingSwap.length,
  });

  console.log(`[Pipeline] Starting hybrid pipeline for ${config.childName}`);
  console.log(`[Pipeline] Total pages: ${TOTAL_PAGES}, needing swap: ${pagesNeedingSwap.length}`);

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 1: Generate stylized portraits
  // ═══════════════════════════════════════════════════════════════════

  sendSSE?.({
    type: "portraits_start",
    totalPoses: ALL_POSES.length,
  });

  console.log(`[Pipeline] Stage 1: Generating ${ALL_POSES.length} stylized portraits...`);

  const portraitResult = await generateAllPortraits(
    config.childPhotoUrl,
    (pose: PortraitPose, success: boolean, completedCount: number) => {
      sendSSE?.({
        type: "portrait_complete",
        pose,
        success,
        completedCount,
        totalPoses: ALL_POSES.length,
      });
    }
  );

  sendSSE?.({
    type: "portraits_complete",
    successCount: portraitResult.successCount,
    failedCount: portraitResult.failedPoses.length,
    totalTime: portraitResult.totalTime,
  });

  console.log(`[Pipeline] Stage 1 complete: ${portraitResult.successCount}/${ALL_POSES.length} portraits`);

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 2: Process pages with face swap
  // ═══════════════════════════════════════════════════════════════════

  const pageStartTime = Date.now();
  const results: PageProcessingResult[] = [];
  const methodBreakdown: Record<FaceSwapMethod, number> = {
    "easel-stylized": 0,
    "easel-original": 0,
    "nano-banana": 0,
    "basic-faceswap": 0,
    "original": 0,
  };

  // Process pages - either specific pages or all pages
  const allPageNumbers = config.pageNumbers?.length
    ? config.pageNumbers.filter(p => p >= 1 && p <= TOTAL_PAGES)
    : Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
  const batches = batchArray(allPageNumbers, concurrency);
  const totalPagesToProcess = allPageNumbers.length;

  console.log(`[Pipeline] Stage 2: Processing ${totalPagesToProcess} pages in ${batches.length} batches...`);

  for (const batch of batches) {
    const batchResults = await Promise.all(
      batch.map(pageNum =>
        processPage(pageNum, config, portraitResult.portraits, sendSSE)
      )
    );

    for (const result of batchResults) {
      results.push(result);
      methodBreakdown[result.method]++;

      // Send progress event
      sendSSE?.({
        type: "image",
        pageNumber: result.pageNumber,
        imageUrl: result.imageUrl,
        arabicText: result.arabicText,
        success: result.success,
        method: result.method,
        completedCount: results.length,
        totalPages: totalPagesToProcess,
      });
    }
  }

  // Sort results by page number
  results.sort((a, b) => a.pageNumber - b.pageNumber);

  const pageProcessingTime = Date.now() - pageStartTime;
  const totalTime = Date.now() - pipelineStartTime;

  // Calculate success/failure counts
  const successCount = results.filter(r => r.success).length;
  const failedCount = results.filter(r => !r.success).length;

  // Send completion event
  sendSSE?.({
    type: "complete",
    totalPages: totalPagesToProcess,
    successCount,
    failedCount,
    totalTime,
  });

  console.log(`[Pipeline] Complete in ${totalTime}ms`);
  console.log(`[Pipeline] Success: ${successCount}/${totalPagesToProcess}`);
  console.log(`[Pipeline] Method breakdown:`, methodBreakdown);

  return {
    pages: results,
    portraitGenerationTime: portraitResult.totalTime,
    pageProcessingTime,
    totalTime,
    methodBreakdown,
  };
}

// Re-export types and utilities
export * from "./types";
export { getPoseForPage, getPagesNeedingFaceSwap } from "./pose-mapper";
export { generateAllPortraits, generatePortrait } from "./instant-id";
export { easelFaceSwap, easelFaceSwapWithRetry } from "./easel-face-swap";
export { executeFallbackChain } from "./fallback-chain";
