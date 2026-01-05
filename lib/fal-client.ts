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
        prompt: `You are analyzing a photo of a child to create a detailed physical description for use in AI image generation.

CAREFULLY analyze this photo and describe the child's appearance. Focus on these specific features:

1. SKIN TONE (be precise): fair/pale, light brown, warm olive, caramel-brown, medium brown, dark brown, deep brown
2. FACE SHAPE: round, oval, heart-shaped, square, cherubic with full cheeks
3. EYE COLOR: dark brown, light brown, hazel, black, green, blue - also note if eyes are big/small, round/almond
4. HAIR:
   - Color: black, dark brown, light brown, auburn, blonde
   - Texture: straight, wavy, curly, coily/kinky
   - Style: short, medium, long, braided, ponytail, afro
5. NOSE: small rounded, button nose, wider nose, narrow nose
6. ANY DISTINCTIVE FEATURES: dimples, freckles, birthmarks, glasses

Respond with a SINGLE detailed sentence starting with "A [estimated-age]-year-old ${gender}" that includes ALL observable features. Be specific about skin tone and hair. Keep under 80 words.

Example: "A 5-year-old boy with warm caramel-brown skin, round cherubic face with full cheeks, large bright dark brown almond-shaped eyes, small button nose, dimples when smiling, and short tightly curled black hair"`,
      },
      logs: true,
    });

    // Type assertion for the result
    const data = result.data as { output: string };
    const description = data.output.trim();

    console.log(`[Fal AI] Photo analysis result: ${description}`);
    return description;
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
 * Child appearance characteristics for better face swap
 */
export interface ChildAppearance {
  skinTone?: string;       // e.g., "warm caramel-brown", "fair", "olive"
  hairColor?: string;      // e.g., "dark brown", "black", "light brown"
  hairStyle?: string;      // e.g., "curly", "straight", "wavy"
  eyeColor?: string;       // e.g., "dark brown", "hazel", "black"
  faceShape?: string;      // e.g., "round", "oval", "cherubic"
  age?: number;            // approximate age
  gender?: string;         // "boy", "girl", "child"
  fullDescription?: string; // Complete AI-generated description
}

/**
 * Parse an AI-generated child description into structured appearance data
 */
export function parseChildDescription(description: string, gender?: string, age?: number): ChildAppearance {
  const appearance: ChildAppearance = {
    fullDescription: description,
    gender: gender || "child",
    age: age || 5,
  };

  // Extract skin tone
  const skinTonePatterns = [
    /(?:warm |light |medium |dark |fair |olive |caramel|tan|brown|golden|pale|bronze)[\s-]*(?:brown|beige|olive|skin|complexion|tone)?/i,
    /skin[\s-]*(?:tone|color)?[:\s]+([a-z\s-]+)/i,
  ];
  for (const pattern of skinTonePatterns) {
    const match = description.match(pattern);
    if (match) {
      appearance.skinTone = match[0].toLowerCase().trim();
      break;
    }
  }

  // Extract hair color
  const hairColorPatterns = [
    /(?:dark |light |medium |jet |raven |golden |auburn |chestnut |sandy )?\s*(?:brown|black|blonde|red|auburn|chestnut)\s*hair/i,
    /hair[:\s]+([a-z\s-]+)/i,
  ];
  for (const pattern of hairColorPatterns) {
    const match = description.match(pattern);
    if (match) {
      appearance.hairColor = match[0].toLowerCase().replace("hair", "").trim();
      break;
    }
  }

  // Extract hair style
  const hairStylePatterns = [
    /(?:curly|straight|wavy|short|long|braided|ponytail|afro|coily)\s*(?:hair)?/i,
  ];
  for (const pattern of hairStylePatterns) {
    const match = description.match(pattern);
    if (match) {
      appearance.hairStyle = match[0].toLowerCase().replace("hair", "").trim();
      break;
    }
  }

  // Extract eye color
  const eyeColorPatterns = [
    /(?:dark |light |bright )?\s*(?:brown|black|hazel|green|blue)\s*eyes/i,
    /eyes[:\s]+([a-z\s-]+)/i,
  ];
  for (const pattern of eyeColorPatterns) {
    const match = description.match(pattern);
    if (match) {
      appearance.eyeColor = match[0].toLowerCase().replace("eyes", "").trim();
      break;
    }
  }

  // Extract face shape
  const faceShapePatterns = [
    /(?:round|oval|cherubic|heart-shaped|square)\s*(?:face|cheeks)?/i,
  ];
  for (const pattern of faceShapePatterns) {
    const match = description.match(pattern);
    if (match) {
      appearance.faceShape = match[0].toLowerCase().replace("face", "").replace("cheeks", "").trim();
      break;
    }
  }

  return appearance;
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
 * Build an optimized face swap prompt based on child's appearance
 */
function buildFaceSwapPrompt(appearance?: ChildAppearance): string {
  // Base instructions for high-quality face swap
  const basePrompt = `Replace the child's face in the first image (illustration) with the face from the second image (photo).
CRITICAL REQUIREMENTS:
1. PRESERVE the original illustrated art style, colors, brush strokes, and artistic rendering
2. MATCH the lighting direction and intensity from the illustration
3. BLEND the face naturally into the illustration's style (not photo-realistic)
4. KEEP the original pose, expression direction, and body position
5. MAINTAIN proper face proportions for the illustration's perspective`;

  // Add appearance-specific guidance if available
  if (appearance?.fullDescription) {
    return `${basePrompt}

CHILD APPEARANCE (from photo):
${appearance.fullDescription}

Ensure the swapped face accurately reflects these characteristics while adapting to the illustrated art style. The skin tone should be ${appearance.skinTone || "matched from the photo"}, hair should be ${appearance.hairColor || "as in photo"} ${appearance.hairStyle || ""}, and the face should maintain a ${appearance.faceShape || "natural"} shape appropriate for a ${appearance.age || 5}-year-old ${appearance.gender || "child"}.`;
  }

  // Simplified prompt if no detailed appearance
  if (appearance?.skinTone || appearance?.hairColor) {
    return `${basePrompt}

Match the child's ${appearance.skinTone ? `${appearance.skinTone} skin tone` : "skin tone"}, ${appearance.hairColor ? `${appearance.hairColor} hair` : "hair color"}, and facial features from the photo. The result should look like the child naturally belongs in this illustrated scene.`;
  }

  return `${basePrompt}

The result should look like the child from the photo naturally belongs in this illustrated scene, with proper skin tone matching and natural blending.`;
}

/**
 * Face swap using Nano Banana Pro (Google Gemini 2.5 Flash Image)
 * Higher quality results with better blending and art style preservation
 */
async function swapFaceWithNanoBanana(
  baseImageUrl: string,
  faceImageUrl: string,
  appearance?: ChildAppearance
): Promise<FaceSwapResult> {
  console.log(`[Fal AI] Using Nano Banana Pro for face swap...`);
  if (appearance?.fullDescription) {
    console.log(`[Fal AI] Using child appearance: ${appearance.fullDescription.substring(0, 80)}...`);
  }

  const publicBaseUrl = await ensurePublicUrl(baseImageUrl);
  const publicFaceUrl = await ensurePublicUrl(faceImageUrl);
  const prompt = buildFaceSwapPrompt(appearance);

  const result = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
    input: {
      prompt,
      image_urls: [publicBaseUrl, publicFaceUrl],
      num_images: 1,
      aspect_ratio: "auto",
      output_format: "png",
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log(`[Fal AI] Nano Banana Pro processing...`);
      }
    },
  });

  const data = result.data as {
    images: Array<{ url: string; width: number; height: number; content_type: string }>;
  };

  console.log(`[Fal AI] Nano Banana Pro completed successfully`);

  return {
    imageUrl: data.images[0].url,
  };
}

/**
 * Face swap using basic fal-ai/face-swap model (fallback)
 */
async function swapFaceBasic(
  baseImageUrl: string,
  faceImageUrl: string
): Promise<FaceSwapResult> {
  console.log(`[Fal AI] Using basic face-swap model...`);

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
        console.log(`[Fal AI] Basic face swap in progress...`);
      }
    },
  });

  const data = result.data as {
    image: { url: string; width: number; height: number; content_type: string };
  };

  console.log(`[Fal AI] Basic face swap completed`);

  return {
    imageUrl: data.image.url,
  };
}

/**
 * Swap the face in an existing image with a new face
 *
 * Uses Nano Banana Pro (Google Gemini 2.5 Flash) for high-quality face swapping.
 * Falls back to basic face-swap model if Nano Banana fails.
 *
 * @param baseImageUrl - The existing story illustration (from /pagesimages/)
 * @param faceImageUrl - The uploaded child's photo to use as the new face
 * @param options - Optional configuration including child appearance and model preference
 */
export async function swapFace(
  baseImageUrl: string,
  faceImageUrl: string,
  options?: {
    appearance?: ChildAppearance;
    useNanoBanana?: boolean;
  }
): Promise<FaceSwapResult> {
  const { appearance, useNanoBanana = true } = options || {};

  try {
    console.log(`[Fal AI] Starting face swap...`);
    console.log(`[Fal AI] Base image: ${baseImageUrl.substring(0, 50)}...`);
    console.log(`[Fal AI] Face image: ${faceImageUrl.substring(0, 50)}...`);
    if (appearance) {
      console.log(`[Fal AI] Child appearance provided for enhanced quality`);
    }

    if (useNanoBanana) {
      try {
        return await swapFaceWithNanoBanana(baseImageUrl, faceImageUrl, appearance);
      } catch (nanoBananaError) {
        console.warn(`[Fal AI] Nano Banana Pro failed, falling back to basic face-swap:`, nanoBananaError);
        return await swapFaceBasic(baseImageUrl, faceImageUrl);
      }
    }

    return await swapFaceBasic(baseImageUrl, faceImageUrl);
  } catch (error) {
    console.error("[Fal AI] Face swap error:", error);
    throw new Error(`Face swap failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
