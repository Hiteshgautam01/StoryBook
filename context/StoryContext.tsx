"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Story, StoryContextType, ChildProfile, ThemeType } from "@/types";
import { getStory } from "@/lib/stories";

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [selectedTheme] = useState<ThemeType | null>(null);
  const [isGenerating] = useState(false);

  // Load the story when profile is set
  useEffect(() => {
    if (childProfile) {
      setCurrentStory(getStory());
    }
  }, [childProfile]);

  const value: StoryContextType = {
    childProfile,
    setChildProfile,
    selectedTheme,
    setSelectedTheme: () => {},
    currentStory,
    generateStory: () => {},
    isGenerating,
    currentPage,
    setCurrentPage,
    resetStory: () => {
      setCurrentPage(0);
      setChildProfile(null);
      setCurrentStory(null);
    },
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
