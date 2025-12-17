"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";

interface BookCoverProps {
  type: "front" | "back";
  title: string;
  childImage: string | null;
}

export function BookCover({ type, title, childImage }: BookCoverProps) {
  if (type === "front") {
    return (
      <div className="h-full book-cover-gradient relative overflow-hidden rounded-r-lg">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        {/* Gold border effect */}
        <div className="absolute inset-4 border-4 border-amber-400/40 rounded-lg" />
        <div className="absolute inset-6 border border-amber-400/20 rounded-lg" />

        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          {/* Sparkle decorations */}
          <Sparkles className="absolute top-8 left-8 w-6 h-6 text-amber-400 animate-sparkle" />
          <Sparkles className="absolute top-12 right-12 w-4 h-4 text-amber-300 animate-sparkle" style={{ animationDelay: "0.5s" }} />
          <Sparkles className="absolute bottom-16 left-12 w-5 h-5 text-amber-400 animate-sparkle" style={{ animationDelay: "1s" }} />

          {/* Child's photo */}
          {childImage && (
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg">
                <Image
                  src={childImage}
                  alt="Story hero"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Golden frame effect */}
              <div className="absolute inset-0 rounded-full border-4 border-amber-300/50 animate-pulse" />
            </div>
          )}

          {/* Title */}
          <h1 className="font-storybook text-2xl md:text-3xl font-bold text-amber-100 leading-tight mb-4 drop-shadow-lg">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-amber-200/80 text-sm font-display">
            A Personalized Adventure
          </p>

          {/* Bottom decoration */}
          <div className="absolute bottom-8 flex items-center gap-2 text-amber-400/60">
            <div className="w-8 h-px bg-amber-400/40" />
            <Heart className="w-4 h-4" />
            <div className="w-8 h-px bg-amber-400/40" />
          </div>
        </div>
      </div>
    );
  }

  // Back cover
  return (
    <div className="h-full book-cover-gradient relative overflow-hidden rounded-l-lg">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Gold border effect */}
      <div className="absolute inset-4 border-4 border-amber-400/40 rounded-lg" />

      <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-6">📚</div>

        <h2 className="font-storybook text-xl text-amber-100 mb-4">
          The End
        </h2>

        <p className="text-amber-200/70 text-sm max-w-xs leading-relaxed">
          Thank you for reading this magical adventure!
          May your dreams be filled with wonder.
        </p>

        <div className="absolute bottom-8 text-amber-400/50 text-xs">
          Storybook Magic
        </div>
      </div>
    </div>
  );
}
