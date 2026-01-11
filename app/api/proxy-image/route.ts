import { NextRequest, NextResponse } from "next/server";

/**
 * Image proxy endpoint to bypass CORS restrictions when fetching external images.
 * Used by PDF export to load Fal AI and Supabase images.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  // Validate URL to prevent SSRF attacks
  try {
    const parsedUrl = new URL(url);
    const allowedHosts = [
      "fal.media",
      "v3.fal.media",
      "storage.googleapis.com",
      "supabase.co",
    ];

    const isAllowed = allowedHosts.some(host =>
      parsedUrl.hostname.endsWith(host)
    );

    if (!isAllowed && !parsedUrl.hostname.includes("supabase")) {
      return NextResponse.json(
        { error: "URL host not allowed" },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Lubab-Ebook-PDF-Export/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = response.headers.get("content-type") || "image/png";

    return NextResponse.json({
      data: `data:${contentType};base64,${base64}`,
    });
  } catch (error) {
    console.error("[Proxy Image] Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
