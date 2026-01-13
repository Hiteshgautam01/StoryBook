/**
 * Fallback Chain for Face Swap
 *
 * Implements a cascading fallback strategy when the primary
 * hybrid pipeline fails. Each fallback provides progressively
 * simpler (but lower quality) alternatives.
 *
 * Chain:
 * 1. Easel + Stylized Portrait (primary)
 * 2. Easel + Original Photo
 * 3. Nano Banana Pro (current implementation)
 * 4. Basic fal-ai/face-swap
 * 5. Original illustration (graceful degradation)
 */

import { fal } from "@fal-ai/client";
import { FaceSwapMethod, PortraitCache, PageProcessingResult, PortraitPose } from "./types";
import { easelFaceSwapWithRetry } from "./easel-face-swap";
import { getPoseForPage } from "./pose-mapper";
import { getPageConfig, buildPageSpecificPrompt, getBasicFaceSwapContext } from "@/lib/prompts/story-pages";

/**
 * Nano Banana Pro response structure
 */
interface NanoBananaResponse {
  images: Array<{
    url: string;
    width: number;
    height: number;
    content_type: string;
  }>;
}

/**
 * Basic face swap response structure
 */
interface BasicFaceSwapResponse {
  image: {
    url: string;
    width: number;
    height: number;
    content_type: string;
  };
}

/**
 * Fallback options for processing a page
 */
export interface FallbackOptions {
  pageNumber: number;
  illustrationUrl: string;     // Pre-made illustration
  childPhotoUrl: string;       // Original child photo
  portraits: PortraitCache;    // Stylized portraits from Stage 1
  enableNanoBanana?: boolean;  // Enable Nano Banana fallback (default: true)
  enableBasicSwap?: boolean;   // Enable basic face swap fallback (default: true)
}

/**
 * Result from the fallback chain
 */
export interface FallbackResult {
  imageUrl: string;
  method: FaceSwapMethod;
  success: boolean;
}

/**
 * Fallback 1: Try Easel with original photo (no stylization)
 */
async function tryEaselWithOriginal(
  illustrationUrl: string,
  childPhotoUrl: string
): Promise<string | null> {
  console.log("[Fallback] Trying Easel with original photo...");

  const result = await easelFaceSwapWithRetry({
    baseImageUrl: illustrationUrl,
    swapImageUrl: childPhotoUrl,
    upscale: true,
  });

  return result?.imageUrl || null;
}

/**
 * Fallback 2: Try Nano Banana Pro (current implementation)
 */
async function tryNanoBanana(
  illustrationUrl: string,
  childPhotoUrl: string,
  pageNumber: number
): Promise<string | null> {
  console.log(`[Fallback] Trying Nano Banana Pro for page ${pageNumber}...`);

  try {
    const prompt = buildPageSpecificPrompt(pageNumber);

    const result = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
      input: {
        prompt,
        image_urls: [illustrationUrl, childPhotoUrl],
        num_images: 1,
        aspect_ratio: "auto",
        output_format: "png",
        resolution: "2K",
      },
      logs: true,
    });

    const data = result.data as NanoBananaResponse;

    if (data.images && data.images.length > 0) {
      console.log("[Fallback] Nano Banana Pro succeeded");
      return data.images[0].url;
    }

    return null;
  } catch (error) {
    console.error("[Fallback] Nano Banana Pro failed:", error);
    return null;
  }
}

/**
 * Fallback 3: Try basic fal-ai/face-swap
 */
async function tryBasicFaceSwap(
  illustrationUrl: string,
  childPhotoUrl: string,
  pageNumber: number
): Promise<string | null> {
  console.log(`[Fallback] Trying basic face-swap for page ${pageNumber}...`);

  try {
    const context = getBasicFaceSwapContext(pageNumber);
    console.log(`[Fallback] Context: ${context}`);

    const result = await fal.subscribe("fal-ai/face-swap", {
      input: {
        base_image_url: illustrationUrl,
        swap_image_url: childPhotoUrl,
      },
      logs: true,
    });

    const data = result.data as BasicFaceSwapResponse;

    if (data.image) {
      console.log("[Fallback] Basic face-swap succeeded");
      return data.image.url;
    }

    return null;
  } catch (error) {
    console.error("[Fallback] Basic face-swap failed:", error);
    return null;
  }
}

/**
 * Execute the fallback chain for a single page
 *
 * Tries each method in order until one succeeds:
 * 1. Easel + Stylized Portrait (skipped if no portrait available)
 * 2. Easel + Original Photo
 * 3. Nano Banana Pro
 * 4. Basic face-swap
 * 5. Original illustration (final fallback)
 */
export async function executeFallbackChain(
  options: FallbackOptions
): Promise<FallbackResult> {
  const {
    pageNumber,
    illustrationUrl,
    childPhotoUrl,
    portraits,
    enableNanoBanana = true,
    enableBasicSwap = true,
  } = options;

  // Get required pose for this page
  const pose = getPoseForPage(pageNumber);

  // Try Easel + Stylized Portrait first (if we have the portrait)
  if (pose) {
    const portrait = portraits.get(pose);
    if (portrait) {
      console.log(`[Fallback] Page ${pageNumber}: Trying primary method (Easel + stylized ${pose})...`);

      const result = await easelFaceSwapWithRetry({
        baseImageUrl: illustrationUrl,
        swapImageUrl: portrait.imageUrl,
        upscale: true,
      });

      if (result) {
        return {
          imageUrl: result.imageUrl,
          method: "easel-stylized",
          success: true,
        };
      }

      console.log(`[Fallback] Page ${pageNumber}: Primary method failed`);
    } else {
      console.log(`[Fallback] Page ${pageNumber}: No stylized portrait for ${pose}, skipping to fallback`);
    }
  }

  // Fallback 1: Easel + Original Photo
  console.log(`[Fallback] Page ${pageNumber}: Trying Easel + original photo...`);
  const easelOriginalResult = await tryEaselWithOriginal(illustrationUrl, childPhotoUrl);
  if (easelOriginalResult) {
    return {
      imageUrl: easelOriginalResult,
      method: "easel-original",
      success: true,
    };
  }

  // Fallback 2: Nano Banana Pro
  if (enableNanoBanana) {
    console.log(`[Fallback] Page ${pageNumber}: Trying Nano Banana Pro...`);
    const nanoBananaResult = await tryNanoBanana(illustrationUrl, childPhotoUrl, pageNumber);
    if (nanoBananaResult) {
      return {
        imageUrl: nanoBananaResult,
        method: "nano-banana",
        success: true,
      };
    }
  }

  // Fallback 3: Basic face-swap
  if (enableBasicSwap) {
    console.log(`[Fallback] Page ${pageNumber}: Trying basic face-swap...`);
    const basicResult = await tryBasicFaceSwap(illustrationUrl, childPhotoUrl, pageNumber);
    if (basicResult) {
      return {
        imageUrl: basicResult,
        method: "basic-faceswap",
        success: true,
      };
    }
  }

  // Final fallback: Use original illustration
  console.log(`[Fallback] Page ${pageNumber}: All methods failed, using original illustration`);
  return {
    imageUrl: illustrationUrl,
    method: "original",
    success: false,
  };
}

/**
 * Process a page that doesn't have a child (no face swap needed)
 */
export function processNonChildPage(
  pageNumber: number,
  illustrationUrl: string
): PageProcessingResult {
  const page = getPageConfig(pageNumber);

  return {
    pageNumber,
    success: true,
    imageUrl: illustrationUrl,
    arabicText: page?.arabicText || "",
    method: "original",
    processingTime: 0,
  };
}
