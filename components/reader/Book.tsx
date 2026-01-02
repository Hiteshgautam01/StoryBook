"use client";

import React, { useRef, useCallback, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import { useStory } from "@/context/StoryContext";
import { LastPage } from "./LastPage";
import { NavigationArrows } from "./NavigationArrows";

interface FlipBookRef {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    getCurrentPageIndex: () => number;
    getPageCount: () => number;
  };
}

export function Book() {
  const { currentStory, currentPage, setCurrentPage } = useStory();
  const bookRef = useRef<FlipBookRef>(null);

  const handleFlipNext = useCallback(() => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  }, []);

  const handleFlipPrev = useCallback(() => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  }, []);

  const onPageChange = useCallback(
    (e: { data: number }) => {
      setCurrentPage(e.data);
    },
    [setCurrentPage]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleFlipNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleFlipPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlipNext, handleFlipPrev]);

  if (!currentStory) return null;

  // Total pages: story pages + last page
  const totalPages = currentStory.pages.length + 1;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
      {/* Page indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm z-20">
        Page {Math.floor(currentPage / 2) + 1} of {Math.ceil(totalPages / 2)}
      </div>

      {/* Book container */}
      <div className="relative">
        {/* Book shadow */}
        <div className="absolute inset-x-4 bottom-0 h-8 bg-black/40 blur-2xl rounded-full transform translate-y-4" />

        {/* The book */}
        <div className="relative">
          <HTMLFlipBook
            ref={bookRef}
            width={700}
            height={500}
            size="stretch"
            minWidth={400}
            maxWidth={900}
            minHeight={400}
            maxHeight={650}
            showCover={false}
            mobileScrollSupport={true}
            onFlip={onPageChange}
            className="shadow-2xl"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePortrait={false}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={0.5}
            showPageCorners={true}
            disableFlipByClick={false}
            swipeDistance={30}
            clickEventForward={true}
            useMouseEvents={true}
          >
            {/* Story Pages - Full image pages */}
            {currentStory.pages.map((page) => (
              <div key={page.id} className="page-content bg-black">
                <div className="h-full w-full relative">
                  <Image
                    src={page.illustration}
                    alt={`Page ${page.id}`}
                    fill
                    className="object-contain"
                    priority={page.id <= 2}
                    unoptimized={page.illustration.startsWith("http")}
                  />
                </div>
              </div>
            ))}

            {/* Last Page - Image Gallery */}
            <div className="page-content">
              <LastPage />
            </div>
          </HTMLFlipBook>
        </div>
      </div>

      {/* Navigation */}
      <NavigationArrows
        onPrev={handleFlipPrev}
        onNext={handleFlipNext}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center">
        Use arrow keys or click the arrows to turn pages
      </div>
    </div>
  );
}
