import { NextRequest } from "next/server";
import { swapFace } from "@/lib/fal-client";
import { supabase, STORAGE_BUCKET, isSupabaseConfigured } from "@/lib/supabase";
import {
  STORY_PAGES,
  TOTAL_PAGES,
  personalizeArabicText,
  getPageImageUrl,
} from "@/lib/prompts/story-pages";

const MAX_RETRIES = 2;
const RETRY_DELAY = 3000;
const PARALLEL_BATCH_SIZE = 2; // Reduced to avoid overwhelming Fal AI

interface GenerateStoryRequest {
  childName: string;
  childPhotoUrl: string; // Uploaded child's photo for face swap
}

function createSSEMessage(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Process a single page - either face swap or use original
 */
async function processPage(
  pageNumber: number,
  childPhotoUrl: string,
  childName: string,
  baseUrl: string
): Promise<{
  pageNumber: number;
  imageUrl: string;
  arabicText: string;
  success: boolean;
  error?: string;
}> {
  const pageConfig = STORY_PAGES.find((p) => p.pageNumber === pageNumber);

  if (!pageConfig) {
    return {
      pageNumber,
      imageUrl: "",
      arabicText: "",
      success: false,
      error: `Page ${pageNumber} not found`,
    };
  }

  const arabicText = personalizeArabicText(pageConfig.arabicText, childName);
  const originalImageUrl = getPageImageUrl(pageNumber, baseUrl);

  // If no child in this page, use original image
  if (!pageConfig.hasChild) {
    console.log(`[Generate Story] Page ${pageNumber}: No child, using original`);
    return {
      pageNumber,
      imageUrl: originalImageUrl,
      arabicText,
      success: true,
    };
  }

  // Face swap needed - retry up to MAX_RETRIES times
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `[Generate Story] Page ${pageNumber}: Face swap attempt ${attempt}/${MAX_RETRIES}`
      );

      const result = await swapFace(originalImageUrl, childPhotoUrl, pageNumber);

      // Persist to Supabase Storage for permanent storage (if configured)
      let persistedUrl = result.imageUrl;
      if (isSupabaseConfigured() && supabase) {
        try {
          const imageResponse = await fetch(result.imageUrl);
          const imageBlob = await imageResponse.blob();
          const filename = `personalized-stories/${Date.now()}-page-${pageNumber}.png`;

          const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filename, imageBlob, {
              contentType: "image/png",
              upsert: true,
            });

          if (error) {
            throw error;
          }

          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.path);

          persistedUrl = urlData.publicUrl;
          console.log(`[Generate Story] Page ${pageNumber}: Saved to Supabase storage`);
        } catch (storageError) {
          console.warn(
            `[Generate Story] Page ${pageNumber}: Could not persist to storage, using Fal URL`
          );
        }
      } else {
        console.log(`[Generate Story] Page ${pageNumber}: Supabase not configured, using Fal URL`);
      }

      return {
        pageNumber,
        imageUrl: persistedUrl,
        arabicText,
        success: true,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      console.error(
        `[Generate Story] Page ${pageNumber} attempt ${attempt} failed:`,
        lastError.message
      );

      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY * attempt);
      }
    }
  }

  // All retries failed - return original image as fallback
  console.warn(
    `[Generate Story] Page ${pageNumber}: All retries failed, using original image`
  );
  return {
    pageNumber,
    imageUrl: originalImageUrl,
    arabicText,
    success: false,
    error: lastError?.message || "Face swap failed",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateStoryRequest = await request.json();
    const { childName, childPhotoUrl } = body;

    if (!childName || !childPhotoUrl) {
      return new Response(
        JSON.stringify({ error: "childName and childPhotoUrl are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get base URL for images
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;

    console.log(`[Generate Story] Starting personalization for ${childName}`);
    console.log(`[Generate Story] Child photo: ${childPhotoUrl.substring(0, 50)}...`);
    console.log(`[Generate Story] Total pages: ${TOTAL_PAGES}`);

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const pages: Array<{
          pageNumber: number;
          imageUrl: string;
          arabicText: string;
          success: boolean;
        }> = [];

        try {
          // Process pages in parallel batches
          for (
            let batchStart = 0;
            batchStart < TOTAL_PAGES;
            batchStart += PARALLEL_BATCH_SIZE
          ) {
            const batchEnd = Math.min(
              batchStart + PARALLEL_BATCH_SIZE,
              TOTAL_PAGES
            );
            const batchPageNumbers = STORY_PAGES.slice(batchStart, batchEnd).map(
              (p) => p.pageNumber
            );

            console.log(
              `[Generate Story] Processing batch: pages ${batchPageNumbers.join(", ")}`
            );

            // Send progress event
            controller.enqueue(
              encoder.encode(
                createSSEMessage({
                  type: "progress",
                  page: batchStart + 1,
                  total: TOTAL_PAGES,
                  status: "processing",
                })
              )
            );

            // Process batch in parallel
            const batchResults = await Promise.all(
              batchPageNumbers.map((pageNum) =>
                processPage(pageNum, childPhotoUrl, childName, baseUrl)
              )
            );

            // Send results for each page in order
            for (const result of batchResults.sort(
              (a, b) => a.pageNumber - b.pageNumber
            )) {
              pages.push({
                pageNumber: result.pageNumber,
                imageUrl: result.imageUrl,
                arabicText: result.arabicText,
                success: result.success,
              });

              if (result.success) {
                controller.enqueue(
                  encoder.encode(
                    createSSEMessage({
                      type: "image",
                      page: result.pageNumber,
                      imageUrl: result.imageUrl,
                      arabicText: result.arabicText,
                    })
                  )
                );
              } else {
                controller.enqueue(
                  encoder.encode(
                    createSSEMessage({
                      type: "error",
                      page: result.pageNumber,
                      message: result.error || "Processing failed",
                      fallbackUrl: result.imageUrl, // Original image as fallback
                    })
                  )
                );
              }

              console.log(
                `[Generate Story] Page ${result.pageNumber}/${TOTAL_PAGES} ${
                  result.success ? "completed" : "failed (using fallback)"
                }`
              );
            }
          }

          // Send completion event
          const successCount = pages.filter((p) => p.success).length;
          controller.enqueue(
            encoder.encode(
              createSSEMessage({
                type: "complete",
                totalPages: TOTAL_PAGES,
                successCount,
                pages: pages.sort((a, b) => a.pageNumber - b.pageNumber),
              })
            )
          );

          console.log(
            `[Generate Story] Complete: ${successCount}/${TOTAL_PAGES} pages personalized`
          );
        } catch (error) {
          console.error("[Generate Story] Stream error:", error);
          controller.enqueue(
            encoder.encode(
              createSSEMessage({
                type: "fatal_error",
                message:
                  error instanceof Error ? error.message : "Unknown error",
              })
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[Generate Story API] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Generation failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
