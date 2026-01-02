import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/fal-client";
import { composePrompt, composeArabicText } from "@/lib/prompts/composer";
import { put } from "@vercel/blob";
import { Gender } from "@/types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

interface RetryRequest {
  pageNumber: number;
  childName: string;
  childDescription: string;
  gender: Gender;
  photoUrl?: string;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    const body: RetryRequest = await request.json();
    const { pageNumber, childName, childDescription, gender, photoUrl } = body;

    if (pageNumber === undefined || !childName || !childDescription || !gender) {
      return NextResponse.json(
        { error: "Missing required fields: pageNumber, childName, childDescription, gender" },
        { status: 400 }
      );
    }

    console.log(`[Retry Page] Retrying page ${pageNumber}...`);

    // Compose the prompt for this page
    const composed = composePrompt({
      childName,
      childDescription,
      gender,
      pageNumber,
    });

    const arabicText = composeArabicText(childName, pageNumber);

    // Only pass reference image for pages where the child appears
    const referenceUrl = composed.hasChild ? photoUrl : undefined;

    let lastError: Error | null = null;

    // Try up to MAX_RETRIES times
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[Retry Page] Page ${pageNumber}, attempt ${attempt}/${MAX_RETRIES}`);

        const result = await generateImage({
          prompt: composed.prompt,
          referenceImageUrl: referenceUrl,
          aspectRatio: "16:9",
          numImages: 1,
          idWeight: composed.idWeight,
        });

        if (!result.images || result.images.length === 0) {
          throw new Error("No images generated");
        }

        const generatedImageUrl = result.images[0].url;

        // Persist to Vercel Blob
        let persistedUrl = generatedImageUrl;
        try {
          const imageResponse = await fetch(generatedImageUrl);
          const imageBlob = await imageResponse.blob();

          const blob = await put(
            `generated-pages/${Date.now()}-page-${pageNumber}-retry.png`,
            imageBlob,
            {
              access: "public",
              addRandomSuffix: true,
            }
          );

          persistedUrl = blob.url;
        } catch {
          console.warn(`[Retry Page] Could not persist page ${pageNumber} to blob storage`);
        }

        console.log(`[Retry Page] Page ${pageNumber} retry succeeded`);

        return NextResponse.json({
          success: true,
          pageNumber,
          imageUrl: persistedUrl,
          arabicText,
        });
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error");
        console.error(`[Retry Page] Page ${pageNumber} attempt ${attempt} failed:`, lastError.message);

        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY * attempt);
        }
      }
    }

    // All retries failed
    return NextResponse.json(
      {
        success: false,
        error: lastError?.message || "Retry failed after all attempts",
        pageNumber,
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("[Retry Page API] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Retry failed" },
      { status: 500 }
    );
  }
}
