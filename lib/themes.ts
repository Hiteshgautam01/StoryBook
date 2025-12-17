import { StoryTheme, ThemeType } from "@/types";

export const themes: StoryTheme[] = [
  {
    id: 'space',
    title: 'Space Adventure',
    description: 'Blast off to the stars and explore distant galaxies!',
    emoji: '🚀',
    color: '#1e3a5f',
    gradient: 'from-indigo-900 via-purple-900 to-black',
    pageCount: 8,
  },
  {
    id: 'kingdom',
    title: 'Magical Kingdom',
    description: 'Enter a world of castles, dragons, and enchanted forests!',
    emoji: '🏰',
    color: '#7c3aed',
    gradient: 'from-purple-600 via-pink-500 to-rose-400',
    pageCount: 8,
  },
  {
    id: 'safari',
    title: 'Safari Explorer',
    description: 'Meet amazing animals on an African adventure!',
    emoji: '🦁',
    color: '#d97706',
    gradient: 'from-amber-500 via-orange-500 to-yellow-400',
    pageCount: 8,
  },
  {
    id: 'ocean',
    title: 'Ocean Discovery',
    description: 'Dive deep into the sea and discover underwater wonders!',
    emoji: '🌊',
    color: '#0891b2',
    gradient: 'from-cyan-500 via-blue-500 to-teal-400',
    pageCount: 8,
  },
  {
    id: 'superhero',
    title: 'Superhero Origin',
    description: 'Discover your amazing superpowers and save the day!',
    emoji: '🦸',
    color: '#dc2626',
    gradient: 'from-red-600 via-orange-500 to-yellow-400',
    pageCount: 8,
  },
];

export const getThemeById = (id: ThemeType): StoryTheme | undefined => {
  return themes.find(theme => theme.id === id);
};
