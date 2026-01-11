import { fal } from "@fal-ai/client";
import { buildPageSpecificPrompt, getBasicFaceSwapContext } from "@/lib/prompts/story-pages";

// Configure the Fal client with the API key from environment
fal.config({
  credentials: process.env.FAL_KEY || "",
});

/**
 * Face swap result interface
 */
export interface FaceSwapResult {
  imageUrl: string;
}

/**
 * Face swap configuration options
 */
export interface FaceSwapOptions {
  pageNumber: number;          // Required for page-specific prompts
  resolution?: "1K" | "2K";    // Output resolution (default: 2K for quality)
}

/**
 * Upload an image to Fal's storage for use in generation
 */
export async function uploadToFalStorage(file: File | Blob): Promise<string> {
  try {
    const url = await fal.storage.upload(file);
    return url;
  } catch (error) {
    console.error("[Fal AI] Upload error:", error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Convert a base64 data URL to a Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Upload an image URL to Fal storage if it's a localhost URL
 * Fal AI cannot access localhost URLs, so we need to upload them first
 */
async function ensurePublicUrl(imageUrl: string): Promise<string> {
  // If it's already a public URL, return as-is
  if (!imageUrl.includes("localhost")) {
    return imageUrl;
  }

  console.log(`[Fal AI] Uploading local image to Fal storage...`);

  // Fetch the local image
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch local image: ${response.statusText}`);
  }

  const blob = await response.blob();

  // Upload to Fal storage
  const publicUrl = await fal.storage.upload(blob);
  console.log(`[Fal AI] Uploaded to Fal storage: ${publicUrl.substring(0, 50)}...`);

  return publicUrl;
}

/**
 * Face swap using Nano Banana Pro (Google Gemini 2.5 Flash Image)
 * Higher quality results with better blending and art style preservation
 *
 * Uses page-specific prompts for better context and 2K resolution for quality
 */
async function swapFaceWithNanoBanana(
  baseImageUrl: string,
  faceImageUrl: string,
  options: FaceSwapOptions
): Promise<FaceSwapResult> {
  const { pageNumber, resolution = "2K" } = options;

  console.log(`[Fal AI] Using Nano Banana Pro for page ${pageNumber} (${resolution} resolution)...`);

  const publicBaseUrl = await ensurePublicUrl(baseImageUrl);
  const publicFaceUrl = await ensurePublicUrl(faceImageUrl);

  // Get page-specific prompt with scene context, pose, and style DNA
  const prompt = buildPageSpecificPrompt(pageNumber);

  console.log(`[Fal AI] Page ${pageNumber} prompt length: ${prompt.length} chars`);

  const result = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
    input: {
      prompt,
      image_urls: [publicBaseUrl, publicFaceUrl],
      num_images: 1,
      aspect_ratio: "auto",
      output_format: "png",
      resolution, // 2K for better quality (costs 2x but worth it)
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log(`[Fal AI] Nano Banana Pro processing page ${pageNumber}...`);
      }
    },
  });

  const data = result.data as {
    images: Array<{ url: string; width: number; height: number; content_type: string }>;
  };

  console.log(`[Fal AI] Nano Banana Pro completed page ${pageNumber} successfully`);

  return {
    imageUrl: data.images[0].url,
  };
}

/**
 * Face swap using basic fal-ai/face-swap model (fallback)
 * Note: This model doesn't support prompts, but we log context for debugging
 */
async function swapFaceBasic(
  baseImageUrl: string,
  faceImageUrl: string,
  pageNumber: number
): Promise<FaceSwapResult> {
  console.log(`[Fal AI] Using basic face-swap model for page ${pageNumber}...`);

  const publicBaseUrl = await ensurePublicUrl(baseImageUrl);
  const publicFaceUrl = await ensurePublicUrl(faceImageUrl);

  // Log context for debugging (basic model doesn't use prompts)
  const context = getBasicFaceSwapContext(pageNumber);
  console.log(`[Fal AI] Page ${pageNumber} context: ${context}`);

  const result = await fal.subscribe("fal-ai/face-swap", {
    input: {
      base_image_url: publicBaseUrl,
      swap_image_url: publicFaceUrl,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log(`[Fal AI] Basic face swap in progress for page ${pageNumber}...`);
      }
    },
  });

  const data = result.data as {
    image: { url: string; width: number; height: number; content_type: string };
  };

  console.log(`[Fal AI] Basic face swap completed for page ${pageNumber}`);

  return {
    imageUrl: data.image.url,
  };
}

/**
 * Swap the face in an existing image with a new face
 *
 * Uses Nano Banana Pro (Google Gemini 2.5 Flash) for high-quality face swapping
 * with page-specific prompts that include scene context, child pose, and art style.
 *
 * Falls back to basic face-swap model if Nano Banana fails.
 *
 * @param baseImageUrl - The existing story illustration (from /pagesimages/)
 * @param faceImageUrl - The uploaded child's photo to use as the new face
 * @param pageNumber - The page number (1-22) for page-specific prompts
 */
export async function swapFace(
  baseImageUrl: string,
  faceImageUrl: string,
  pageNumber: number = 1
): Promise<FaceSwapResult> {
  try {
    console.log(`[Fal AI] Starting face swap for page ${pageNumber}...`);
    console.log(`[Fal AI] Base image: ${baseImageUrl.substring(0, 50)}...`);
    console.log(`[Fal AI] Face image: ${faceImageUrl.substring(0, 50)}...`);

    try {
      return await swapFaceWithNanoBanana(baseImageUrl, faceImageUrl, {
        pageNumber,
        resolution: "2K", // Higher quality output
      });
    } catch (nanoBananaError) {
      console.warn(`[Fal AI] Nano Banana Pro failed for page ${pageNumber}, falling back to basic face-swap:`, nanoBananaError);
      return await swapFaceBasic(baseImageUrl, faceImageUrl, pageNumber);
    }
  } catch (error) {
    console.error(`[Fal AI] Face swap error for page ${pageNumber}:`, error);
    throw new Error(`Face swap failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
