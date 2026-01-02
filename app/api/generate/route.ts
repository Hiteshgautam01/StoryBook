import { NextRequest } from "next/server";
import { generateImage } from "@/lib/fal-client";
import { composePrompt, composeArabicText } from "@/lib/prompts/composer";
import { FALCON_STORY } from "@/lib/prompts/falcon-story";
import { put } from "@vercel/blob";
import { Gender, GeneratedStoryPage, SSEEvent } from "@/types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const PARALLEL_BATCH_SIZE = 3; // Generate 3 pages concurrently for faster processing

interface GenerationRequest {
  childName: string;
  childDescription: string;
  gender: Gender;
  photoUrl?: string;
}

function createSSEMessage(event: SSEEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generatePageWithRetry(
  pageNumber: number,
  prompt: string,
  referenceImageUrl?: string,
  idWeight: number = 1.0,
  retries: number = MAX_RETRIES
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[Generate] Page ${pageNumber}, attempt ${attempt}/${retries}, idWeight: ${idWeight}`);

      const result = await generateImage({
        prompt,
        referenceImageUrl,
        aspectRatio: "16:9",
        numImages: 1,
        idWeight,
      });

      if (!result.images || result.images.length === 0) {
        throw new Error("No images generated");
      }

      const generatedImageUrl = result.images[0].url;

      // Persist to Vercel Blob
      try {
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

        return blob.url;
      } catch {
        // Return Fal URL if blob storage fails
        console.warn(`[Generate] Could not persist page ${pageNumber} to blob storage`);
        return generatedImageUrl;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      console.error(`[Generate] Page ${pageNumber} attempt ${attempt} failed:`, lastError.message);

      if (attempt < retries) {
        await delay(RETRY_DELAY * attempt);
      }
    }
  }

  throw lastError || new Error("Generation failed after all retries");
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const body: GenerationRequest = await request.json();
    const { childName, childDescription, gender, photoUrl } = body;

    if (!childName || !childDescription || !gender) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: childName, childDescription, gender" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const totalPages = FALCON_STORY.totalPages;

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const pages: GeneratedStoryPage[] = [];

        try {
          // Send initial progress
          controller.enqueue(
            encoder.encode(
              createSSEMessage({
                type: "progress",
                page: 0,
                total: totalPages,
                status: "generating",
              })
            )
          );

          // Generate pages in parallel batches for faster processing
          for (let batchStart = 0; batchStart < totalPages; batchStart += PARALLEL_BATCH_SIZE) {
            const batchEnd = Math.min(batchStart + PARALLEL_BATCH_SIZE, totalPages);
            const batchPageNums = Array.from(
              { length: batchEnd - batchStart },
              (_, i) => batchStart + i
            );

            console.log(`[Generate] Starting batch: pages ${batchStart} to ${batchEnd - 1}`);

            // Send progress update for batch start
            controller.enqueue(
              encoder.encode(
                createSSEMessage({
                  type: "progress",
                  page: batchStart,
                  total: totalPages,
                  status: "generating",
                })
              )
            );

            // Generate all pages in this batch concurrently
            const batchPromises = batchPageNums.map(async (pageNum) => {
              try {
                // Compose the prompt for this page
                const composed = composePrompt({
                  childName,
                  childDescription,
                  gender,
                  pageNumber: pageNum,
                });

                const arabicText = composeArabicText(childName, pageNum);

                // Generate the image with retries
                // Only pass reference image for pages where the child appears (flux-pulid)
                // Scenery-only pages use flux-pro without reference image
                const referenceUrl = composed.hasChild ? photoUrl : undefined;
                const imageUrl = await generatePageWithRetry(
                  pageNum,
                  composed.prompt,
                  referenceUrl,
                  composed.idWeight
                );

                // Create page data
                const page: GeneratedStoryPage = {
                  id: pageNum,
                  illustration: imageUrl,
                  text: arabicText,
                  backgroundColor: "#000",
                  status: "complete",
                  generatedImageUrl: imageUrl,
                };

                return { success: true, page, pageNum, imageUrl, arabicText };
              } catch (pageError) {
                console.error(`[Generate] Page ${pageNum} failed:`, pageError);

                // Create failed page entry
                const failedPage: GeneratedStoryPage = {
                  id: pageNum,
                  illustration: "",
                  text: composeArabicText(childName, pageNum),
                  backgroundColor: "#000",
                  status: "error",
                  errorMessage: pageError instanceof Error ? pageError.message : "Unknown error",
                };

                return { success: false, page: failedPage, pageNum, errorMessage: failedPage.errorMessage };
              }
            });

            // Wait for all pages in batch to complete
            const batchResults = await Promise.all(batchPromises);

            // Process results in order (important for consistent page ordering)
            for (const result of batchResults.sort((a, b) => a.pageNum - b.pageNum)) {
              pages.push(result.page);

              if (result.success) {
                // Send image event
                controller.enqueue(
                  encoder.encode(
                    createSSEMessage({
                      type: "image",
                      page: result.pageNum,
                      imageUrl: result.imageUrl!,
                      arabicText: result.arabicText!,
                    })
                  )
                );
                console.log(`[Generate] Page ${result.pageNum + 1}/${totalPages} completed`);
              } else {
                // Send error event
                controller.enqueue(
                  encoder.encode(
                    createSSEMessage({
                      type: "error",
                      page: result.pageNum,
                      message: result.errorMessage || "Generation failed",
                      retrying: false,
                    })
                  )
                );
              }
            }

            console.log(`[Generate] Batch complete: ${batchResults.filter(r => r.success).length}/${batchPageNums.length} succeeded`);
          }

          // Send completion event
          controller.enqueue(
            encoder.encode(
              createSSEMessage({
                type: "complete",
                pages,
              })
            )
          );

          controller.close();
        } catch (streamError) {
          console.error("[Generate] Stream error:", streamError);
          controller.enqueue(
            encoder.encode(
              createSSEMessage({
                type: "error",
                page: -1,
                message: streamError instanceof Error ? streamError.message : "Stream error",
                retrying: false,
              })
            )
          );
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
    console.error("[Generate API] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Generation failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
