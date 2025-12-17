export type ThemeType = 'space' | 'kingdom' | 'safari' | 'ocean' | 'superhero';

export interface ChildProfile {
  name: string;
  image: string | null;
  gender: 'boy' | 'girl' | 'neutral';
  age: number;
}

export interface StoryPage {
  id: number;
  illustration: string;
  text: string;
  backgroundColor: string;
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
}
