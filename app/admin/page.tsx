"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { STORY_PAGES, StoryPageConfig, ChildPose } from "@/lib/prompts/story-pages";
import { usePageOrder } from "@/lib/hooks/usePageOrder";
import { PageCard } from "@/components/admin/PageCard";
import { PageDetailsModal } from "@/components/admin/PageDetailsModal";
import { PageFilters } from "@/components/admin/PageFilters";

// Arrow left icon
function ArrowLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

// Refresh icon
function RefreshIcon() {
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
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

export default function AdminPage() {
  const { orderedPages, hasCustomOrder, reorder, resetOrder } = usePageOrder();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChildFilter, setHasChildFilter] = useState<
    "all" | "has-child" | "no-child"
  >("all");
  const [poseFilter, setPoseFilter] = useState<ChildPose | "all">("all");

  // Modal state
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter pages
  const filteredPages = useMemo(() => {
    return orderedPages.filter((page) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesArabic = page.arabicText.includes(searchQuery);
        const matchesDescription = page.description
          .toLowerCase()
          .includes(query);
        if (!matchesArabic && !matchesDescription) return false;
      }

      // Has child filter
      if (hasChildFilter === "has-child" && !page.hasChild) return false;
      if (hasChildFilter === "no-child" && page.hasChild) return false;

      // Pose filter
      if (poseFilter !== "all" && page.childPose !== poseFilter) return false;

      return true;
    });
  }, [orderedPages, searchQuery, hasChildFilter, poseFilter]);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorder(active.id as number, over.id as number);
    }
  };

  // Modal navigation
  const selectedPage =
    selectedPageIndex !== null ? filteredPages[selectedPageIndex] : null;

  const handleOpenModal = (page: StoryPageConfig) => {
    const index = filteredPages.findIndex(
      (p) => p.pageNumber === page.pageNumber
    );
    setSelectedPageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedPageIndex(null);
  };

  const handlePrevious = () => {
    if (selectedPageIndex !== null && selectedPageIndex > 0) {
      setSelectedPageIndex(selectedPageIndex - 1);
    }
  };

  const handleNext = () => {
    if (
      selectedPageIndex !== null &&
      selectedPageIndex < filteredPages.length - 1
    ) {
      setSelectedPageIndex(selectedPageIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <h1 className="text-xl font-bold text-white">
              Story Pages Configuration
            </h1>
          </div>

          {hasCustomOrder && (
            <button
              onClick={resetOrder}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <RefreshIcon />
              <span className="hidden sm:inline">Reset Order</span>
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <PageFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hasChildFilter={hasChildFilter}
          onHasChildFilterChange={setHasChildFilter}
          poseFilter={poseFilter}
          onPoseFilterChange={setPoseFilter}
          resultCount={filteredPages.length}
          totalCount={STORY_PAGES.length}
        />

        {/* Pages grid */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredPages.map((p) => p.pageNumber)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPages.map((page) => (
                <PageCard
                  key={page.pageNumber}
                  page={page}
                  onClick={() => handleOpenModal(page)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Empty state */}
        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">
              No pages match your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setHasChildFilter("all");
                setPoseFilter("all");
              }}
              className="mt-4 text-purple-400 hover:text-purple-300 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      <PageDetailsModal
        page={selectedPage}
        onClose={handleCloseModal}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={selectedPageIndex !== null && selectedPageIndex > 0}
        hasNext={
          selectedPageIndex !== null &&
          selectedPageIndex < filteredPages.length - 1
        }
      />
    </div>
  );
}
