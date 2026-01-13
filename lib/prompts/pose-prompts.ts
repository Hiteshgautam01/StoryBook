/**
 * Pose-Specific Prompts for InstantID Portrait Generation
 *
 * These prompts are used in Stage 1 of the hybrid pipeline to generate
 * stylized watercolor portraits that match the children's book illustration style.
 *
 * Each pose type corresponds to how the child appears in different story pages.
 */

import { PortraitPose } from "@/lib/hybrid-pipeline/types";
import { ILLUSTRATION_STYLE_DNA } from "./story-pages";

/**
 * Base style prompt that applies to all portraits
 * Matches the art style of the existing story illustrations
 */
const BASE_STYLE = `${ILLUSTRATION_STYLE_DNA.medium} style, ` +
  `${ILLUSTRATION_STYLE_DNA.texture}, ` +
  `${ILLUSTRATION_STYLE_DNA.lighting}, ` +
  `${ILLUSTRATION_STYLE_DNA.colorPalette}, ` +
  `${ILLUSTRATION_STYLE_DNA.mood} atmosphere, ` +
  `${ILLUSTRATION_STYLE_DNA.quality}`;

/**
 * Pose-specific prompt components
 */
const POSE_DIRECTIONS: Record<PortraitPose, string> = {
  "profile-left":
    "Portrait of a child looking to the left, profile view, " +
    "left side of face visible, ear visible on right",

  "profile-right":
    "Portrait of a child looking to the right, profile view, " +
    "right side of face visible, ear visible on left",

  "three-quarter":
    "Portrait of a child, three-quarter angle view, " +
    "face slightly turned, both eyes visible, natural pose",

  "front-facing":
    "Portrait of a child looking directly forward at the viewer, " +
    "frontal view, symmetrical composition, engaging expression",

  "looking-up":
    "Portrait of a child looking upward toward the sky, " +
    "head tilted back, chin raised, wonder in expression, " +
    "underside of jaw slightly visible",

  "looking-down-close":
    "Portrait of a child looking downward, close-up view, " +
    "head tilted forward, top of head prominent, " +
    "eyes cast down, facial features clearly visible",

  "looking-down-distant":
    "Portrait of a child looking downward from a high aerial view, " +
    "top of head most prominent, face foreshortened, " +
    "as if seen from above while flying",
};

/**
 * Build the full InstantID prompt for a given pose
 */
export function buildPortraitPrompt(pose: PortraitPose): string {
  const direction = POSE_DIRECTIONS[pose];

  return `${direction}, ${BASE_STYLE}, ` +
    "soft expressive eyes, natural skin texture rendered as paint, " +
    "clean background, portrait composition, " +
    "no harsh edges, seamless painterly quality";
}

/**
 * Negative prompt to avoid photorealistic results
 */
export const PORTRAIT_NEGATIVE_PROMPT =
  "photorealistic, photograph, photo, 3d render, cgi, " +
  "harsh shadows, sharp edges, digital art, anime, cartoon, " +
  "blurry, low quality, distorted features, " +
  "multiple people, full body, hands";

/**
 * Get all pose prompts for reference
 */
export function getAllPosePrompts(): Record<PortraitPose, string> {
  const poses: PortraitPose[] = [
    "profile-left",
    "profile-right",
    "three-quarter",
    "front-facing",
    "looking-up",
    "looking-down-close",
    "looking-down-distant",
  ];

  return poses.reduce((acc, pose) => {
    acc[pose] = buildPortraitPrompt(pose);
    return acc;
  }, {} as Record<PortraitPose, string>);
}

/**
 * All poses that need to be generated
 */
export const ALL_POSES: PortraitPose[] = [
  "profile-left",
  "profile-right",
  "three-quarter",
  "front-facing",
  "looking-up",
  "looking-down-close",
  "looking-down-distant",
];
