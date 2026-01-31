/**
 * Easel Advanced Face Swap (Stage 2)
 *
 * Composites stylized portraits onto pre-made story illustrations.
 * Uses easel-ai/advanced-face-swap for high-quality blending.
 *
 * This stage takes the watercolor portraits from Stage 1 and
 * swaps them onto the existing book illustrations.
 */

import { fal } from "@fal-ai/client";
import { EaselFaceSwapOptions } from "./types";

/**
 * Easel API response structure
 */
interface EaselFaceSwapResponse {
  image: {
    url: string;
    width: number;
    height: number;
    content_type: string;
  };
}

/**
 * Result of Easel face swap
 */
export interface EaselSwapResult {
  imageUrl: string;
  width: number;
  height: number;
}

/**
 * Perform face swap using Easel Advanced
 *
 * This composites the stylized portrait onto the illustration.
 * Since both are now in watercolor style, the blending is seamless.
 *
 * Easel API parameters:
 * - face_image_0: The face to swap from (our stylized portrait)
 * - target_image: The image to swap faces into (our illustration)
 * - gender_0: Gender hint for face detection
 * - workflow_type: "illustration_hair" preserves target illustration's hair and artistic style
 * - face_restore_strength: 0.75 = high restoration for better face quality in all poses (especially profiles)
 * - face_detection_threshold: 0.6 = moderate threshold optimized for profile and angled views
 * - blend_strength: 0.65 = balanced blending that prevents hair bleeding while maintaining smooth face edges
 * - upscale: 2x quality boost
 */
export async function easelFaceSwap(
  options: EaselFaceSwapOptions
): Promise<EaselSwapResult> {
  const { baseImageUrl, swapImageUrl, upscale = true, gender = "boy" } = options;

  // Map gender to Easel API format
  const easelGender = gender === "girl" ? "female" : "male";

  console.log(`[Easel] Starting face swap...`);
  console.log(`[Easel] Target (illustration): ${baseImageUrl.substring(0, 50)}...`);
  console.log(`[Easel] Face (portrait): ${swapImageUrl.substring(0, 50)}...`);
  console.log(`[Easel] Upscale: ${upscale}`);
  console.log(`[Easel] DIMENSION TEST - Will log output dimensions`);

  try {
    // Use generic model ID to bypass strict typing
    // The Fal SDK accepts URLs as strings at runtime
    const result = await fal.subscribe("easel-ai/advanced-face-swap" as const, {
      input: {
        face_image_0: swapImageUrl,           // The face to swap from (stylized portrait)
        target_image: baseImageUrl,            // The target image (illustration)
        gender_0: easelGender,                 // Gender hint for face detection (dynamic based on child)
        workflow_type: "target_hair",          // FIXED: Use valid workflow type (target_hair preserves target's hair)
        upscale,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log(`[Easel] Face swap in progress...`);
        }
      },
    });

    const data = result.data as EaselFaceSwapResponse;

    // Enhanced debugging for API response
    console.log(`[Easel] API Response structure:`, JSON.stringify(data, null, 2));

    if (!data.image) {
      console.error(`[Easel] Failed response data:`, data);
      throw new Error("Easel returned no image");
    }

    console.log(`[Easel] Face swap completed successfully`);
    console.log(`[Easel] DIMENSION TEST - Output: ${data.image.width}x${data.image.height}px (ratio: ${(data.image.width / data.image.height).toFixed(2)}:1)`);

    return {
      imageUrl: data.image.url,
      width: data.image.width,
      height: data.image.height,
    };
  } catch (error) {
    console.error(`[Easel] Detailed error:`, error);
    // Check if it's a FAL API error with more details
    if (error && typeof error === 'object' && 'body' in error) {
      console.error(`[Easel] Error body:`, JSON.stringify((error as any).body, null, 2));
    }
    throw error;
  }
}

/**
 * Perform face swap with timeout
 *
 * Easel can sometimes take longer than expected, so we add a timeout.
 */
export async function easelFaceSwapWithTimeout(
  options: EaselFaceSwapOptions,
  timeoutMs: number = 120000 // 2 minute default
): Promise<EaselSwapResult> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Easel face swap timed out")), timeoutMs);
  });

  return Promise.race([
    easelFaceSwap(options),
    timeoutPromise,
  ]);
}

/**
 * Perform face swap with retry logic
 */
export async function easelFaceSwapWithRetry(
  options: EaselFaceSwapOptions,
  maxRetries: number = 2
): Promise<EaselSwapResult | null> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Easel] Face swap attempt ${attempt}/${maxRetries}...`);

      const result = await easelFaceSwapWithTimeout(options);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[Easel] Attempt ${attempt} failed:`, lastError.message);

      // Wait before retry with exponential backoff
      if (attempt < maxRetries) {
        const waitTime = 1000 * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error(`[Easel] Face swap failed after ${maxRetries} attempts:`, lastError?.message);
  return null;
}

/**
 * Check if a URL is accessible (useful for verifying uploaded images)
 */
export async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
