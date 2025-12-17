"use client";

import React from "react";
import Image from "next/image";
import { StoryPage } from "@/types";

interface PageContentProps {
  page: StoryPage;
  pageNumber: number;
  totalPages: number;
  childImage: string | null;
}

export function PageContent({
  page,
  pageNumber,
  totalPages,
  childImage,
}: PageContentProps) {
  return (
    <div className="h-full bg-gradient-to-br from-amber-50 to-amber-100 relative overflow-hidden">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 paper-texture pointer-events-none" />

      {/* Page content */}
      <div className="relative h-full flex flex-col">
        {/* Illustration area (top 55%) */}
        <div className="relative h-[55%] overflow-hidden">
          <Image
            src={page.illustration}
            alt={`Story illustration page ${pageNumber}`}
            fill
            className="object-cover"
            priority={pageNumber <= 2}
          />

          {/* Gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-50 via-transparent to-transparent" />

          {/* Child's photo badge (shown on select pages) */}
          {childImage && (pageNumber === 1 || pageNumber === totalPages) && (
            <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg">
              <Image
                src={childImage}
                alt="Story hero"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Text area (bottom 45%) */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Story text */}
          <div className="flex-1 flex items-center">
            <p className="story-text text-base leading-relaxed drop-cap">
              {page.text}
            </p>
          </div>

          {/* Page footer */}
          <div className="flex items-center justify-between text-amber-700/50 text-xs pt-4 border-t border-amber-200">
            <span>Page {pageNumber}</span>
            <div className="flex items-center gap-1">
              <span className="text-amber-500">★</span>
            </div>
            <span>{pageNumber} / {totalPages}</span>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-amber-300/30 rounded-tl" />
        <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-amber-300/30 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-amber-300/30 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-amber-300/30 rounded-br" />
      </div>
    </div>
  );
}
