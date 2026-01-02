import { Gender } from "@/types";
import { OUTFITS, getPageTemplate, FALCON_STORY, pageHasChild } from "./falcon-story";

export interface PromptVariables {
  childName: string;
  childDescription: string;
  gender: Gender;
  pageNumber: number;
}

export interface ComposedPrompt {
  prompt: string;
  hasChild: boolean; // Whether to use flux-pulid with reference image
  idWeight: number; // Face identity weight for flux-pulid (0-3)
}

/**
 * Get the appropriate outfit description for a page based on gender and setting
 */
export function getOutfitForPage(gender: Gender, pageNumber: number): string {
  const pageTemplate = getPageTemplate(pageNumber);
  const isHome = pageTemplate?.isHomeSetting ?? false;
  const outfitConfig = OUTFITS[gender];
  return isHome ? outfitConfig.home : outfitConfig.journey;
}

/**
 * Compose a full prompt by substituting template variables
 */
export function composePrompt(variables: PromptVariables): ComposedPrompt {
  const pageTemplate = getPageTemplate(variables.pageNumber);

  if (!pageTemplate) {
    throw new Error(`No template found for page ${variables.pageNumber}`);
  }

  const outfit = getOutfitForPage(variables.gender, variables.pageNumber);

  let prompt = pageTemplate.promptTemplate;

  // Replace all template variables
  prompt = prompt.replace(/\{\{childName\}\}/g, variables.childName);
  prompt = prompt.replace(/\{\{childDescription\}\}/g, variables.childDescription);
  prompt = prompt.replace(/\{\{outfit\}\}/g, outfit);

  return {
    prompt,
    hasChild: pageTemplate.hasChild,
    idWeight: pageTemplate.idWeight ?? 1.0, // Default to 1.0 if not specified
  };
}

/**
 * Compose the Arabic text for a page with the child's name
 */
export function composeArabicText(childName: string, pageNumber: number): string {
  const pageTemplate = getPageTemplate(pageNumber);

  if (!pageTemplate) {
    throw new Error(`No template found for page ${pageNumber}`);
  }

  return pageTemplate.arabicText.replace(/\{\{childName\}\}/g, childName);
}

/**
 * Compose the story title with the child's name
 */
export function composeStoryTitle(childName: string, language: 'ar' | 'en' = 'ar'): string {
  const template = language === 'ar' ? FALCON_STORY.titleArabic : FALCON_STORY.titleEnglish;
  return template.replace(/\{\{childName\}\}/g, childName);
}

/**
 * Get all prompts for a child, ready for generation
 */
export function getAllPromptsForChild(variables: Omit<PromptVariables, 'pageNumber'>): Array<{
  pageNumber: number;
  prompt: string;
  arabicText: string;
  isHomeSetting: boolean;
  hasChild: boolean;
}> {
  const prompts: Array<{
    pageNumber: number;
    prompt: string;
    arabicText: string;
    isHomeSetting: boolean;
    hasChild: boolean;
  }> = [];

  for (let i = 0; i < FALCON_STORY.totalPages; i++) {
    const pageTemplate = getPageTemplate(i);
    if (pageTemplate) {
      const composed = composePrompt({ ...variables, pageNumber: i });
      prompts.push({
        pageNumber: i,
        prompt: composed.prompt,
        arabicText: composeArabicText(variables.childName, i),
        isHomeSetting: pageTemplate.isHomeSetting,
        hasChild: composed.hasChild,
      });
    }
  }

  return prompts;
}

/**
 * Create a default child description based on gender (fallback if AI analysis fails)
 */
export function createDefaultDescription(gender: Gender): string {
  const descriptions: Record<Gender, string> = {
    boy: "A young boy with warm brown skin, round cherubic face with full cheeks, bright dark brown eyes, small rounded nose, a wide joyful smile showing small white teeth, short dark hair",
    girl: "A young girl with warm brown skin, round cherubic face with full cheeks, bright dark brown eyes, small rounded nose, a gentle sweet smile, long dark hair with soft waves",
    neutral: "A young child with warm brown skin, round cherubic face with full cheeks, bright dark brown eyes, small rounded nose, a warm friendly smile, short dark hair"
  };

  return descriptions[gender];
}
