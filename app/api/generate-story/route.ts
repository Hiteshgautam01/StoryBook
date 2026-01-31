import { NextRequest } from "next/server";
import { supabase, STORAGE_BUCKET, isSupabaseConfigured } from "@/lib/supabase";
import {
  executeHybridPipeline,
  SSEEvent,
  PageProcessingResult,
} from "@/lib/hybrid-pipeline";

// Increase timeout for long-running story generation
// Vercel Pro: max 300s (5 min), Hobby: max 60s
export const maxDuration = 300;

interface GenerateStoryRequest {
  childName: string;
  childPhotoUrl: string; // Uploaded child's photo for face swap
  gender?: "boy" | "girl"; // Optional gender for portrait generation
  pageNumbers?: number[]; // Optional specific pages to generate (default: all)
}

function createSSEMessage(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

/**
 * Persist image to Supabase Storage for permanent storage
 */
async function persistToStorage(
  imageUrl: string,
  pageNumber: number
): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    return imageUrl; // Return original URL if Supabase not configured
  }

  try {
    const imageResponse = await fetch(imageUrl);
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

    console.log(`[Generate Story] Page ${pageNumber}: Saved to Supabase storage`);
    return urlData.publicUrl;
  } catch (storageError) {
    console.warn(
      `[Generate Story] Page ${pageNumber}: Could not persist to storage, using original URL`
    );
    return imageUrl;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateStoryRequest = await request.json();
    const { childName, childPhotoUrl, gender, pageNumbers } = body;

    if (!childName || !childPhotoUrl) {
      return new Response(
        JSON.stringify({ error: "childName and childPhotoUrl are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get base URL for images
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;

    console.log(`[Generate Story] Starting hybrid pipeline for child: "${childName}"`);
    console.log(`[Generate Story] Child name length: ${childName.length} characters`);
    console.log(`[Generate Story] Child photo: ${childPhotoUrl.substring(0, 50)}...`);
    console.log(`[Generate Story] Gender: ${gender || "not specified"}`);
    console.log(`[Generate Story] Pages: ${pageNumbers ? pageNumbers.join(", ") : "all"}`);

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const allPages: PageProcessingResult[] = [];

        // SSE sender function for the hybrid pipeline
        const sendSSE = (event: SSEEvent) => {
          try {
            // Check if controller is still open before enqueueing
            if (controller.desiredSize !== null) {
              controller.enqueue(encoder.encode(createSSEMessage(event)));
            }
          } catch (error) {
            // Silently ignore if stream is already closed
            console.log('[Generate Story] SSE stream closed, continuing without updates');
          }
        };

        try {
          // Execute the hybrid pipeline
          const result = await executeHybridPipeline(
            {
              childPhotoUrl,
              childName,
              gender,
              pageNumbers,
              baseUrl,
              concurrency: 3,
              enableFallbacks: true,
            },
            async (event: SSEEvent) => {
              // Handle image events specially to persist to Supabase
              if (event.type === "image") {
                // Persist successful face swaps to Supabase
                const persistedUrl = await persistToStorage(
                  event.imageUrl,
                  event.pageNumber
                );

                // Update event with persisted URL
                const persistedEvent = {
                  ...event,
                  imageUrl: persistedUrl,
                };

                allPages.push({
                  pageNumber: event.pageNumber,
                  imageUrl: persistedUrl,
                  arabicText: event.arabicText,
                  success: event.success,
                  method: event.method,
                  processingTime: 0,
                });

                sendSSE(persistedEvent);
              } else {
                // Pass through other events unchanged
                sendSSE(event);
              }
            }
          );

          // Send final completion with all pages
          const successCount = allPages.filter(p => p.success).length;

          try {
            if (controller.desiredSize !== null) {
              controller.enqueue(
                encoder.encode(
                  createSSEMessage({
                    type: "complete",
                    totalPages: result.pages.length,
                    successCount,
                    failedCount: result.pages.length - successCount,
                    totalTime: result.totalTime,
                    portraitTime: result.portraitGenerationTime,
                    pageTime: result.pageProcessingTime,
                    methodBreakdown: result.methodBreakdown,
                    pages: allPages.sort((a, b) => a.pageNumber - b.pageNumber),
                  })
                )
              );
            }
          } catch (error) {
            console.log('[Generate Story] Could not send completion event, stream closed');
          }

          console.log(`[Generate Story] Complete in ${result.totalTime}ms`);
          console.log(`[Generate Story] Success: ${successCount}/${result.pages.length}`);
          console.log(`[Generate Story] Methods used:`, result.methodBreakdown);
        } catch (error) {
          console.error("[Generate Story] Pipeline error:", error);
          try {
            if (controller.desiredSize !== null) {
              controller.enqueue(
                encoder.encode(
                  createSSEMessage({
                    type: "error",
                    message: error instanceof Error ? error.message : "Unknown error",
                  })
                )
              );
            }
          } catch (enqueueError) {
            console.log('[Generate Story] Could not send error event, stream closed');
          }
        } finally {
          try {
            controller.close();
          } catch (error) {
            // Controller already closed
          }
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
