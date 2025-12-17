"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStory } from "@/context/StoryContext";
import { themes } from "@/lib/themes";
import { ThemeType } from "@/types";
import { BookOpen, Check, ArrowLeft, Sparkles } from "lucide-react";

interface ThemeSelectorProps {
  onBack: () => void;
}

export function ThemeSelector({ onBack }: ThemeSelectorProps) {
  const router = useRouter();
  const { selectedTheme, setSelectedTheme, generateStory, isGenerating, childProfile } = useStory();

  const handleThemeSelect = (themeId: ThemeType) => {
    setSelectedTheme(themeId);
  };

  const handleCreateStory = () => {
    generateStory();
    router.push("/reader");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">
          Choose Your Adventure
        </h2>
        <p className="text-white/80">
          Pick a theme for {childProfile?.name}&apos;s magical storybook
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            hover
            onClick={() => handleThemeSelect(theme.id)}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
              selectedTheme === theme.id
                ? "ring-4 ring-purple-400 ring-offset-2"
                : ""
            }`}
          >
            {/* Theme gradient background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-10`}
            />

            {/* Selection indicator */}
            {selectedTheme === theme.id && (
              <div className="absolute top-3 right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}

            <div className="relative">
              {/* Theme emoji */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-3xl mb-4`}
              >
                {theme.emoji}
              </div>

              {/* Theme info */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {theme.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {theme.description}
              </p>

              {/* Page count badge */}
              <div className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                <BookOpen className="w-3 h-3" />
                {theme.pageCount} pages
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Story Button */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={handleCreateStory}
          disabled={!selectedTheme}
          isLoading={isGenerating}
          className="min-w-64"
        >
          {isGenerating ? (
            "Creating Your Story..."
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Create {childProfile?.name}&apos;s Story
            </>
          )}
        </Button>

        {!selectedTheme && (
          <p className="text-white/60 text-sm mt-3">
            Select a theme to continue
          </p>
        )}
      </div>
    </div>
  );
}
