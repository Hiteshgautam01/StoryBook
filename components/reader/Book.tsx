"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import { useStory } from "@/context/StoryContext";
import { LastPage } from "./LastPage";
import { NavigationArrows } from "./NavigationArrows";
import { exportStoryToPDF } from "@/lib/utils";

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
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number } | null>(null);

  const handleDownloadPDF = useCallback(async () => {
    if (!currentStory) return;

    setIsExporting(true);
    setExportProgress({ current: 0, total: currentStory.pages.length });

    try {
      await exportStoryToPDF(
        currentStory.pages,
        currentStory.title,
        (current, total) => setExportProgress({ current, total })
      );
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  }, [currentStory]);

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
      {/* Page indicator and download button */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
          Page {Math.floor(currentPage / 2) + 1} of {Math.ceil(totalPages / 2)}
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 disabled:cursor-not-allowed backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm flex items-center gap-2 transition-colors"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {exportProgress ? `${exportProgress.current}/${exportProgress.total}` : "Exporting..."}
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </>
          )}
        </button>
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
                  {/* Arabic text overlay */}
                  {page.text && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
                      <p className="text-xl md:text-2xl font-arabic text-white text-center leading-relaxed" dir="rtl">
                        {page.text}
                      </p>
                    </div>
                  )}
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
