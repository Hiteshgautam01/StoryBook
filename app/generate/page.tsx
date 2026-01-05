"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useStory } from "@/context/StoryContext";
import { useStoryGeneration, GeneratedPage, GenerationApproach } from "@/lib/hooks/useStoryGeneration";
import { GenerationProgress } from "@/components/generate/GenerationProgress";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { FALCON_STORY } from "@/lib/prompts/falcon-story";

// Use flux-pulid for best quality (generates images with face naturally integrated)
const GENERATION_APPROACH: GenerationApproach = "flux-pulid";

export default function GeneratePage() {
  const router = useRouter();
  const { childProfile, setGeneratedPages } = useStory();

  const [previewPage, setPreviewPage] = useState<GeneratedPage | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePageComplete = useCallback((page: GeneratedPage) => {
    console.log(`Page ${page.pageNumber} completed`);
  }, []);

  const handleComplete = useCallback(
    (pages: GeneratedPage[]) => {
      // Convert to the format expected by context
      const storyPages = pages.map((p) => ({
        id: p.pageNumber,
        illustration: p.imageUrl,
        text: p.arabicText,
        backgroundColor: "#000",
        status: p.success ? ("complete" as const) : ("error" as const),
        generatedImageUrl: p.imageUrl,
      }));
      setGeneratedPages(storyPages);
    },
    [setGeneratedPages]
  );

  const handleError = useCallback(
    (error: string, pageNumber?: number) => {
      console.error(
        `Generation error${pageNumber !== undefined ? ` on page ${pageNumber}` : ""}:`,
        error
      );
    },
    []
  );

  const handleAnalysisComplete = useCallback((description: string) => {
    console.log("Child appearance analyzed:", description);
  }, []);

  const {
    status,
    currentPage,
    totalPages,
    pagesArray,
    completedCount,
    failedCount,
    progress,
    startGeneration,
    cancelGeneration,
    reset,
    childDescription,
  } = useStoryGeneration({
    approach: GENERATION_APPROACH,
    onPageComplete: handlePageComplete,
    onComplete: handleComplete,
    onError: handleError,
    onAnalysisComplete: handleAnalysisComplete,
  });

  // Redirect if no profile
  useEffect(() => {
    if (!childProfile) {
      router.push("/");
    }
  }, [childProfile, router]);

  // Auto-start generation when page loads
  useEffect(() => {
    if (childProfile?.image && !hasStarted && status === "idle") {
      setHasStarted(true);
      // Pass gender for better face analysis and face swap quality
      startGeneration(childProfile.name, childProfile.image, childProfile.gender);
    }
  }, [childProfile, hasStarted, status, startGeneration]);

  const handleViewStory = () => {
    router.push("/reader");
  };

  const handleCancel = () => {
    cancelGeneration();
    router.push("/");
  };

  const handleTryAgain = () => {
    reset();
    setHasStarted(false);
  };

  const handlePageClick = (page: GeneratedPage) => {
    setPreviewPage(page);
  };

  if (!childProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Creating {childProfile.name}&apos;s Story
          </h1>
          <p className="text-white/60 font-arabic text-xl" dir="rtl">
            رحلة {childProfile.name} والصقر الذهبي
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <GenerationProgress
            currentPage={pagesArray.length}
            totalPages={totalPages}
            status={status}
          />

          {/* Progress text */}
          <div className="text-center mt-4 text-white/60">
            {status === "analyzing" && (
              <p>
                Analyzing {childProfile.name}&apos;s photo...
                <br />
                <span className="text-sm">
                  Extracting appearance characteristics for natural face integration
                </span>
              </p>
            )}
            {status === "generating" && (
              <p>
                Generating page {pagesArray.length + 1} of {totalPages}...
                <br />
                <span className="text-sm">
                  Creating illustrations with {childProfile.name}&apos;s face naturally integrated
                </span>
                {childDescription && (
                  <span className="block text-xs mt-1 text-purple-300/70 max-w-md mx-auto">
                    Detected: {childDescription.substring(0, 80)}...
                  </span>
                )}
              </p>
            )}
            {status === "complete" && (
              <p className="text-green-400">
                All {completedCount} pages generated successfully!
              </p>
            )}
            {status === "error" && (
              <p className="text-red-400">
                Generation encountered an error. Please try again.
              </p>
            )}
          </div>
        </div>

        {/* Page Grid */}
        <div className="bg-white/5 rounded-2xl p-4 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Personalized Pages ({pagesArray.length} / {totalPages})
            {failedCount > 0 && (
              <span className="text-yellow-400 text-sm ml-2">
                ({failedCount} using original)
              </span>
            )}
          </h2>

          {/* Custom Page Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => {
              const page = pagesArray.find((p) => p.pageNumber === pageNum);
              const isGenerating = status === "generating" && !page;
              const isComplete = page?.success;
              const isFailed = page && !page.success;

              return (
                <div
                  key={pageNum}
                  className={`
                    relative aspect-[16/9] rounded-lg overflow-hidden
                    transition-all duration-300 ease-out
                    ${page ? "cursor-pointer hover:scale-105 hover:ring-2 hover:ring-purple-500" : ""}
                    ${isGenerating ? "ring-2 ring-purple-500 ring-opacity-50" : ""}
                  `}
                  onClick={() => page && handlePageClick(page)}
                >
                  {/* Page number badge */}
                  <div className="absolute top-1 left-1 z-10 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {pageNum}
                  </div>

                  {/* Content */}
                  {page ? (
                    <Image
                      src={page.imageUrl}
                      alt={`Page ${pageNum}`}
                      fill
                      className="object-cover transition-opacity duration-500"
                      sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 12.5vw"
                    />
                  ) : isGenerating ? (
                    <div className="w-full h-full bg-purple-900/30 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <span className="text-white/20 text-xs">Pending</span>
                    </div>
                  )}

                  {/* Success/Failed indicator */}
                  {isComplete && (
                    <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {isFailed && (
                    <div className="absolute bottom-1 right-1 bg-yellow-500 rounded-full p-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {status === "complete" ? (
            <Button onClick={handleViewStory} variant="primary" size="lg">
              View Your Story
            </Button>
          ) : status === "error" ? (
            <>
              <Button onClick={handleCancel} variant="outline" size="lg">
                Go Back
              </Button>
              <Button onClick={handleTryAgain} variant="primary" size="lg">
                Try Again
              </Button>
            </>
          ) : (
            <Button onClick={handleCancel} variant="outline" size="lg">
              Cancel
            </Button>
          )}
        </div>

        {/* Preview Modal */}
        {previewPage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewPage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-gray-900 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewPage(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="relative aspect-video">
                <Image
                  src={previewPage.imageUrl}
                  alt={`Page ${previewPage.pageNumber}`}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 text-center">
                <p className="text-lg font-arabic text-white/80" dir="rtl">
                  {previewPage.arabicText}
                </p>
                <p className="text-sm text-white/50 mt-2">
                  Page {previewPage.pageNumber}
                  {!previewPage.success && (
                    <span className="text-yellow-400 ml-2">(using original)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
