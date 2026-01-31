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
    "Portrait of a child looking to the left, clean profile view, " +
    "left side of face clearly visible, " +
    "CRITICAL: visible eye must be perfectly shaped, clear, bright, symmetrical within itself, " +
    "eye with accurate iris and pupil, natural eyelashes, proper eye proportions, " +
    "well-defined nose and jawline, ear visible on right, " +
    "smooth facial contours",

  "profile-right":
    "Portrait of a child looking to the right, clean profile view, " +
    "right side of face clearly visible, " +
    "CRITICAL: visible eye must be perfectly shaped, clear, bright, symmetrical within itself, " +
    "eye with accurate iris and pupil, natural eyelashes, proper eye proportions, " +
    "well-defined nose and jawline, ear visible on left, " +
    "smooth facial contours",

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
    "CRITICAL IDENTITY PRESERVATION - Make the child look EXACTLY like the reference photo: " +
    "SKIN TONE (HIGHEST PRIORITY): Copy the EXACT skin color from reference photo - this is the most important feature for identity, " +
    "match the precise shade, undertone (warm/cool/neutral), and complexion of the child's skin, " +
    "if child has light skin use light skin, if child has medium skin use medium skin, if child has dark skin use dark skin, " +
    "DO NOT lighten or darken the skin - preserve the exact skin color as shown in the reference, " +
    "render skin in painterly watercolor style but maintain accurate color, " +
    "HAIR COLOR (HIGHEST PRIORITY - MUST BE CONSISTENT): Copy the EXACT hair color from reference photo, " +
    "if child has BLACK hair use BLACK hair, if child has BROWN hair use BROWN hair, if child has BLONDE hair use BLONDE hair, " +
    "DO NOT change hair color under any circumstances - hair color must be identical to reference photo, " +
    "preserve exact hairstyle, hair length, hair part, and hair texture from reference photo, " +
    "hair color must remain consistent and match the reference in every portrait, " +
    "render hair in painted watercolor style with soft edges but maintain EXACT hair color, " +
    "FACIAL FEATURES: Preserve face shape, eye shape, nose shape, mouth from reference photo, " +
    "EYES: perfectly shaped eyes with accurate size, clear bright iris matching reference eye color, " +
    "maintain precise facial proportions and identity characteristics, " +
    "clean background, portrait composition, " +
    "seamless painterly quality, no harsh edges, professional children's book illustration quality";
}

/**
 * Negative prompt to avoid photorealistic results and distortions
 */
export const PORTRAIT_NEGATIVE_PROMPT =
  "photorealistic, photograph, photo, 3d render, cgi, " +
  "harsh shadows, sharp edges, digital art, anime, cartoon, " +
  "blurry, low quality, distorted features, asymmetrical face, " +
  "BAD EYES: different sized eyes, uneven eyes, crossed eyes, misaligned eyes, " +
  "distorted eyes, deformed eyes, blurry eyes, closed eyes, squinting, " +
  "wrong eye color, malformed iris, misshapen pupil, no pupils, " +
  "eye asymmetry, eye distortion, droopy eyes, lazy eye, " +
  "deformed face, malformed features, extra eyes, missing features, " +
  "WRONG SKIN: wrong skin color, incorrect skin tone, lightened skin, darkened skin, " +
  "changed complexion, altered skin color, whitewashed skin, different ethnicity skin, " +
  "pale skin when reference has dark skin, dark skin when reference has light skin, " +
  "WRONG HAIR (CRITICAL): wrong hair color, different hair color, changed hair color, altered hair color, " +
  "black hair when reference has brown hair, brown hair when reference has black hair, " +
  "blonde hair when reference has dark hair, dark hair when reference has light hair, " +
  "red hair when not in reference, gray hair, white hair, unnatural hair color, " +
  "different hairstyle, changed hair length, altered hair texture, " +
  "inconsistent hair color, hair color that doesn't match reference, " +
  "unrealistic hair, photorealistic hair strands, overly detailed hair texture, " +
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
