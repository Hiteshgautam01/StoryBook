import { type ClassValue, clsx } from "clsx";
import { jsPDF } from "jspdf";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

interface StoryPage {
  id: number;
  illustration: string;
  text: string;
}

/**
 * Export story pages as a PDF
 * Creates a landscape PDF with each page as a full-page image
 */
export async function exportStoryToPDF(
  pages: StoryPage[],
  title: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  // Create PDF in landscape orientation (16:9 aspect ratio)
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [160, 90], // 16:9 ratio in mm
  });

  const pageWidth = 160;
  const pageHeight = 90;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    onProgress?.(i + 1, pages.length);

    // Add new page for all pages except the first
    if (i > 0) {
      pdf.addPage([160, 90], "landscape");
    }

    try {
      // Load image and convert to base64
      const imageData = await loadImageAsBase64(page.illustration);

      // Add image to fill the entire page
      pdf.addImage(imageData, "PNG", 0, 0, pageWidth, pageHeight);
    } catch (error) {
      console.error(`Failed to load image for page ${page.id}:`, error);
      // Add placeholder for failed images
      pdf.setFillColor(30, 30, 30);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.text(`Page ${page.id}`, pageWidth / 2, pageHeight / 2, { align: "center" });
    }
  }

  // Save the PDF
  const safeName = title.replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, "").trim() || "story";
  pdf.save(`${safeName}.pdf`);
}

/**
 * Load an image URL and convert it to base64 data URL.
 * Uses server-side proxy for external URLs to bypass CORS restrictions.
 */
async function loadImageAsBase64(url: string): Promise<string> {
  // For local images or data URLs, use direct canvas loading
  if (url.startsWith("/") || url.startsWith("data:")) {
    return loadImageDirectly(url);
  }

  // For external URLs (Fal AI, Supabase), use server proxy to bypass CORS
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load image via proxy");
  }

  return data.data;
}

/**
 * Load a local image directly via canvas (for URLs that don't have CORS issues)
 */
function loadImageDirectly(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0);

      try {
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      } catch (e) {
        reject(new Error("Failed to convert image to base64 - CORS issue"));
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };

    img.src = url;
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
