"use client";

import React from "react";

interface NavigationArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  currentPage: number;
  totalPages: number;
}

export function NavigationArrows({
  onPrev,
  onNext,
  currentPage,
  totalPages,
}: NavigationArrowsProps) {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <>
      {/* Previous arrow */}
      <button
        onClick={onPrev}
        disabled={isFirstPage}
        className={`
          nav-arrow fixed left-4 md:left-8 top-1/2 -translate-y-1/2
          w-14 h-14 md:w-16 md:h-16 rounded-full
          bg-white/90 backdrop-blur-sm shadow-lg
          flex items-center justify-center
          text-3xl text-gray-700 font-light
          transition-all duration-300
          ${
            isFirstPage
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white hover:scale-110 cursor-pointer"
          }
          z-30
        `}
        aria-label="Previous page"
      >
        ‹
      </button>

      {/* Next arrow */}
      <button
        onClick={onNext}
        disabled={isLastPage}
        className={`
          nav-arrow fixed right-4 md:right-8 top-1/2 -translate-y-1/2
          w-14 h-14 md:w-16 md:h-16 rounded-full
          bg-white/90 backdrop-blur-sm shadow-lg
          flex items-center justify-center
          text-3xl text-gray-700 font-light
          transition-all duration-300
          ${
            isLastPage
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white hover:scale-110 cursor-pointer"
          }
          z-30
        `}
        aria-label="Next page"
      >
        ›
      </button>
    </>
  );
}
