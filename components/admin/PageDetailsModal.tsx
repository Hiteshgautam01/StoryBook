"use client";

import React, { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { StoryPageConfig, buildPageSpecificPrompt } from "@/lib/prompts/story-pages";
import { getPoseForPage } from "@/lib/hybrid-pipeline/pose-mapper";
import { buildPortraitPrompt, PORTRAIT_NEGATIVE_PROMPT } from "@/lib/prompts/pose-prompts";
import { PortraitPose } from "@/lib/hybrid-pipeline/types";

interface PageDetailsModalProps {
  page: StoryPageConfig | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

// X icon
function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// Chevron icons
function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function PageDetailsModal({
  page,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: PageDetailsModalProps) {
  const [showPrompt, setShowPrompt] = useState(true);
  const [copied, setCopied] = useState(false);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrevious) onPrevious();
      if (e.key === "ArrowRight" && hasNext) onNext();
    },
    [onClose, onPrevious, onNext, hasPrevious, hasNext]
  );

  // Only add keyboard listener and hide overflow when modal is open
  useEffect(() => {
    if (!page) return;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown, page]);

  // Reset copied state when page changes
  useEffect(() => {
    setCopied(false);
  }, [page?.pageNumber]);

  if (!page) return null;

  const imageUrl = `/pagesimages/page-${page.pageNumber}.png`;

  // Get prompts used in the pipeline
  const mappedPose = getPoseForPage(page.pageNumber);
  const portraitPrompt = mappedPose ? buildPortraitPrompt(mappedPose) : null;
  const fallbackPrompt = buildPageSpecificPrompt(page.pageNumber);

  const handleCopyPrompt = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Previous button */}
      {hasPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        >
          <ChevronLeft />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        >
          <ChevronRight />
        </button>
      )}

      {/* Modal content */}
      <div
        className="relative bg-gray-900 border border-white/10 rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        >
          <XIcon />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-black/20 rounded-xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={`Page ${page.pageNumber}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-lg font-bold">
                Page {page.pageNumber}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  page.hasChild
                    ? "bg-green-500/20 text-green-300"
                    : "bg-gray-500/20 text-gray-300"
                }`}
              >
                {page.hasChild ? "Has Child" : "No Child"}
              </span>
            </div>

            {/* Image file */}
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide">
                Image File
              </label>
              <p className="text-white/80 font-mono text-sm">{page.imageFile}</p>
            </div>

            {/* Arabic text */}
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide">
                Arabic Text
              </label>
              <p
                dir="rtl"
                className="text-right text-white text-lg font-arabic leading-relaxed mt-1 p-3 bg-white/5 rounded-lg"
              >
                {page.arabicText}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide">
                Description
              </label>
              <p className="text-white/80 mt-1">{page.description}</p>
            </div>

            {/* Child pose */}
            {page.childPose && (
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide">
                  Child Pose
                </label>
                <p className="text-purple-300 mt-1">
                  <span className="bg-purple-500/20 px-2 py-1 rounded-full text-sm">
                    {page.childPose}
                  </span>
                </p>
              </div>
            )}

            {/* Child position */}
            {page.childPosition && (
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide">
                  Child Position
                </label>
                <p className="text-white/80 mt-1">{page.childPosition}</p>
              </div>
            )}

            {/* Scene context */}
            {page.sceneContext && (
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide">
                  Scene Context
                </label>
                <p className="text-white/80 mt-1 text-sm leading-relaxed">
                  {page.sceneContext}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pipeline Configuration Section */}
        {page.hasChild && (
          <div className="border-t border-white/10 p-6 space-y-6">
            {/* Pipeline Overview */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Face Swap Pipeline Configuration
              </h3>

              {/* Mapped Pose */}
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/50 text-xs uppercase tracking-wide">
                    Mapped Portrait Pose
                  </label>
                  {mappedPose && (
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs font-medium">
                      {mappedPose}
                    </span>
                  )}
                </div>
                <p className="text-white/70 text-sm">
                  {mappedPose
                    ? `This page uses a pre-generated "${mappedPose}" portrait for face swapping.`
                    : "No pose mapping found for this page."}
                </p>
              </div>
            </div>

            {/* Stage 1: InstantID Portrait Prompt */}
            {portraitPrompt && (
              <div>
                <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="flex items-center justify-between w-full text-left mb-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`transition-transform ${showPrompt ? "rotate-0" : "-rotate-90"}`}
                    >
                      <ChevronDown />
                    </span>
                    <label className="text-cyan-400 text-sm font-semibold uppercase tracking-wide">
                      Stage 1: InstantID Portrait Prompt
                    </label>
                    <span className="text-white/40 text-xs">(Primary)</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPrompt(portraitPrompt);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      copied
                        ? "bg-green-500/20 text-green-300"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </button>

                {showPrompt && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Prompt:</label>
                      <pre className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-white/80 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                        {portraitPrompt}
                      </pre>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Negative Prompt:</label>
                      <pre className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-white/60 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                        {PORTRAIT_NEGATIVE_PROMPT}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stage 2: Nano Banana Fallback Prompt */}
            {fallbackPrompt && (
              <div>
                <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="flex items-center justify-between w-full text-left mb-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`transition-transform ${showPrompt ? "rotate-0" : "-rotate-90"}`}
                    >
                      <ChevronDown />
                    </span>
                    <label className="text-amber-400 text-sm font-semibold uppercase tracking-wide">
                      Fallback: Nano Banana Prompt
                    </label>
                    <span className="text-white/40 text-xs">(If primary fails)</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPrompt(fallbackPrompt);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      copied
                        ? "bg-green-500/20 text-green-300"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </button>

                {showPrompt && (
                  <pre className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-white/80 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                    {fallbackPrompt}
                  </pre>
                )}
              </div>
            )}

            {/* Pipeline Flow */}
            <div className="bg-white/5 rounded-lg p-4">
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-3">
                Processing Flow
              </label>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                  1. InstantID + Easel
                </span>
                <span className="text-white/30">→</span>
                <span className="bg-white/10 text-white/60 px-2 py-1 rounded">
                  2. Easel + Original
                </span>
                <span className="text-white/30">→</span>
                <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
                  3. Nano Banana
                </span>
                <span className="text-white/30">→</span>
                <span className="bg-white/10 text-white/60 px-2 py-1 rounded">
                  4. Basic Swap
                </span>
                <span className="text-white/30">→</span>
                <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
                  5. Original
                </span>
              </div>
            </div>
          </div>
        )}

        {/* No prompt message for pages without child */}
        {!page.hasChild && (
          <div className="border-t border-white/10 p-6">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <span className="bg-gray-500/20 px-2 py-1 rounded text-xs">
                No face swap needed
              </span>
              <span>This page does not contain a child character (pages 20, 22)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
