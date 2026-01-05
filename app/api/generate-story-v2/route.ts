import { NextRequest } from "next/server";
import {
  generateImage,
  analyzeChildPhoto,
  parseChildDescription,
  ChildAppearance,
} from "@/lib/fal-client";
import { supabase, STORAGE_BUCKET, isSupabaseConfigured } from "@/lib/supabase";
import {
  FALCON_STORY,
  getPageTemplate,
  OUTFITS,
  GOLDEN_FALCON_DESCRIPTION,
} from "@/lib/prompts/falcon-story";
import { createDefaultDescription } from "@/lib/prompts/composer";
import { Gender } from "@/types";

const MAX_RETRIES = 2;
const RETRY_DELAY = 3000;
const PARALLEL_BATCH_SIZE = 2; // Lower batch size for generation (more resource intensive)

interface GenerateStoryRequest {
  childName: string;
  childPhotoUrl: string;
  gender?: Gender;
}

function createSSEMessage(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Compose the full prompt for a page
 */
function composePagePrompt(
  pageNumber: number,
  childDescription: string,
  gender: Gender
): { prompt: string; hasChild: boolean; idWeight: number } {
  const pageTemplate = getPageTemplate(pageNumber);

  if (!pageTemplate) {
    throw new Error(`No template found for page ${pageNumber}`);
  }

  const outfit = pageTemplate.isHomeSetting
    ? OUTFITS[gender].home
    : OUTFITS[gender].journey;

  let prompt = pageTemplate.promptTemplate;

  // Replace template variables
  // For child description, we integrate it naturally into the prompt
  if (pageTemplate.hasChild) {
    // Insert child description after "A young child" or similar phrases
    prompt = prompt.replace(
      /A young child/g,
      `${childDescription}`
    );
  }

  prompt = prompt.replace(/\{\{outfit\}\}/g, outfit);
  prompt = prompt.replace(/\{\{childName\}\}/g, "the child"); // In image prompts, we don't use names

  return {
    prompt,
    hasChild: pageTemplate.hasChild,
    idWeight: pageTemplate.idWeight ?? 1.0,
  };
}

/**
 * Get personalized Arabic text for a page
 */
function getArabicText(pageNumber: number, childName: string): string {
  const pageTemplate = getPageTemplate(pageNumber);
  if (!pageTemplate) return "";
  return pageTemplate.arabicText.replace(/\{\{childName\}\}/g, childName);
}

/**
 * Process a single page - generate with flux-pulid or flux-pro
 */
async function processPage(
  pageNumber: number,
  childPhotoUrl: string,
  childName: string,
  childDescription: string,
  gender: Gender
): Promise<{
  pageNumber: number;
  imageUrl: string;
  arabicText: string;
  success: boolean;
  error?: string;
}> {
  const arabicText = getArabicText(pageNumber, childName);

  try {
    const { prompt, hasChild, idWeight } = composePagePrompt(
      pageNumber,
      childDescription,
      gender
    );

    console.log(`[Generate V2] Page ${pageNumber}: hasChild=${hasChild}, idWeight=${idWeight}`);
    console.log(`[Generate V2] Prompt preview: ${prompt.substring(0, 100)}...`);

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[Generate V2] Page ${pageNumber}: Generation attempt ${attempt}/${MAX_RETRIES}`);

        // Generate image using flux-pulid (with reference) or flux-pro (without)
        const result = await generateImage({
          prompt,
          referenceImageUrl: hasChild ? childPhotoUrl : undefined,
          aspectRatio: "16:9",
          numImages: 1,
          idWeight: hasChild ? idWeight : undefined,
        });

        const generatedImageUrl = result.images[0].url;

        // Persist to Supabase Storage
        let persistedUrl = generatedImageUrl;
        if (isSupabaseConfigured() && supabase) {
          try {
            const imageResponse = await fetch(generatedImageUrl);
            const imageBlob = await imageResponse.blob();
            const filename = `generated-stories/${Date.now()}-page-${pageNumber}.png`;

            const { data, error } = await supabase.storage
              .from(STORAGE_BUCKET)
              .upload(filename, imageBlob, {
                contentType: "image/png",
                upsert: true,
              });

            if (!error && data) {
              const { data: urlData } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(data.path);
              persistedUrl = urlData.publicUrl;
              console.log(`[Generate V2] Page ${pageNumber}: Saved to Supabase`);
            }
          } catch (storageError) {
            console.warn(`[Generate V2] Page ${pageNumber}: Storage failed, using Fal URL`);
          }
        }

        return {
          pageNumber,
          imageUrl: persistedUrl,
          arabicText,
          success: true,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error");
        console.error(`[Generate V2] Page ${pageNumber} attempt ${attempt} failed:`, lastError.message);

        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY * attempt);
        }
      }
    }

    // All retries failed
    console.error(`[Generate V2] Page ${pageNumber}: All retries failed`);
    return {
      pageNumber,
      imageUrl: "",
      arabicText,
      success: false,
      error: lastError?.message || "Generation failed",
    };
  } catch (error) {
    console.error(`[Generate V2] Page ${pageNumber} error:`, error);
    return {
      pageNumber,
      imageUrl: "",
      arabicText,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateStoryRequest = await request.json();
    const { childName, childPhotoUrl, gender = "boy" } = body;

    if (!childName || !childPhotoUrl) {
      return new Response(
        JSON.stringify({ error: "childName and childPhotoUrl are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const totalPages = FALCON_STORY.totalPages;

    console.log(`[Generate V2] Starting generation for ${childName}`);
    console.log(`[Generate V2] Child photo: ${childPhotoUrl.substring(0, 50)}...`);
    console.log(`[Generate V2] Total pages: ${totalPages}`);
    console.log(`[Generate V2] Using flux-pulid for face identity preservation`);

    // Step 1: Analyze child's photo to extract appearance
    let childAppearance: ChildAppearance;
    let childDescription: string;
    const genderTerm = gender === "boy" ? "boy" : gender === "girl" ? "girl" : "child";

    try {
      console.log(`[Generate V2] Analyzing child's photo...`);
      const description = await analyzeChildPhoto(childPhotoUrl, genderTerm);
      childAppearance = parseChildDescription(description, genderTerm, 5);
      childDescription = description;

      console.log(`[Generate V2] Child appearance extracted:`);
      console.log(`  - Full: ${childDescription}`);
      console.log(`  - Skin: ${childAppearance.skinTone || "not detected"}`);
      console.log(`  - Hair: ${childAppearance.hairColor || "not detected"}`);
    } catch (analysisError) {
      console.warn(`[Generate V2] Photo analysis failed, using default:`, analysisError);
      childDescription = createDefaultDescription(gender);
      childAppearance = parseChildDescription(childDescription, genderTerm, 5);
    }

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
          // Send initial event with child description
          controller.enqueue(
            encoder.encode(
              createSSEMessage({
                type: "analysis_complete",
                childDescription,
                appearance: childAppearance,
              })
            )
          );

          // Process pages in parallel batches
          for (let batchStart = 0; batchStart < totalPages; batchStart += PARALLEL_BATCH_SIZE) {
            const batchEnd = Math.min(batchStart + PARALLEL_BATCH_SIZE, totalPages);
            const batchPageNumbers = Array.from(
              { length: batchEnd - batchStart },
              (_, i) => batchStart + i
            );

            console.log(`[Generate V2] Processing batch: pages ${batchPageNumbers.join(", ")}`);

            // Send progress event
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

            // Process batch in parallel
            const batchResults = await Promise.all(
              batchPageNumbers.map((pageNum) =>
                processPage(pageNum, childPhotoUrl, childName, childDescription, gender)
              )
            );

            // Send results for each page
            for (const result of batchResults.sort((a, b) => a.pageNumber - b.pageNumber)) {
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
                      message: result.error || "Generation failed",
                    })
                  )
                );
              }

              console.log(
                `[Generate V2] Page ${result.pageNumber}/${totalPages} ${
                  result.success ? "completed" : "failed"
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
                totalPages,
                successCount,
                pages: pages.sort((a, b) => a.pageNumber - b.pageNumber),
              })
            )
          );

          console.log(`[Generate V2] Complete: ${successCount}/${totalPages} pages generated`);
        } catch (error) {
          console.error("[Generate V2] Stream error:", error);
          controller.enqueue(
            encoder.encode(
              createSSEMessage({
                type: "fatal_error",
                message: error instanceof Error ? error.message : "Unknown error",
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
    console.error("[Generate V2 API] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Generation failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
