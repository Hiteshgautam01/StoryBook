export type ThemeType = 'space' | 'kingdom' | 'safari' | 'ocean' | 'superhero';

export type Gender = 'boy' | 'girl' | 'neutral';

export interface ChildProfile {
  name: string;
  image: string | null;
  gender: Gender;
  age: number;
}

// Enhanced child profile with AI-generated description
export interface EnhancedChildProfile extends ChildProfile {
  description: string;        // AI-generated appearance description
  photoUrl: string | null;    // Uploaded photo URL (for Fal AI reference)
}

export interface StoryPage {
  id: number;
  illustration: string;
  text: string;
  backgroundColor: string;
}

// Story page with generation status
export type PageStatus = 'pending' | 'generating' | 'complete' | 'error';

export interface GeneratedStoryPage extends StoryPage {
  status: PageStatus;
  generatedImageUrl?: string;
  errorMessage?: string;
}

export interface StoryTheme {
  id: ThemeType;
  title: string;
  description: string;
  emoji: string;
  color: string;
  gradient: string;
  pageCount: number;
}

export interface Story {
  id: string;
  theme: ThemeType;
  title: string;
  dedication: string;
  pages: StoryPage[];
}

// Generation progress tracking
export type GenerationStatus = 'idle' | 'analyzing' | 'generating' | 'complete' | 'error';

export interface GenerationProgress {
  sessionId: string;
  currentPage: number;
  totalPages: number;
  status: GenerationStatus;
  pages: GeneratedStoryPage[];
  error?: string;
}

// Fal AI types
export interface FalGenerationRequest {
  prompt: string;
  image_url?: string;
  num_images?: number;
  enable_safety_checker?: boolean;
  output_format?: 'jpeg' | 'png';
  aspect_ratio?: string;
  seed?: number;
}

export interface FalGenerationResponse {
  images: Array<{
    url: string;
    width: number;
    height: number;
    content_type: string;
  }>;
  seed: number;
  has_nsfw_concepts?: boolean[];
  prompt: string;
}

// SSE Event types
export type SSEEventType = 'progress' | 'image' | 'error' | 'complete';

export interface SSEProgressEvent {
  type: 'progress';
  page: number;
  total: number;
  status: 'generating';
}

export interface SSEImageEvent {
  type: 'image';
  page: number;
  imageUrl: string;
  arabicText: string;
}

export interface SSEErrorEvent {
  type: 'error';
  page: number;
  message: string;
  retrying: boolean;
}

export interface SSECompleteEvent {
  type: 'complete';
  pages: GeneratedStoryPage[];
}

export type SSEEvent = SSEProgressEvent | SSEImageEvent | SSEErrorEvent | SSECompleteEvent;

// Story page template for prompt system
export interface StoryPageTemplate {
  pageNumber: number;
  arabicText: string;
  promptTemplate: string;
  isHomeSetting: boolean; // true for home scenes (outfit A), false for journey (outfit B)
  hasChild: boolean; // true if the child appears in this page (use flux-pulid), false for scenery-only pages
  idWeight?: number; // Face identity weight for flux-pulid (0-3, default 1.0). Lower for wide shots, higher for close-ups.
}

export interface StoryTemplate {
  id: string;
  titleArabic: string;
  titleEnglish: string;
  defaultChildName: string;
  masterStylePrefix: string;
  totalPages: number;
  pages: StoryPageTemplate[];
}

// Outfit configuration
export interface OutfitConfig {
  home: string;
  journey: string;
}

export type GenderOutfits = Record<Gender, OutfitConfig>;

export interface StoryContextType {
  childProfile: ChildProfile | null;
  setChildProfile: (profile: ChildProfile) => void;
  selectedTheme: ThemeType | null;
  setSelectedTheme: (theme: ThemeType) => void;
  currentStory: Story | null;
  generateStory: () => void;
  isGenerating: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  resetStory: () => void;
  // New generation state
  childDescription: string | null;
  setChildDescription: (desc: string) => void;
  generationProgress: GenerationProgress | null;
  setGenerationProgress: (progress: GenerationProgress | null) => void;
  generatedPages: GeneratedStoryPage[];
  setGeneratedPages: (pages: GeneratedStoryPage[]) => void;
  updateGeneratedPage: (pageNum: number, imageUrl: string) => void;
}
