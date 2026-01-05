"use client";

import { useState, useCallback, useRef } from "react";
import { TOTAL_PAGES } from "@/lib/prompts/story-pages";
import { FALCON_STORY } from "@/lib/prompts/falcon-story";

export interface GeneratedPage {
  pageNumber: number;
  imageUrl: string;
  arabicText: string;
  success: boolean;
}

export type GenerationStatus = "idle" | "analyzing" | "generating" | "complete" | "error";

// V1 = face swap on pre-made images, V2 = full generation with flux-pulid
export type GenerationApproach = "face-swap" | "flux-pulid";

export interface StoryGenerationState {
  status: GenerationStatus;
  currentPage: number;
  totalPages: number;
  pages: Map<number, GeneratedPage>;
  error: string | null;
  childDescription?: string; // From photo analysis
}

export interface UseStoryGenerationOptions {
  approach?: GenerationApproach; // Default: "flux-pulid"
  onPageComplete?: (page: GeneratedPage) => void;
  onComplete?: (pages: GeneratedPage[]) => void;
  onError?: (error: string, pageNumber?: number) => void;
  onAnalysisComplete?: (description: string) => void;
}

export function useStoryGeneration(options: UseStoryGenerationOptions = {}) {
  const { approach = "flux-pulid", onPageComplete, onComplete, onError, onAnalysisComplete } = options;
  const abortControllerRef = useRef<AbortController | null>(null);

  // Use different total pages based on approach
  const totalPagesForApproach = approach === "flux-pulid" ? FALCON_STORY.totalPages : TOTAL_PAGES;

  const [state, setState] = useState<StoryGenerationState>({
    status: "idle",
    currentPage: 0,
    totalPages: totalPagesForApproach,
    pages: new Map(),
    error: null,
  });

  const startGeneration = useCallback(
    async (childName: string, childPhotoUrl: string, gender?: "boy" | "girl" | "neutral") => {
      // Cancel any existing generation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      // Choose API endpoint based on approach
      const apiEndpoint = approach === "flux-pulid"
        ? "/api/generate-story-v2"
        : "/api/generate-story";

      const currentTotalPages = approach === "flux-pulid" ? FALCON_STORY.totalPages : TOTAL_PAGES;

      setState({
        status: approach === "flux-pulid" ? "analyzing" : "generating",
        currentPage: 0,
        totalPages: currentTotalPages,
        pages: new Map(),
        error: null,
      });

      console.log(`[useStoryGeneration] Using ${approach} approach with ${apiEndpoint}`);

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childName, childPhotoUrl, gender }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`Generation failed: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response stream");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                switch (data.type) {
                  case "analysis_complete":
                    // V2: Photo analysis complete, starting generation
                    setState((prev) => ({
                      ...prev,
                      status: "generating",
                      childDescription: data.childDescription,
                    }));
                    onAnalysisComplete?.(data.childDescription);
                    break;

                  case "progress":
                    setState((prev) => ({
                      ...prev,
                      status: "generating",
                      currentPage: data.page,
                    }));
                    break;

                  case "image":
                    const page: GeneratedPage = {
                      pageNumber: data.page,
                      imageUrl: data.imageUrl,
                      arabicText: data.arabicText,
                      success: true,
                    };

                    setState((prev) => {
                      const newPages = new Map(prev.pages);
                      newPages.set(data.page, page);
                      return {
                        ...prev,
                        pages: newPages,
                        currentPage: data.page,
                      };
                    });

                    onPageComplete?.(page);
                    break;

                  case "error":
                    // Page failed but we have a fallback
                    const fallbackPage: GeneratedPage = {
                      pageNumber: data.page,
                      imageUrl: data.fallbackUrl,
                      arabicText: "",
                      success: false,
                    };

                    setState((prev) => {
                      const newPages = new Map(prev.pages);
                      newPages.set(data.page, fallbackPage);
                      return { ...prev, pages: newPages };
                    });

                    onError?.(data.message, data.page);
                    break;

                  case "complete":
                    const completedPages = data.pages.map(
                      (p: { pageNumber: number; imageUrl: string; arabicText: string; success: boolean }) => ({
                        pageNumber: p.pageNumber,
                        imageUrl: p.imageUrl,
                        arabicText: p.arabicText,
                        success: p.success,
                      })
                    );

                    setState((prev) => ({
                      ...prev,
                      status: "complete",
                      currentPage: TOTAL_PAGES,
                    }));

                    onComplete?.(completedPages);
                    break;

                  case "fatal_error":
                    setState((prev) => ({
                      ...prev,
                      status: "error",
                      error: data.message,
                    }));
                    onError?.(data.message);
                    break;
                }
              } catch (parseError) {
                console.error("Failed to parse SSE message:", parseError);
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Generation cancelled");
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        setState((prev) => ({
          ...prev,
          status: "error",
          error: errorMessage,
        }));

        onError?.(errorMessage);
      }
    },
    [approach, onPageComplete, onComplete, onError, onAnalysisComplete]
  );

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      status: "idle",
    }));
  }, []);

  const reset = useCallback(() => {
    cancelGeneration();
    setState({
      status: "idle",
      currentPage: 0,
      totalPages: TOTAL_PAGES,
      pages: new Map(),
      error: null,
    });
  }, [cancelGeneration]);

  // Computed values
  const pagesArray = Array.from(state.pages.values()).sort(
    (a, b) => a.pageNumber - b.pageNumber
  );
  const completedCount = pagesArray.filter((p) => p.success).length;
  const failedCount = pagesArray.filter((p) => !p.success).length;
  const progress =
    state.totalPages > 0 ? (pagesArray.length / state.totalPages) * 100 : 0;

  return {
    ...state,
    pagesArray,
    completedCount,
    failedCount,
    progress,
    startGeneration,
    cancelGeneration,
    reset,
  };
}
