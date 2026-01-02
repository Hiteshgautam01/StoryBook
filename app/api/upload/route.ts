import { NextRequest, NextResponse } from "next/server";
import { supabase, STORAGE_BUCKET, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json(
        { error: "Storage not configured. Please add Supabase credentials to .env.local" },
        { status: 503 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    let fileToUpload: File | Blob;
    let filename: string;

    // Handle JSON body (base64 data)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const base64Data = body.base64 as string | null;

      if (!base64Data) {
        return NextResponse.json(
          { error: "No base64 data provided" },
          { status: 400 }
        );
      }

      // Convert base64 to blob
      const arr = base64Data.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      fileToUpload = new Blob([u8arr], { type: mime });
      const ext = mime.split("/")[1] || "png";
      filename = `child-photos/${Date.now()}.${ext}`;
    }
    // Handle FormData (file upload)
    else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const base64Data = formData.get("base64") as string | null;

      if (file) {
        fileToUpload = file;
        filename = `child-photos/${Date.now()}-${file.name}`;
      } else if (base64Data) {
        // Convert base64 to blob
        const arr = base64Data.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        fileToUpload = new Blob([u8arr], { type: mime });
        const ext = mime.split("/")[1] || "png";
        filename = `child-photos/${Date.now()}.${ext}`;
      } else {
        return NextResponse.json(
          { error: "No file or base64 data provided" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, fileToUpload, {
        contentType: fileToUpload.type || "image/png",
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      filename: data.path,
    });
  } catch (error) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
