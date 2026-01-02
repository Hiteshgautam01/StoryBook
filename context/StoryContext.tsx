"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Story,
  StoryContextType,
  ChildProfile,
  ThemeType,
  GenerationProgress,
  GeneratedStoryPage,
} from "@/types";
import { getStory } from "@/lib/stories";

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // New generation state
  const [childDescription, setChildDescription] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [generatedPages, setGeneratedPages] = useState<GeneratedStoryPage[]>([]);

  // Load the story when profile is set (for static/demo mode)
  useEffect(() => {
    if (childProfile && generatedPages.length === 0) {
      // Only load static story if no generated pages exist
      setCurrentStory(getStory());
    }
  }, [childProfile, generatedPages.length]);

  // Update current story with generated pages when available
  useEffect(() => {
    if (generatedPages.length > 0 && childProfile) {
      const generatedStory: Story = {
        id: "generated-falcon-story",
        theme: "kingdom",
        title: `رحلة ${childProfile.name} والصقر الذهبي`,
        dedication: "",
        pages: generatedPages.map((page) => ({
          id: page.id,
          illustration: page.generatedImageUrl || page.illustration,
          text: page.text,
          backgroundColor: page.backgroundColor,
        })),
      };
      setCurrentStory(generatedStory);
    }
  }, [generatedPages, childProfile]);

  const updateGeneratedPage = useCallback((pageNum: number, imageUrl: string) => {
    setGeneratedPages((prev) => {
      const existing = prev.find((p) => p.id === pageNum);
      if (existing) {
        return prev.map((p) =>
          p.id === pageNum
            ? { ...p, generatedImageUrl: imageUrl, status: "complete" as const }
            : p
        );
      }
      return [
        ...prev,
        {
          id: pageNum,
          illustration: imageUrl,
          text: "",
          backgroundColor: "#000",
          status: "complete" as const,
          generatedImageUrl: imageUrl,
        },
      ].sort((a, b) => a.id - b.id);
    });
  }, []);

  const generateStory = useCallback(() => {
    setIsGenerating(true);
    // This is now handled by the generation page/hook
  }, []);

  const resetStory = useCallback(() => {
    setCurrentPage(0);
    setChildProfile(null);
    setCurrentStory(null);
    setSelectedTheme(null);
    setChildDescription(null);
    setGenerationProgress(null);
    setGeneratedPages([]);
    setIsGenerating(false);
  }, []);

  const value: StoryContextType = {
    childProfile,
    setChildProfile,
    selectedTheme,
    setSelectedTheme,
    currentStory,
    generateStory,
    isGenerating,
    currentPage,
    setCurrentPage,
    resetStory,
    // New generation state
    childDescription,
    setChildDescription,
    generationProgress,
    setGenerationProgress,
    generatedPages,
    setGeneratedPages,
    updateGeneratedPage,
  };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
}
