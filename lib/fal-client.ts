import { fal } from "@fal-ai/client";

// Configure the Fal client with the API key from environment
fal.config({
  credentials: process.env.FAL_KEY || "",
});

// Common negative prompt to avoid AI generation artifacts
export const NEGATIVE_PROMPT = "blurry, low quality, distorted, deformed, ugly, bad anatomy, extra limbs, extra fingers, mutated hands, poorly drawn face, mutation, disfigured, watermark, text, signature, cropped, worst quality, jpeg artifacts, duplicate, error";

export interface GenerateImageOptions {
  prompt: string;
  referenceImageUrl?: string; // Child's photo for face consistency
  aspectRatio?: string;
  numImages?: number;
  seed?: number;
  idWeight?: number; // Face identity preservation (0-3, default 1.0)
  negativePrompt?: string; // Custom negative prompt (uses default if not provided)
}

export interface GeneratedImage {
  url: string;
  width: number;
  height: number;
  contentType: string;
}

export interface GenerateImageResult {
  images: GeneratedImage[];
  seed: number;
  prompt: string;
}

/**
 * Generate an image using Fal AI's flux-pulid model
 *
 * flux-pulid uses PuLID (Pure and Lightning ID) technology to maintain
 * face consistency across generated images using a reference photo.
 */
export async function generateImage(options: GenerateImageOptions): Promise<GenerateImageResult> {
  const {
    prompt,
    referenceImageUrl,
    aspectRatio = "16:9",
    numImages = 1,
    seed,
    idWeight = 1.0,
    negativePrompt = NEGATIVE_PROMPT,
  } = options;

  try {
    // If we have a reference image, use flux-pulid for face consistency
    if (referenceImageUrl) {
      console.log(`[Fal AI] Using flux-pulid with reference image (id_weight: ${idWeight})`);

      const result = await fal.subscribe("fal-ai/flux-pulid", {
        input: {
          prompt,
          reference_image_url: referenceImageUrl,
          negative_prompt: negativePrompt,
          guidance_scale: 4, // Recommended for flux-pulid
          num_inference_steps: 20,
          image_size: aspectRatio === "16:9" ? "landscape_16_9" : "landscape_4_3",
          id_weight: idWeight, // Adjustable face identity preservation (0-3)
          true_cfg: 1.0,
          ...(seed !== undefined && { seed }),
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log(`[Fal AI] flux-pulid generation in progress...`);
          }
        },
      });

      const data = result.data as {
        images: Array<{ url: string; width: number; height: number; content_type: string }>;
        seed: number;
        prompt: string;
      };

      return {
        images: data.images.map((img) => ({
          url: img.url,
          width: img.width,
          height: img.height,
          contentType: img.content_type || "image/png",
        })),
        seed: data.seed,
        prompt: data.prompt || prompt,
      };
    }

    // Fallback to flux-pro if no reference image (for pages without the child)
    console.log(`[Fal AI] Using flux-pro (no reference image)`);

    const result = await fal.subscribe("fal-ai/flux-pro/v1.1", {
      input: {
        prompt,
        num_images: numImages,
        image_size: aspectRatio === "16:9" ? "landscape_16_9" : "landscape_4_3",
        enable_safety_checker: true,
        output_format: "png",
        ...(seed !== undefined && { seed }),
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log(`[Fal AI] flux-pro generation in progress...`);
        }
      },
    });

    const data = result.data as {
      images: Array<{ url: string; width: number; height: number; content_type: string }>;
      seed: number;
      prompt: string;
    };

    return {
      images: data.images.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        contentType: img.content_type,
      })),
      seed: data.seed,
      prompt: data.prompt,
    };
  } catch (error) {
    console.error("[Fal AI] Generation error:", error);
    throw new Error(`Image generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Analyze an image using Fal AI's vision model to extract child description
 */
export async function analyzeChildPhoto(imageUrl: string, gender: string): Promise<string> {
  try {
    // Using LLaVA vision model for image analysis
    const result = await fal.subscribe("fal-ai/llavav15-13b", {
      input: {
        image_url: imageUrl,
        prompt: `Analyze this photo of a child and provide a detailed physical description suitable for an AI image generation prompt. Include:
- Approximate age (in years)
- Skin tone (e.g., fair, light brown, caramel, warm olive, dark brown)
- Face shape (e.g., round, oval, cherubic)
- Eye color and shape
- Hair color, texture, and style
- Any distinctive features

Format the description as a single flowing sentence starting with "A [age]-year-old ${gender}" that can be directly used in an image generation prompt. Keep it under 100 words.

Example format: "A 5-year-old boy with warm caramel-brown skin, round cherubic face with full cheeks, bright dark brown eyes, small rounded nose, a wide joyful smile, short curly dark brown hair"`,
      },
      logs: true,
    });

    // Type assertion for the result
    const data = result.data as { output: string };
    return data.output.trim();
  } catch (error) {
    console.error("[Fal AI] Photo analysis error:", error);
    throw new Error(`Photo analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
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
 * Face swap result interface
 */
export interface FaceSwapResult {
  imageUrl: string;
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
 * Swap the face in an existing image with a new face
 *
 * Uses Fal AI's face-swap model to replace the child's face
 * in existing story illustrations with the uploaded child's photo.
 *
 * @param baseImageUrl - The existing story illustration (from /pagesimages/)
 * @param faceImageUrl - The uploaded child's photo to use as the new face
 */
export async function swapFace(
  baseImageUrl: string,
  faceImageUrl: string
): Promise<FaceSwapResult> {
  try {
    console.log(`[Fal AI] Starting face swap...`);
    console.log(`[Fal AI] Base image: ${baseImageUrl.substring(0, 50)}...`);
    console.log(`[Fal AI] Face image: ${faceImageUrl.substring(0, 50)}...`);

    // Upload local images to Fal storage if needed
    const publicBaseUrl = await ensurePublicUrl(baseImageUrl);
    const publicFaceUrl = await ensurePublicUrl(faceImageUrl);

    const result = await fal.subscribe("fal-ai/face-swap", {
      input: {
        base_image_url: publicBaseUrl,
        swap_image_url: publicFaceUrl,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log(`[Fal AI] Face swap in progress...`);
        }
      },
    });

    const data = result.data as {
      image: { url: string; width: number; height: number; content_type: string };
    };

    console.log(`[Fal AI] Face swap completed successfully`);

    return {
      imageUrl: data.image.url,
    };
  } catch (error) {
    console.error("[Fal AI] Face swap error:", error);
    throw new Error(`Face swap failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
