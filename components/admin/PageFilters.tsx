"use client";

import React from "react";
import { ChildPose } from "@/lib/prompts/story-pages";

interface PageFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasChildFilter: "all" | "has-child" | "no-child";
  onHasChildFilterChange: (filter: "all" | "has-child" | "no-child") => void;
  poseFilter: ChildPose | "all";
  onPoseFilterChange: (pose: ChildPose | "all") => void;
  resultCount: number;
  totalCount: number;
}

const POSE_OPTIONS: (ChildPose | "all")[] = [
  "all",
  "profile-left",
  "profile-right",
  "three-quarter",
  "front-facing",
  "looking-up",
  "looking-down",
  "back-view",
  "side-silhouette",
];

// Search icon
function SearchIcon() {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function PageFilters({
  searchQuery,
  onSearchChange,
  hasChildFilter,
  onHasChildFilterChange,
  poseFilter,
  onPoseFilterChange,
  resultCount,
  totalCount,
}: PageFiltersProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search Arabic text or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-colors"
          />
        </div>

        {/* Has child filter */}
        <div className="flex items-center gap-2">
          <label className="text-white/50 text-sm whitespace-nowrap">
            Child:
          </label>
          <select
            value={hasChildFilter}
            onChange={(e) =>
              onHasChildFilterChange(
                e.target.value as "all" | "has-child" | "no-child"
              )
            }
            className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            <option value="all" className="bg-gray-900">
              All
            </option>
            <option value="has-child" className="bg-gray-900">
              Has Child
            </option>
            <option value="no-child" className="bg-gray-900">
              No Child
            </option>
          </select>
        </div>

        {/* Pose filter */}
        <div className="flex items-center gap-2">
          <label className="text-white/50 text-sm whitespace-nowrap">
            Pose:
          </label>
          <select
            value={poseFilter}
            onChange={(e) =>
              onPoseFilterChange(e.target.value as ChildPose | "all")
            }
            className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            {POSE_OPTIONS.map((pose) => (
              <option key={pose} value={pose} className="bg-gray-900">
                {pose === "all" ? "All Poses" : pose}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      <div className="text-white/50 text-sm">
        Showing{" "}
        <span className="text-white font-medium">{resultCount}</span> of{" "}
        <span className="text-white font-medium">{totalCount}</span> pages
      </div>
    </div>
  );
}
