/**
 * Page to Portrait Pose Mapper
 *
 * Maps each story page to the appropriate pre-generated portrait pose.
 * This ensures each page gets the correct head angle for seamless face swap.
 *
 * Based on childPose values from story-pages.ts, with looking-down split into
 * "close" and "distant" variants based on scene context.
 */

import { PortraitPose } from "./types";
import { getPageConfig, STORY_PAGES } from "@/lib/prompts/story-pages";

/**
 * Direct mapping from page number to portrait pose
 *
 * Derived from the childPose field in story-pages.ts:
 * - profile-left: pages 1, 13, 19
 * - profile-right: pages 3, 9, 14
 * - three-quarter: pages 2, 6, 11, 18
 * - front-facing: pages 16, 21
 * - looking-up: pages 4, 12
 * - looking-down-close: pages 10, 15, 17 (city/industrial scenes, more face visible)
 * - looking-down-distant: pages 5, 7, 8 (aerial/flying scenes, less face visible)
 */
const PAGE_TO_POSE: Record<number, PortraitPose> = {
  // profile-left: face turned to the left
  1: "profile-left",   // Boy at window looking at stars
  13: "profile-left",  // Boy riding through Hegra
  19: "profile-left",  // Falcon returning to window

  // profile-right: face turned to the right
  3: "profile-right",  // Boy talking to falcon
  9: "profile-right",  // Boy over Najd desert
  14: "profile-right", // Boy on Asir mountain

  // three-quarter: slightly angled view
  2: "three-quarter",  // Boy seeing falcon at window
  6: "three-quarter",  // Boy near Kaaba
  11: "three-quarter", // Boy between old and new Riyadh
  18: "three-quarter", // Boy with golden feathers

  // front-facing: looking at viewer
  16: "front-facing",  // Emotional moment, feathers floating
  21: "front-facing",  // Boy in bedroom with storybook

  // looking-up: head tilted toward sky
  4: "looking-up",     // Boy taking off into sky
  12: "looking-up",    // Boy at AlUla tombs

  // looking-down-close: aerial view but face more visible
  10: "looking-down-close",  // Boy viewing Riyadh skyline
  15: "looking-down-close",  // Boy over Eastern Province
  17: "looking-down-close",  // Boy viewing map of Saudi Arabia

  // looking-down-distant: high aerial, less face detail
  5: "looking-down-distant",  // Boy over Makkah, Kaaba below
  7: "looking-down-distant",  // Boy at Prophet's Mosque
  8: "looking-down-distant",  // Boy watching learning circles
};

/**
 * Get the portrait pose required for a specific page
 * Returns undefined for pages without children (page 20, 22)
 */
export function getPoseForPage(pageNumber: number): PortraitPose | undefined {
  const page = getPageConfig(pageNumber);

  // Pages without children don't need face swap
  if (!page || !page.hasChild) {
    return undefined;
  }

  return PAGE_TO_POSE[pageNumber];
}

/**
 * Get all pages that use a specific pose
 * Useful for understanding which pages share the same portrait
 */
export function getPagesForPose(pose: PortraitPose): number[] {
  return Object.entries(PAGE_TO_POSE)
    .filter(([_, p]) => p === pose)
    .map(([pageNum, _]) => parseInt(pageNum))
    .sort((a, b) => a - b);
}

/**
 * Get all pages that need face swap, grouped by pose
 * This is used for efficient batch processing
 */
export function getPagesByPose(): Map<PortraitPose, number[]> {
  const result = new Map<PortraitPose, number[]>();

  for (const [pageNum, pose] of Object.entries(PAGE_TO_POSE)) {
    const pages = result.get(pose) || [];
    pages.push(parseInt(pageNum));
    result.set(pose, pages);
  }

  // Sort page numbers within each pose
  Array.from(result.values()).forEach(pages => {
    pages.sort((a, b) => a - b);
  });

  return result;
}

/**
 * Get all pages that need face swap (in page order)
 */
export function getPagesNeedingFaceSwap(): number[] {
  return STORY_PAGES
    .filter(page => page.hasChild)
    .map(page => page.pageNumber);
}

/**
 * Get statistics about pose distribution
 */
export function getPoseDistribution(): Record<PortraitPose, number> {
  const distribution: Record<string, number> = {};

  for (const pose of Object.values(PAGE_TO_POSE)) {
    distribution[pose] = (distribution[pose] || 0) + 1;
  }

  return distribution as Record<PortraitPose, number>;
}

/**
 * Validate that all pages with children have a pose mapping
 */
export function validatePoseMapping(): { valid: boolean; missingPages: number[] } {
  const pagesWithChildren = STORY_PAGES
    .filter(page => page.hasChild)
    .map(page => page.pageNumber);

  const missingPages = pagesWithChildren.filter(
    pageNum => !PAGE_TO_POSE[pageNum]
  );

  return {
    valid: missingPages.length === 0,
    missingPages,
  };
}
