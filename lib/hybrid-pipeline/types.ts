/**
 * Hybrid Face Swap Pipeline Types
 *
 * Two-stage architecture:
 * 1. InstantID: Generate stylized watercolor portraits (7 poses)
 * 2. Easel: Composite portraits onto pre-made illustrations (19 pages)
 */

/**
 * Pose types for InstantID portrait generation
 * These map to the childPose values in story-pages.ts
 */
export type PortraitPose =
  | "profile-left"
  | "profile-right"
  | "three-quarter"
  | "front-facing"
  | "looking-up"
  | "looking-down-close"    // More face detail visible
  | "looking-down-distant"; // Less face detail (aerial views)

/**
 * Generated portrait from InstantID
 */
export interface StylizedPortrait {
  pose: PortraitPose;
  imageUrl: string;
  width: number;
  height: number;
}

/**
 * Portrait cache - maps pose to generated portrait URL
 */
export type PortraitCache = Map<PortraitPose, StylizedPortrait>;

/**
 * Stage 1 result - all generated portraits
 */
export interface PortraitGenerationResult {
  portraits: PortraitCache;
  successCount: number;
  failedPoses: PortraitPose[];
  totalTime: number;
}

/**
 * Face swap method used for a page
 */
export type FaceSwapMethod =
  | "easel-stylized"      // Primary: Easel + stylized portrait
  | "easel-original"      // Fallback 1: Easel + original photo
  | "nano-banana"         // Fallback 2: Current implementation
  | "basic-faceswap"      // Fallback 3: Simple face swap
  | "original";           // Fallback 4: No swap, use original

/**
 * Result of processing a single page
 */
export interface PageProcessingResult {
  pageNumber: number;
  success: boolean;
  imageUrl: string;
  arabicText: string;
  method: FaceSwapMethod;
  error?: string;
  processingTime: number;
}

/**
 * SSE event types for streaming progress
 */
export type SSEEventType =
  | "start"
  | "portraits_start"
  | "portrait_complete"
  | "portraits_complete"
  | "page_start"
  | "image"
  | "complete"
  | "error";

/**
 * SSE event payload structures
 */
export interface SSEStartEvent {
  type: "start";
  totalPages: number;
  pagesNeedingSwap: number;
}

export interface SSEPortraitsStartEvent {
  type: "portraits_start";
  totalPoses: number;
}

export interface SSEPortraitCompleteEvent {
  type: "portrait_complete";
  pose: PortraitPose;
  success: boolean;
  completedCount: number;
  totalPoses: number;
}

export interface SSEPortraitsCompleteEvent {
  type: "portraits_complete";
  successCount: number;
  failedCount: number;
  totalTime: number;
}

export interface SSEPageStartEvent {
  type: "page_start";
  pageNumber: number;
}

export interface SSEImageEvent {
  type: "image";
  pageNumber: number;
  imageUrl: string;
  arabicText: string;
  success: boolean;
  method: FaceSwapMethod;
  completedCount: number;
  totalPages: number;
}

export interface SSECompleteEvent {
  type: "complete";
  totalPages: number;
  successCount: number;
  failedCount: number;
  totalTime: number;
}

export interface SSEErrorEvent {
  type: "error";
  message: string;
  pageNumber?: number;
}

export type SSEEvent =
  | SSEStartEvent
  | SSEPortraitsStartEvent
  | SSEPortraitCompleteEvent
  | SSEPortraitsCompleteEvent
  | SSEPageStartEvent
  | SSEImageEvent
  | SSECompleteEvent
  | SSEErrorEvent;

/**
 * InstantID generation options
 */
export interface InstantIDOptions {
  faceImageUrl: string;
  pose: PortraitPose;
  ipAdapterScale?: number;           // Face identity strength (0.8 default)
  identityControlnetScale?: number;  // Identity preservation (0.9 default)
  guidanceScale?: number;            // Prompt adherence (7.0 default)
  numInferenceSteps?: number;        // Quality steps (30 default)
}

/**
 * Easel face swap options
 */
export interface EaselFaceSwapOptions {
  baseImageUrl: string;      // Pre-made illustration
  swapImageUrl: string;      // Stylized portrait (or original photo for fallback)
  upscale?: boolean;         // 2x quality boost (default: true)
}

/**
 * Pipeline configuration
 */
export interface HybridPipelineConfig {
  childPhotoUrl: string;
  childName: string;
  gender?: "boy" | "girl";
  baseUrl: string;           // For constructing illustration URLs
  concurrency?: number;      // Pages to process in parallel (default: 3)
  enableFallbacks?: boolean; // Use fallback chain on failures (default: true)
  pageNumbers?: number[];    // Specific pages to generate (default: all pages 1-22)
}

/**
 * Full pipeline result
 */
export interface HybridPipelineResult {
  pages: PageProcessingResult[];
  portraitGenerationTime: number;
  pageProcessingTime: number;
  totalTime: number;
  methodBreakdown: Record<FaceSwapMethod, number>;
}
