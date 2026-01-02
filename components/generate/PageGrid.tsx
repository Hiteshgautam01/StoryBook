"use client";

import React from "react";
import Image from "next/image";
import { GeneratedStoryPage } from "@/types";

interface PageGridProps {
  pages: GeneratedStoryPage[];
  totalPages: number;
  currentGeneratingPage: number;
  onPageClick?: (page: GeneratedStoryPage) => void;
  onRetryPage?: (pageNumber: number) => void;
  retryingPages?: number[]; // Pages currently being retried
}

export function PageGrid({
  pages,
  totalPages,
  currentGeneratingPage,
  onPageClick,
  onRetryPage,
  retryingPages = [],
}: PageGridProps) {
  // Create array of all page slots
  const pageSlots = Array.from({ length: totalPages }, (_, i) => {
    return pages.find((p) => p.id === i) || null;
  });

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
      {pageSlots.map((page, index) => (
        <PageThumbnail
          key={index}
          pageNumber={index}
          page={page}
          isGenerating={index === currentGeneratingPage || retryingPages.includes(index)}
          onClick={() => page && onPageClick?.(page)}
          onRetry={onRetryPage ? () => onRetryPage(index) : undefined}
        />
      ))}
    </div>
  );
}

interface PageThumbnailProps {
  pageNumber: number;
  page: GeneratedStoryPage | null;
  isGenerating: boolean;
  onClick?: () => void;
  onRetry?: () => void;
}

function PageThumbnail({ pageNumber, page, isGenerating, onClick, onRetry }: PageThumbnailProps) {
  const hasImage = page?.status === "complete" && page.generatedImageUrl;
  const hasError = page?.status === "error";

  const handleRetryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRetry?.();
  };

  return (
    <div
      className={`
        relative aspect-[16/9] rounded-lg overflow-hidden
        transition-all duration-300 ease-out
        ${hasImage ? "cursor-pointer hover:scale-105 hover:ring-2 hover:ring-purple-500" : ""}
        ${isGenerating ? "ring-2 ring-purple-500 ring-opacity-50" : ""}
      `}
      onClick={hasImage ? onClick : undefined}
    >
      {/* Page number badge */}
      <div className="absolute top-1 left-1 z-10 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
        {pageNumber === 0 ? "Cover" : pageNumber}
      </div>

      {/* Content */}
      {hasImage ? (
        // Generated image
        <Image
          src={page.generatedImageUrl!}
          alt={`Page ${pageNumber}`}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 12.5vw"
        />
      ) : hasError ? (
        // Error state with retry button
        <div className="w-full h-full bg-red-900/30 flex flex-col items-center justify-center gap-1">
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {onRetry && (
            <button
              onClick={handleRetryClick}
              className="text-[10px] bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      ) : isGenerating ? (
        // Generating state
        <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-pink-900/40 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        // Pending state (skeleton)
        <div className="w-full h-full bg-white/5 animate-pulse" />
      )}

      {/* Completion checkmark */}
      {hasImage && (
        <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-0.5">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
