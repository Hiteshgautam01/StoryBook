import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/fal-client";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, referenceImageUrl, pageNumber, aspectRatio = "16:9", hasChild = true } = body as {
      prompt: string;
      referenceImageUrl?: string;
      pageNumber: number;
      aspectRatio?: string;
      hasChild?: boolean;
    };

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (pageNumber === undefined) {
      return NextResponse.json(
        { error: "Page number is required" },
        { status: 400 }
      );
    }

    const useReference = hasChild && referenceImageUrl;
    console.log(`[Generate Image API] Generating page ${pageNumber} using ${useReference ? 'flux-pulid (with reference)' : 'flux-pro (no reference)'}...`);

    // Generate the image using Fal AI
    // Only pass referenceImageUrl for pages where the child appears
    const result = await generateImage({
      prompt,
      referenceImageUrl: useReference ? referenceImageUrl : undefined,
      aspectRatio,
      numImages: 1,
    });

    if (!result.images || result.images.length === 0) {
      throw new Error("No images generated");
    }

    const generatedImageUrl = result.images[0].url;

    // Optionally store the generated image in Vercel Blob for persistence
    // (Fal AI URLs may expire)
    let persistedUrl = generatedImageUrl;

    try {
      // Fetch the generated image and store it
      const imageResponse = await fetch(generatedImageUrl);
      const imageBlob = await imageResponse.blob();

      const blob = await put(
        `generated-pages/${Date.now()}-page-${pageNumber}.png`,
        imageBlob,
        {
          access: "public",
          addRandomSuffix: true,
        }
      );

      persistedUrl = blob.url;
    } catch (storageError) {
      console.warn("[Generate Image API] Could not persist image, using Fal URL:", storageError);
      // Continue with the original Fal URL if storage fails
    }

    console.log(`[Generate Image API] Page ${pageNumber} generated successfully`);

    return NextResponse.json({
      success: true,
      pageNumber,
      imageUrl: persistedUrl,
      seed: result.seed,
    });
  } catch (error) {
    console.error("[Generate Image API] Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Image generation failed",
        pageNumber: (await request.json().catch(() => ({})))?.pageNumber,
      },
      { status: 500 }
    );
  }
}
