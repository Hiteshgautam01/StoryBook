/**
 * InstantID Portrait Generation (Stage 1)
 *
 * Generates stylized watercolor portraits from the child's photo.
 * Each portrait matches a specific pose needed for the story pages.
 *
 * Uses fal-ai/instantid with the built-in Watercolor style.
 */

import { fal } from "@fal-ai/client";
import {
  PortraitPose,
  StylizedPortrait,
  PortraitCache,
  PortraitGenerationResult,
  InstantIDOptions,
} from "./types";
import { buildPortraitPrompt, PORTRAIT_NEGATIVE_PROMPT, ALL_POSES } from "@/lib/prompts/pose-prompts";

/**
 * InstantID API response structure
 */
interface InstantIDResponse {
  images: Array<{
    url: string;
    width: number;
    height: number;
    content_type: string;
  }>;
}

/**
 * Default InstantID configuration
 * Tuned for high face identity preservation with watercolor style
 */
const DEFAULT_CONFIG = {
  ipAdapterScale: 0.8,              // Face identity strength
  identityControlnetScale: 0.9,     // Identity preservation (higher = more like original)
  guidanceScale: 7.0,               // Prompt adherence
  numInferenceSteps: 30,            // Quality (30 is good balance)
};

/**
 * Generate a single stylized portrait for a given pose
 */
export async function generatePortrait(
  options: InstantIDOptions
): Promise<StylizedPortrait> {
  const {
    faceImageUrl,
    pose,
    ipAdapterScale = DEFAULT_CONFIG.ipAdapterScale,
    identityControlnetScale = DEFAULT_CONFIG.identityControlnetScale,
    guidanceScale = DEFAULT_CONFIG.guidanceScale,
    numInferenceSteps = DEFAULT_CONFIG.numInferenceSteps,
  } = options;

  const prompt = buildPortraitPrompt(pose);

  console.log(`[InstantID] Generating ${pose} portrait...`);
  console.log(`[InstantID] Prompt length: ${prompt.length} chars`);

  const result = await fal.subscribe("fal-ai/instantid", {
    input: {
      face_image_url: faceImageUrl,
      prompt,
      negative_prompt: PORTRAIT_NEGATIVE_PROMPT,
      style_name: "Watercolor",           // Built-in watercolor style
      ip_adapter_scale: ipAdapterScale,
      controlnet_conditioning_scale: identityControlnetScale,
      guidance_scale: guidanceScale,
      num_inference_steps: numInferenceSteps,
      enhance_face_region: true,          // Better face detail
      num_images: 1,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log(`[InstantID] ${pose} portrait in progress...`);
      }
    },
  });

  const data = result.data as InstantIDResponse;

  if (!data.images || data.images.length === 0) {
    console.error(`[InstantID] ${pose} response:`, JSON.stringify(result.data, null, 2));
    throw new Error(`InstantID returned no images for ${pose}`);
  }

  console.log(`[InstantID] ${pose} portrait generated successfully`);

  return {
    pose,
    imageUrl: data.images[0].url,
    width: data.images[0].width,
    height: data.images[0].height,
  };
}

/**
 * Generate all 7 stylized portraits in parallel
 *
 * This is the main entry point for Stage 1 of the hybrid pipeline.
 * Generates one portrait per pose type, which will be reused across
 * multiple pages that share the same pose.
 */
export async function generateAllPortraits(
  faceImageUrl: string,
  onPortraitComplete?: (pose: PortraitPose, success: boolean, completedCount: number) => void
): Promise<PortraitGenerationResult> {
  const startTime = Date.now();
  const portraits: PortraitCache = new Map();
  const failedPoses: PortraitPose[] = [];
  let completedCount = 0;

  console.log(`[InstantID] Starting portrait generation for ${ALL_POSES.length} poses...`);

  // Generate all portraits in parallel for speed
  const results = await Promise.allSettled(
    ALL_POSES.map(async (pose) => {
      try {
        const portrait = await generatePortrait({
          faceImageUrl,
          pose,
        });
        return { pose, portrait, success: true };
      } catch (error) {
        console.error(`[InstantID] Failed to generate ${pose} portrait:`, error);
        return { pose, portrait: null, success: false, error };
      }
    })
  );

  // Process results
  for (const result of results) {
    if (result.status === "fulfilled") {
      const { pose, portrait, success } = result.value;
      completedCount++;

      if (success && portrait) {
        portraits.set(pose, portrait);
      } else {
        failedPoses.push(pose);
      }

      onPortraitComplete?.(pose, success, completedCount);
    } else {
      // Promise rejected (shouldn't happen with our try/catch, but handle it)
      console.error("[InstantID] Unexpected promise rejection:", result.reason);
    }
  }

  const totalTime = Date.now() - startTime;

  console.log(`[InstantID] Portrait generation complete in ${totalTime}ms`);
  console.log(`[InstantID] Success: ${portraits.size}/${ALL_POSES.length}`);
  if (failedPoses.length > 0) {
    console.log(`[InstantID] Failed poses: ${failedPoses.join(", ")}`);
  }

  return {
    portraits,
    successCount: portraits.size,
    failedPoses,
    totalTime,
  };
}

/**
 * Generate a single portrait with retry logic
 */
export async function generatePortraitWithRetry(
  faceImageUrl: string,
  pose: PortraitPose,
  maxRetries: number = 2
): Promise<StylizedPortrait | null> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[InstantID] Generating ${pose} portrait (attempt ${attempt}/${maxRetries})...`);

      const portrait = await generatePortrait({
        faceImageUrl,
        pose,
      });

      return portrait;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[InstantID] ${pose} attempt ${attempt} failed:`, lastError.message);

      // Wait briefly before retry
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  console.error(`[InstantID] ${pose} failed after ${maxRetries} attempts:`, lastError?.message);
  return null;
}
