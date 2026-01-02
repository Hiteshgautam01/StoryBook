import { NextRequest, NextResponse } from "next/server";
import { analyzeChildPhoto } from "@/lib/fal-client";
import { createDefaultDescription } from "@/lib/prompts/composer";
import { Gender } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photoUrl, gender } = body as { photoUrl: string; gender: Gender };

    if (!photoUrl) {
      return NextResponse.json(
        { error: "Photo URL is required" },
        { status: 400 }
      );
    }

    if (!gender) {
      return NextResponse.json(
        { error: "Gender is required" },
        { status: 400 }
      );
    }

    // Map gender to description term
    const genderTerm = gender === "boy" ? "boy" : gender === "girl" ? "girl" : "child";

    let description: string;

    try {
      // Try to analyze the photo using Fal AI vision
      description = await analyzeChildPhoto(photoUrl, genderTerm);
    } catch (analysisError) {
      console.warn("[Analyze Photo] Vision analysis failed, using default description:", analysisError);
      // Fallback to default description if analysis fails
      description = createDefaultDescription(gender);
    }

    return NextResponse.json({
      success: true,
      description,
      gender,
    });
  } catch (error) {
    console.error("[Analyze Photo API] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
