"use client";

import React from "react";

interface GenerationProgressProps {
  currentPage: number;
  totalPages: number;
  status: "idle" | "analyzing" | "generating" | "complete" | "error";
  error?: string;
}

export function GenerationProgress({
  currentPage,
  totalPages,
  status,
  error,
}: GenerationProgressProps) {
  const percentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  const statusMessages = {
    idle: "Ready to generate",
    analyzing: "Analyzing photo...",
    generating: `Generating page ${currentPage + 1} of ${totalPages}...`,
    complete: "Story complete!",
    error: error || "An error occurred",
  };

  const statusColors = {
    idle: "text-gray-400",
    analyzing: "text-blue-400",
    generating: "text-purple-400",
    complete: "text-green-400",
    error: "text-red-400",
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Circular Progress */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-white/10"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
            className="transition-all duration-500 ease-out"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{percentage}%</span>
          <span className="text-sm text-white/60 mt-1">
            {currentPage} / {totalPages}
          </span>
        </div>
      </div>

      {/* Status message */}
      <div className="text-center">
        <p className={`text-lg font-medium ${statusColors[status]}`}>
          {statusMessages[status]}
        </p>
        {status === "generating" && (
          <p className="text-sm text-white/50 mt-2">
            This may take a few minutes. Each page is being uniquely generated.
          </p>
        )}
      </div>

      {/* Animated dots for generating state */}
      {status === "generating" && (
        <div className="flex justify-center mt-4 space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {/* Time estimate */}
      {status === "generating" && totalPages > 0 && (
        <p className="text-center text-xs text-white/40 mt-4">
          Estimated time remaining: ~{Math.ceil((totalPages - currentPage) * 0.5)} minutes
        </p>
      )}
    </div>
  );
}
