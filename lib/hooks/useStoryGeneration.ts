"use client";

import { useState, useCallback, useRef } from "react";
import { TOTAL_PAGES } from "@/lib/prompts/story-pages";

export interface GeneratedPage {
  pageNumber: number;
  imageUrl: string;
  arabicText: string;
  success: boolean;
}

export type GenerationStatus = "idle" | "analyzing" | "generating" | "complete" | "error";

export interface StoryGenerationState {
  status: GenerationStatus;
  currentPage: number;
  totalPages: number;
  pages: Map<number, GeneratedPage>;
  error: string | null;
}

export interface UseStoryGenerationOptions {
  onPageComplete?: (page: GeneratedPage) => void;
  onComplete?: (pages: GeneratedPage[]) => void;
  onError?: (error: string, pageNumber?: number) => void;
}

export function useStoryGeneration(options: UseStoryGenerationOptions = {}) {
  const { onPageComplete, onComplete, onError } = options;
  const abortControllerRef = useRef<AbortController | null>(null);

  const [state, setState] = useState<StoryGenerationState>({
    status: "idle",
    currentPage: 0,
    totalPages: TOTAL_PAGES,
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

      setState({
        status: "generating",
        currentPage: 0,
        totalPages: TOTAL_PAGES,
        pages: new Map(),
        error: null,
      });

      console.log(`[useStoryGeneration] Starting face-swap generation`);

      try {
        const response = await fetch("/api/generate-story", {
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
    [onPageComplete, onComplete, onError]
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
