"use client";

import { useState, useCallback, useRef } from "react";
import { TOTAL_PAGES } from "@/lib/prompts/story-pages";
import { FaceSwapMethod, PortraitPose } from "@/lib/hybrid-pipeline/types";

export interface GeneratedPage {
  pageNumber: number;
  imageUrl: string;
  arabicText: string;
  success: boolean;
  method?: FaceSwapMethod;
}

export type GenerationStatus =
  | "idle"
  | "analyzing"        // Stage 1: Generating stylized portraits
  | "generating"       // Stage 2: Processing pages with face swap
  | "complete"
  | "error";

export interface PortraitProgress {
  completedCount: number;
  totalPoses: number;
  lastCompletedPose?: PortraitPose;
}

export interface StoryGenerationState {
  status: GenerationStatus;
  currentPage: number;
  totalPages: number;
  pages: Map<number, GeneratedPage>;
  error: string | null;
  portraitProgress: PortraitProgress | null;
  methodBreakdown: Record<FaceSwapMethod, number> | null;
}

export interface UseStoryGenerationOptions {
  onPageComplete?: (page: GeneratedPage) => void;
  onComplete?: (pages: GeneratedPage[]) => void;
  onError?: (error: string, pageNumber?: number) => void;
  onPortraitComplete?: (pose: PortraitPose, success: boolean) => void;
}

export function useStoryGeneration(options: UseStoryGenerationOptions = {}) {
  const { onPageComplete, onComplete, onError, onPortraitComplete } = options;
  const abortControllerRef = useRef<AbortController | null>(null);

  const [state, setState] = useState<StoryGenerationState>({
    status: "idle",
    currentPage: 0,
    totalPages: TOTAL_PAGES,
    pages: new Map(),
    error: null,
    portraitProgress: null,
    methodBreakdown: null,
  });

  const startGeneration = useCallback(
    async (childName: string, childPhotoUrl: string, gender?: "boy" | "girl" | "neutral") => {
      // Cancel any existing generation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setState({
        status: "analyzing", // Start with portrait generation phase
        currentPage: 0,
        totalPages: TOTAL_PAGES,
        pages: new Map(),
        error: null,
        portraitProgress: null,
        methodBreakdown: null,
      });

      console.log(`[useStoryGeneration] Starting hybrid pipeline generation`);

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
                  // Stage 1: Portrait generation events
                  case "start":
                    console.log(`[useStoryGeneration] Pipeline started: ${data.totalPages} pages, ${data.pagesNeedingSwap} need swap`);
                    break;

                  case "portraits_start":
                    setState((prev) => ({
                      ...prev,
                      status: "analyzing",
                      portraitProgress: {
                        completedCount: 0,
                        totalPoses: data.totalPoses,
                      },
                    }));
                    console.log(`[useStoryGeneration] Stage 1: Generating ${data.totalPoses} portraits`);
                    break;

                  case "portrait_complete":
                    setState((prev) => ({
                      ...prev,
                      portraitProgress: {
                        completedCount: data.completedCount,
                        totalPoses: data.totalPoses,
                        lastCompletedPose: data.pose,
                      },
                    }));
                    onPortraitComplete?.(data.pose, data.success);
                    break;

                  case "portraits_complete":
                    console.log(`[useStoryGeneration] Stage 1 complete: ${data.successCount}/${data.totalPoses} in ${data.totalTime}ms`);
                    // Transition to page processing
                    setState((prev) => ({
                      ...prev,
                      status: "generating",
                    }));
                    break;

                  // Stage 2: Page processing events
                  case "page_start":
                    setState((prev) => ({
                      ...prev,
                      currentPage: data.pageNumber,
                    }));
                    break;

                  case "image":
                    const page: GeneratedPage = {
                      pageNumber: data.pageNumber,
                      imageUrl: data.imageUrl,
                      arabicText: data.arabicText,
                      success: data.success,
                      method: data.method,
                    };

                    setState((prev) => {
                      const newPages = new Map(prev.pages);
                      newPages.set(data.pageNumber, page);
                      return {
                        ...prev,
                        pages: newPages,
                        currentPage: data.pageNumber,
                      };
                    });

                    onPageComplete?.(page);
                    break;

                  case "complete":
                    const completedPages: GeneratedPage[] = data.pages.map(
                      (p: { pageNumber: number; imageUrl: string; arabicText: string; success: boolean; method?: FaceSwapMethod }) => ({
                        pageNumber: p.pageNumber,
                        imageUrl: p.imageUrl,
                        arabicText: p.arabicText,
                        success: p.success,
                        method: p.method,
                      })
                    );

                    setState((prev) => ({
                      ...prev,
                      status: "complete",
                      currentPage: TOTAL_PAGES,
                      methodBreakdown: data.methodBreakdown || null,
                    }));

                    console.log(`[useStoryGeneration] Complete: ${data.successCount}/${data.totalPages} in ${data.totalTime}ms`);
                    if (data.methodBreakdown) {
                      console.log(`[useStoryGeneration] Methods:`, data.methodBreakdown);
                    }

                    onComplete?.(completedPages);
                    break;

                  case "error":
                    // Handle both page-specific errors and general errors
                    if (data.pageNumber !== undefined) {
                      // Page-specific error with fallback
                      const fallbackPage: GeneratedPage = {
                        pageNumber: data.pageNumber,
                        imageUrl: data.fallbackUrl || "",
                        arabicText: "",
                        success: false,
                      };

                      setState((prev) => {
                        const newPages = new Map(prev.pages);
                        newPages.set(data.pageNumber, fallbackPage);
                        return { ...prev, pages: newPages };
                      });

                      onError?.(data.message, data.pageNumber);
                    } else {
                      // General pipeline error
                      setState((prev) => ({
                        ...prev,
                        status: "error",
                        error: data.message,
                      }));
                      onError?.(data.message);
                    }
                    break;

                  // Legacy event handling for backwards compatibility
                  case "progress":
                    setState((prev) => ({
                      ...prev,
                      status: "generating",
                      currentPage: data.page,
                    }));
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
    [onPageComplete, onComplete, onError, onPortraitComplete]
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
      portraitProgress: null,
      methodBreakdown: null,
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

  // Portrait progress (0-100%)
  const portraitProgress = state.portraitProgress
    ? (state.portraitProgress.completedCount / state.portraitProgress.totalPoses) * 100
    : 0;

  return {
    ...state,
    pagesArray,
    completedCount,
    failedCount,
    progress,
    portraitProgress,
    startGeneration,
    cancelGeneration,
    reset,
  };
}
