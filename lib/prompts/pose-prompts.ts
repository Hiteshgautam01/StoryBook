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
 * Identity-first prompt prefix - THIS MUST COME FIRST
 * Ensures the model prioritizes matching the reference photo
 *
 * KEY CONCEPT: The child in the reference photo IS the main character.
 * Think of it like the child is an ACTOR playing a role in a storybook movie.
 * The child must look EXACTLY like themselves - same face, same features, same everything.
 */
const IDENTITY_FIRST_PREFIX =
  "🎬 ROLE: The child in the reference photo is the STAR of this storybook. " +
  "This is THEIR personalized story - they are PLAYING the main character. " +
  "The child in the illustration must be IDENTICAL to the child in the reference photo. " +
  "Imagine you are painting a portrait of THIS SPECIFIC CHILD in a storybook scene. " +
  "A parent looking at this must IMMEDIATELY recognize their own child. " +
  "This is a GIFT for a family - accuracy is EVERYTHING. " +

  "═══════════════════════════════════════════════════════════════════════════════ " +
  "FACE CLONING PROTOCOL - COPY THE REFERENCE FACE EXACTLY " +
  "═══════════════════════════════════════════════════════════════════════════════ " +

  "🔴 RULE #1 - FACE IS SACRED (ZERO TOLERANCE FOR CHANGES): " +
  "The child's face is their identity. DO NOT modify, beautify, or 'improve' ANY facial feature. " +
  "Every facial feature must be a DIRECT COPY from the reference photo. " +
  "If you change the face, you change the child - this is UNACCEPTABLE. " +

  "🔴 RULE #2 - SKIN TONE (HIGHEST PRIORITY - DEFINES IDENTITY): " +
  "Skin color is the FOUNDATION of this child's appearance. " +
  "SAMPLE the skin tone DIRECTLY from the reference photo. " +
  "If child has DARK skin → paint DARK skin (same shade, same undertone). " +
  "If child has LIGHT skin → paint LIGHT skin (same shade, same undertone). " +
  "If child has BROWN skin → paint BROWN skin (same shade, same undertone). " +
  "If child has OLIVE skin → paint OLIVE skin (same shade, same undertone). " +
  "The skin must be CONSISTENT across face, neck, ears, hands - all visible areas. " +
  "NEVER lighten dark skin. NEVER darken light skin. NEVER change undertones. " +
  "⚠️ WRONG SKIN TONE = FAILED ILLUSTRATION. This is NON-NEGOTIABLE. " +

  "🔴 RULE #3 - HAIR (CRITICAL IDENTITY MARKER): " +
  "Hair color and style are IMMEDIATELY noticeable identity markers. " +
  "HAIR COLOR: Copy the EXACT color from reference - " +
  "BLACK hair stays BLACK (not dark brown, not gray). " +
  "BROWN hair stays BROWN (the exact shade - light, medium, or dark). " +
  "BLONDE hair stays BLONDE (the exact shade). " +
  "RED/AUBURN hair stays RED/AUBURN (the exact shade). " +
  "HAIR TEXTURE: Copy EXACTLY - straight, wavy, curly, coily, kinky. " +
  "HAIR STYLE: Copy EXACTLY - length, parting, bangs, braids, ponytail, buns. " +
  "HAIR THICKNESS: Copy EXACTLY - thick, thin, fine, full, voluminous. " +
  "⚠️ Parents notice hair changes INSTANTLY. Hair must be IDENTICAL to reference. " +

  "🔴 RULE #4 - FACE SHAPE (ESSENTIAL FOR RECOGNITION): " +
  "The silhouette and structure of the face must match EXACTLY. " +
  "FACE SHAPE: Round, oval, heart, square, long - match the reference. " +
  "CHEEKS: Chubby cheeks stay chubby, slim cheeks stay slim - exact match. " +
  "CHIN: Pointed, rounded, square - copy the exact chin from reference. " +
  "JAWLINE: Soft, defined, round - match the reference exactly. " +
  "FOREHEAD: Size and shape must match the reference. " +
  "If you trace the outline of the reference face, your illustration's face outline must MATCH. " +

  "🔴 RULE #5 - FACIAL FEATURES (EVERY DETAIL MATTERS): " +
  "EYES: " +
  "- EYE COLOR: Match EXACTLY - brown, black, blue, green, hazel (from reference only). " +
  "- EYE SHAPE: Round, almond, hooded, monolid - copy from reference. " +
  "- EYE SIZE: Preserve the relative size and spacing from reference. " +
  "- EYELASHES: Natural length and density from reference. " +
  "NOSE: " +
  "- Size (small, medium, large), width, bridge shape, tip shape - all from reference. " +
  "- Button nose stays button nose, prominent nose stays prominent. " +
  "LIPS/MOUTH: " +
  "- Fullness, shape, width - copy from reference. " +
  "- Thin lips stay thin, full lips stay full. " +
  "EYEBROWS: " +
  "- Shape, thickness, arch, color - match the reference. " +
  "EARS: " +
  "- Size and shape if visible - match the reference. " +

  "🔴 RULE #6 - UNIQUE CHARACTERISTICS (MUST PRESERVE): " +
  "These make the child UNIQUE and recognizable to their family: " +
  "- Freckles: If present in reference, include them. " +
  "- Dimples: If present in reference, include them. " +
  "- Birthmarks or moles: If visible in reference, include them. " +
  "- Distinctive features: Any unique characteristic that stands out. " +
  "These details are what make THIS child different from any other child. " +

  "🔴 RULE #7 - AGE PRESERVATION: " +
  "The child must look the SAME AGE as in the reference photo. " +
  "Do not make them look older or younger. " +
  "Baby face features stay baby-like, older child features stay mature. " +

  "═══════════════════════════════════════════════════════════════════════════════ " +
  "THE GOLDEN TEST: Would the child's parents look at this illustration and say " +
  "'That's MY child! That looks EXACTLY like them!' " +
  "If not, the illustration has FAILED. " +
  "═══════════════════════════════════════════════════════════════════════════════ ";

/**
 * Pose-specific prompt components
 */
const POSE_DIRECTIONS: Record<PortraitPose, string> = {
  "profile-left":
    "Side profile portrait facing LEFT. " +
    "Left side of face visible, right ear visible. " +
    "Clean profile showing nose bridge, lip shape, chin contour, jawline. " +
    "Visible eye must be clear with proper iris/pupil, natural eyelashes. " +
    "Hair flows naturally, showing texture and color from reference.",

  "profile-right":
    "Side profile portrait facing RIGHT. " +
    "Right side of face visible, left ear visible. " +
    "Clean profile showing nose bridge, lip shape, chin contour, jawline. " +
    "Visible eye must be clear with proper iris/pupil, natural eyelashes. " +
    "Hair flows naturally, showing texture and color from reference.",

  "three-quarter":
    "Three-quarter angle portrait, face slightly turned. " +
    "Both sides of face partially visible, showing face shape clearly. " +
    "BOTH eyes visible - must be symmetrical, clear, bright, properly shaped. " +
    "Each eye with accurate iris color matching reference, centered pupil, white sclera. " +
    "Natural expression, nose and lips clearly defined.",

  "front-facing":
    "Direct frontal portrait, face looking straight at viewer. " +
    "Symmetrical composition showing full face shape. " +
    "BOTH eyes perfectly visible - symmetrical, clear, engaging, looking at viewer. " +
    "Eyes must match reference color exactly, bright and alive. " +
    "Full view of nose, lips, cheeks - all matching reference proportions.",

  "looking-up":
    "Portrait with head tilted back, looking upward at sky. " +
    "Chin raised, underside of jaw slightly visible. " +
    "Eyes gazing up with wonder - still clear and properly shaped despite angle. " +
    "Face shape and features still clearly recognizable from reference. " +
    "Expression of awe and amazement.",

  "looking-down-close":
    "Close-up portrait looking downward. " +
    "Head tilted forward, forehead and top of head prominent. " +
    "Eyes cast downward - still properly shaped with natural eyelids. " +
    "Hair texture and color clearly visible on top of head. " +
    "Peaceful, contemplative expression. Face still matches reference.",

  "looking-down-distant":
    "Aerial view portrait, seen from above. " +
    "Top of head most prominent, face foreshortened. " +
    "Hair pattern and color clearly visible from above. " +
    "Facial features still recognizable despite angle. " +
    "Child looks natural, face shape preserved from reference.",
};

/**
 * Build the full InstantID prompt for a given pose
 * IDENTITY FIRST approach - identity features come BEFORE style to ensure they're prioritized
 *
 * The child in the reference photo is the STAR - they are playing the main character role.
 */
export function buildPortraitPrompt(pose: PortraitPose): string {
  const direction = POSE_DIRECTIONS[pose];

  // Structure: IDENTITY FIRST → POSE → STYLE → QUALITY CHECKS
  return (
    // 1. IDENTITY MATCHING (HIGHEST PRIORITY - FIRST IN PROMPT)
    IDENTITY_FIRST_PREFIX +

    // 2. POSE DIRECTION
    `POSE: ${direction} ` +

    // 3. STYLE (comes AFTER identity)
    `STYLE: ${BASE_STYLE}, children's book illustration, soft painterly quality, clean background. ` +

    // 4. FACE QUALITY REQUIREMENTS
    "FACE QUALITY (CRITICAL): " +
    "The face must be PERFECT - this is the child's identity. " +
    "EYES: Crystal clear, bright, properly shaped with EXACT iris color from reference. " +
    "NO distortion, warping, melting, or artifacts on face under ANY circumstances. " +
    "Skin must have natural texture with the EXACT skin tone from reference (no lightening/darkening). " +
    "Hair must have proper texture with the EXACT color from reference (black stays black, brown stays brown). " +
    "Face proportions must MATCH the reference - same distance between eyes, same nose length, same lip width. " +

    // 5. STORYBOOK INTEGRATION
    "STORYBOOK ROLE: " +
    "This child is the MAIN CHARACTER of their personalized storybook. " +
    "They are playing the hero role - like an actor in a movie adapted just for them. " +
    "The illustration should look like THIS SPECIFIC CHILD in a magical storybook world. " +
    "Blend the child naturally into the illustrated style while keeping their face 100% accurate. " +

    // 6. FINAL IDENTITY VERIFICATION
    "═══════════════════════════════════════════════════════════════════════════════ " +
    "FINAL VERIFICATION CHECKLIST (ALL MUST PASS): " +
    "□ Skin tone is IDENTICAL to reference (not lighter, not darker, same undertone) " +
    "□ Hair COLOR is IDENTICAL to reference (exact shade, no changes) " +
    "□ Hair STYLE is IDENTICAL to reference (length, texture, parting) " +
    "□ Face SHAPE matches reference (same outline, same proportions) " +
    "□ Eye COLOR matches reference exactly " +
    "□ All facial features match reference (nose, lips, eyebrows, chin) " +
    "□ Child looks the SAME AGE as in reference " +
    "□ The child is IMMEDIATELY recognizable as the person in the reference photo " +
    "═══════════════════════════════════════════════════════════════════════════════ " +
    "🎯 THE ULTIMATE TEST: Would the child's parents look at this and instantly say " +
    "'That's MY child! That's EXACTLY what they look like!' - If yes, SUCCESS. If no, FAILED."
  );
}

/**
 * Negative prompt to avoid photorealistic results and identity changes
 * Structured by priority - most critical identity issues first
 *
 * This is crucial for preventing the AI from changing the child's appearance
 */
export const PORTRAIT_NEGATIVE_PROMPT =
  // ═══════════════════════════════════════════════════════════════════════════════
  // SKIN TONE PROTECTION (HIGHEST PRIORITY - MOST CRITICAL)
  // ═══════════════════════════════════════════════════════════════════════════════
  "wrong skin color, incorrect skin tone, changed skin color, altered complexion, " +
  "lightened skin, darkened skin, bleached skin, whitewashed skin, washed out skin, " +
  "pale skin on dark child, dark skin on light child, pink skin on brown child, " +
  "lighter skin than reference, darker skin than reference, different skin shade, " +
  "gray skin, yellow skin, orange skin, green skin, blue skin, unnatural skin color, " +
  "skin tone mismatch, inconsistent skin tone, uneven skin color, " +
  "fair skin when dark, dark skin when fair, medium skin when light, " +
  "wrong undertone, cool undertone when warm, warm undertone when cool, " +

  // ═══════════════════════════════════════════════════════════════════════════════
  // HAIR PROTECTION (CRITICAL - IMMEDIATELY NOTICEABLE)
  // ═══════════════════════════════════════════════════════════════════════════════
  "wrong hair color, different hair color, changed hair color, incorrect hair color, " +
  "black hair on blonde child, blonde hair on dark-haired child, brown hair on black-haired child, " +
  "black hair when brown, brown hair when black, dark hair when light, light hair when dark, " +
  "red hair when not in reference, blonde when brunette, brunette when blonde, " +
  "gray hair, white hair, silver hair, unnatural hair color, " +
  "wrong hair texture, straight hair on curly child, curly hair on straight-haired child, " +
  "wavy when straight, straight when wavy, kinky when smooth, smooth when kinky, " +
  "wrong hairstyle, different hair length, wrong hair part, different part, " +
  "short hair when long, long hair when short, bangs when none, no bangs when present, " +
  "bald, receding hairline, thinning hair, wrong hair thickness, " +

  // ═══════════════════════════════════════════════════════════════════════════════
  // FACE SHAPE PROTECTION (ESSENTIAL FOR RECOGNITION)
  // ═══════════════════════════════════════════════════════════════════════════════
  "wrong face shape, different face shape, generic face, template face, stock face, " +
  "altered facial proportions, changed face structure, different person, " +
  "round face on oval child, slim face on chubby child, oval face when round, " +
  "different cheek shape, wrong chin shape, altered jawline, different forehead, " +
  "elongated face, compressed face, widened face, narrowed face, " +
  "adult face on child, child face on teen, wrong age face, " +

  // ═══════════════════════════════════════════════════════════════════════════════
  // EYE PROTECTION (CRITICAL FOR LIKENESS)
  // ═══════════════════════════════════════════════════════════════════════════════
  "wrong eye color, different eye color, blue eyes on brown-eyed child, brown eyes on blue-eyed child, " +
  "green eyes when brown, hazel when dark, light eyes when dark eyes, " +
  "distorted eyes, uneven eyes, crossed eyes, misaligned eyes, asymmetrical eyes, " +
  "deformed iris, warped eyes, dead eyes, lifeless eyes, dull eyes, " +
  "eyes different sizes, blurry eyes, closed eyes, wrong eye shape, " +
  "almond eyes when round, round eyes when almond, hooded when not, " +
  "wrong eye spacing, eyes too close, eyes too far apart, " +

  // ═══════════════════════════════════════════════════════════════════════════════
  // FACIAL FEATURE PROTECTION
  // ═══════════════════════════════════════════════════════════════════════════════
  "wrong nose shape, different nose, smaller nose, larger nose, wider nose, narrower nose, " +
  "wrong lip shape, different lips, thinner lips, fuller lips, wrong lip color, " +
  "wrong chin shape, pointed chin when round, round chin when pointed, " +
  "wrong eyebrow shape, thin eyebrows when thick, thick eyebrows when thin, " +
  "missing freckles, missing dimples, missing birthmarks, missing moles, " +
  "added freckles when none, added dimples when none, " +
  "altered features, changed features, beautified features, uglified features, " +

  // ═══════════════════════════════════════════════════════════════════════════════
  // FACE QUALITY ISSUES (MUST AVOID)
  // ═══════════════════════════════════════════════════════════════════════════════
  "spoiled face, damaged face, corrupted face, broken face, " +
  "melted face, melting features, drooping face, sagging features, " +
  "blurry face, unfocused face, soft face, fuzzy features, " +
  "warped face, distorted face, stretched face, compressed face, " +
  "glitchy face, artifacted face, pixelated face, noisy face, " +
  "multiple faces, merged faces, double face, overlapping faces, " +
  "ghost face, transparent face, faded face, " +

  // ═══════════════════════════════════════════════════════════════════════════════
  // STYLE ISSUES
  // ═══════════════════════════════════════════════════════════════════════════════
  "photorealistic, photograph, photo, 3d render, cgi, anime, cartoon style, " +
  "harsh shadows, sharp edges, overprocessed, " +

  // ═══════════════════════════════════════════════════════════════════════════════
  // GENERAL QUALITY ISSUES
  // ═══════════════════════════════════════════════════════════════════════════════
  "blurry, low quality, distorted, deformed, malformed, " +
  "artifacts, glitchy, noisy, grainy, " +

  // ═══════════════════════════════════════════════════════════════════════════════
  // COMPOSITION ISSUES
  // ═══════════════════════════════════════════════════════════════════════════════
  "multiple people, extra limbs, merged faces, double face, hands visible, " +
  "wrong person, different child, another child, generic child";

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
