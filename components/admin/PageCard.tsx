"use client";

import React from "react";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StoryPageConfig } from "@/lib/prompts/story-pages";

interface PageCardProps {
  page: StoryPageConfig;
  onClick: () => void;
}

// Grip icon for drag handle
function GripVertical() {
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
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  );
}

export function PageCard({ page, onClick }: PageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.pageNumber });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const imageUrl = `/pagesimages/page-${page.pageNumber}.png`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-purple-500/50 hover:bg-white/10 ${
        isDragging ? "opacity-50 shadow-2xl scale-105" : ""
      }`}
      onClick={onClick}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] bg-black/20">
        <Image
          src={imageUrl}
          alt={`Page ${page.pageNumber}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Page number badge */}
        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-bold">
          {page.pageNumber}
        </div>

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 bg-black/70 text-white/70 p-1.5 rounded-lg cursor-grab active:cursor-grabbing hover:bg-black/90 hover:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical />
        </div>

        {/* hasChild indicator */}
        <div
          className={`absolute bottom-2 right-2 w-3 h-3 rounded-full ${
            page.hasChild ? "bg-green-500" : "bg-gray-500"
          }`}
          title={page.hasChild ? "Has child face" : "No child face"}
        />
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Pose pill */}
        {page.childPose && (
          <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-xs">
            {page.childPose}
          </span>
        )}

        {/* Arabic text preview */}
        <p
          dir="rtl"
          className="text-right text-white/80 text-sm line-clamp-2 font-arabic leading-relaxed"
        >
          {page.arabicText}
        </p>

        {/* Description */}
        <p className="text-white/50 text-xs line-clamp-1">{page.description}</p>
      </div>
    </div>
  );
}
