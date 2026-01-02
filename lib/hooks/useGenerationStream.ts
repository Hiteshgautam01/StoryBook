"use client";

import { useState, useCallback, useRef } from "react";
import { GeneratedStoryPage, SSEEvent, GenerationStatus } from "@/types";

interface UseGenerationStreamOptions {
  onPageGenerated?: (pageNumber: number, imageUrl: string) => void;
  onComplete?: (pages: GeneratedStoryPage[]) => void;
  onError?: (error: string, pageNumber?: number) => void;
}

interface GenerationState {
  status: GenerationStatus;
  currentPage: number;
  totalPages: number;
  pages: Map<number, GeneratedStoryPage>;
  error?: string;
}

export function useGenerationStream(options: UseGenerationStreamOptions = {}) {
  const { onPageGenerated, onComplete, onError } = options;

  const [state, setState] = useState<GenerationState>({
    status: "idle",
    currentPage: 0,
    totalPages: 0,
    pages: new Map(),
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const startGeneration = useCallback(
    async (params: {
      childName: string;
      childDescription: string;
      gender: "boy" | "girl" | "neutral";
      photoUrl?: string;
    }) => {
      // Abort any existing generation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setState({
        status: "generating",
        currentPage: 0,
        totalPages: 26, // Will be updated from server
        pages: new Map(),
      });

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Generation failed");
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const event: SSEEvent = JSON.parse(line.slice(6));

                switch (event.type) {
                  case "progress":
                    setState((prev) => ({
                      ...prev,
                      currentPage: event.page,
                      totalPages: event.total,
                    }));
                    break;

                  case "image":
                    setState((prev) => {
                      const newPages = new Map(prev.pages);
                      newPages.set(event.page, {
                        id: event.page,
                        illustration: event.imageUrl,
                        text: event.arabicText,
                        backgroundColor: "#000",
                        status: "complete",
                        generatedImageUrl: event.imageUrl,
                      });
                      return {
                        ...prev,
                        pages: newPages,
                        currentPage: event.page + 1,
                      };
                    });
                    onPageGenerated?.(event.page, event.imageUrl);
                    break;

                  case "error":
                    if (event.page >= 0) {
                      setState((prev) => {
                        const newPages = new Map(prev.pages);
                        newPages.set(event.page, {
                          id: event.page,
                          illustration: "",
                          text: "",
                          backgroundColor: "#000",
                          status: "error",
                          errorMessage: event.message,
                        });
                        return { ...prev, pages: newPages };
                      });
                    }
                    onError?.(event.message, event.page >= 0 ? event.page : undefined);
                    break;

                  case "complete":
                    setState((prev) => ({
                      ...prev,
                      status: "complete",
                    }));
                    onComplete?.(event.pages);
                    break;
                }
              } catch (parseError) {
                console.error("Failed to parse SSE event:", parseError);
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          setState((prev) => ({
            ...prev,
            status: "idle",
          }));
          return;
        }

        const errorMessage = error instanceof Error ? error.message : "Generation failed";
        setState((prev) => ({
          ...prev,
          status: "error",
          error: errorMessage,
        }));
        onError?.(errorMessage);
      }
    },
    [onPageGenerated, onComplete, onError]
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
      totalPages: 0,
      pages: new Map(),
    });
  }, [cancelGeneration]);

  const retryPage = useCallback(
    async (
      pageNumber: number,
      params: {
        childName: string;
        childDescription: string;
        gender: "boy" | "girl" | "neutral";
        photoUrl?: string;
      }
    ) => {
      try {
        // Mark page as generating
        setState((prev) => {
          const newPages = new Map(prev.pages);
          const existingPage = newPages.get(pageNumber);
          if (existingPage) {
            newPages.set(pageNumber, {
              ...existingPage,
              status: "generating",
              errorMessage: undefined,
            });
          }
          return { ...prev, pages: newPages };
        });

        const response = await fetch("/api/retry-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageNumber,
            ...params,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setState((prev) => {
            const newPages = new Map(prev.pages);
            newPages.set(pageNumber, {
              id: pageNumber,
              illustration: data.imageUrl,
              text: data.arabicText,
              backgroundColor: "#000",
              status: "complete",
              generatedImageUrl: data.imageUrl,
            });
            return { ...prev, pages: newPages };
          });
          onPageGenerated?.(pageNumber, data.imageUrl);
          return { success: true, imageUrl: data.imageUrl };
        } else {
          setState((prev) => {
            const newPages = new Map(prev.pages);
            const existingPage = newPages.get(pageNumber);
            if (existingPage) {
              newPages.set(pageNumber, {
                ...existingPage,
                status: "error",
                errorMessage: data.error || "Retry failed",
              });
            }
            return { ...prev, pages: newPages };
          });
          onError?.(data.error || "Retry failed", pageNumber);
          return { success: false, error: data.error };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Retry failed";
        setState((prev) => {
          const newPages = new Map(prev.pages);
          const existingPage = newPages.get(pageNumber);
          if (existingPage) {
            newPages.set(pageNumber, {
              ...existingPage,
              status: "error",
              errorMessage,
            });
          }
          return { ...prev, pages: newPages };
        });
        onError?.(errorMessage, pageNumber);
        return { success: false, error: errorMessage };
      }
    },
    [onPageGenerated, onError]
  );

  // Count failed pages
  const failedPages = Array.from(state.pages.values()).filter(
    (p) => p.status === "error"
  );

  return {
    ...state,
    pagesArray: Array.from(state.pages.values()),
    completedCount: Array.from(state.pages.values()).filter(p => p.status === "complete").length,
    failedCount: failedPages.length,
    failedPages,
    progress: state.totalPages > 0 ? (state.pages.size / state.totalPages) * 100 : 0,
    startGeneration,
    cancelGeneration,
    reset,
    retryPage,
  };
}
