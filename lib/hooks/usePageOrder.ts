"use client";

import { useState, useEffect, useCallback } from "react";
import { StoryPageConfig, STORY_PAGES } from "@/lib/prompts/story-pages";

const STORAGE_KEY = "admin-page-order";

interface UsePageOrderReturn {
  orderedPages: StoryPageConfig[];
  hasCustomOrder: boolean;
  reorder: (activeId: number, overId: number) => void;
  resetOrder: () => void;
}

export function usePageOrder(): UsePageOrderReturn {
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load order from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === STORY_PAGES.length) {
          setPageOrder(parsed);
        } else {
          // Invalid stored data, use default
          setPageOrder(STORY_PAGES.map((p) => p.pageNumber));
        }
      } catch {
        setPageOrder(STORY_PAGES.map((p) => p.pageNumber));
      }
    } else {
      setPageOrder(STORY_PAGES.map((p) => p.pageNumber));
    }
    setIsInitialized(true);
  }, []);

  // Save order to localStorage when it changes
  useEffect(() => {
    if (isInitialized && pageOrder.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pageOrder));
    }
  }, [pageOrder, isInitialized]);

  // Check if order differs from default
  const hasCustomOrder = useCallback(() => {
    const defaultOrder = STORY_PAGES.map((p) => p.pageNumber);
    return pageOrder.some((num, idx) => num !== defaultOrder[idx]);
  }, [pageOrder]);

  // Reorder pages after drag
  const reorder = useCallback((activeId: number, overId: number) => {
    setPageOrder((current) => {
      const oldIndex = current.indexOf(activeId);
      const newIndex = current.indexOf(overId);

      if (oldIndex === -1 || newIndex === -1) return current;

      const newOrder = [...current];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, activeId);

      return newOrder;
    });
  }, []);

  // Reset to default order
  const resetOrder = useCallback(() => {
    const defaultOrder = STORY_PAGES.map((p) => p.pageNumber);
    setPageOrder(defaultOrder);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Map page order to actual page configs
  const orderedPages = pageOrder
    .map((pageNum) => STORY_PAGES.find((p) => p.pageNumber === pageNum))
    .filter((p): p is StoryPageConfig => p !== undefined);

  return {
    orderedPages: isInitialized ? orderedPages : STORY_PAGES,
    hasCustomOrder: hasCustomOrder(),
    reorder,
    resetOrder,
  };
}
