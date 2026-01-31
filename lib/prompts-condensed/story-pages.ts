/**
 * Story Page Mapping for Face Swap (CONDENSED VERSION)
 *
 * Maps existing story illustrations to their metadata.
 * The existing images in /public/pagesimages/ are the base illustrations.
 * For personalization, we swap the child's face with the uploaded photo.
 */

/**
 * Style DNA - Consistent art style definition for all illustrations
 */
export const ILLUSTRATION_STYLE_DNA = {
  medium: "gouache and watercolor painting",
  texture: "soft brush strokes with visible paint texture",
  lighting: "warm golden ambient lighting with soft shadows",
  colorPalette: "rich jewel tones - deep purple, golden amber, turquoise, warm browns",
  mood: "magical, dreamlike, warm and inviting",
  quality: "professional children's book illustration, high detail",
} as const;

/**
 * Canonical Falcon Design - MUST be consistent across all scenes with the falcon
 */
export const CANONICAL_FALCON = {
  anatomy: "CRITICAL: Real falcon with exactly TWO wings (one on each side), symmetrical, attached at shoulders.",
  appearance: "majestic golden falcon with wings that shimmer like burnished gold, powerful broad wingspan",
  feathers: "golden-bronze feathers with iridescent highlights",
  eyes: "piercing intelligent amber-gold eyes, wise and ancient",
  size: "large enough for a child to ride on its back",
  glow: "subtle magical golden aura, especially from wing tips",
} as const;

/**
 * Canonical Bedroom Design - Pages 1, 2, 3, 4, 19, 21
 */
export const CANONICAL_BEDROOM = {
  bed: "wooden bed with carved Saudi geometric patterns, cream bedding with gold embroidery, burgundy pillows",
  walls: "warm terracotta walls with geometric border pattern in gold and deep blue",
  window: "large arched window with mashrabiya-inspired lattice, deep blue night sky visible",
  decor: "brass lantern, potted palm, burgundy-gold woven rug, Arabic calligraphy art",
  lighting: "warm amber glow from lantern, soft moonlight through window",
  colors: "terracotta, cream, burgundy, gold, dark wood, deep blue night sky",
} as const;

/**
 * Canonical Child Outfits - Gender-specific
 * BEDROOM (pages 1-3, 21): Blue t-shirt (same for both)
 * OUTDOOR/FLYING (pages 4-19): Boy=thobe, Girl=traditional dress
 */
export const CANONICAL_OUTFIT = {
  bedroom: {
    garment: "casual blue half-sleeve t-shirt",
    description: "comfortable blue cotton t-shirt, round neckline, relaxed fit for bedtime",
  },

  thobe: {
    genderRestriction: "BOYS ONLY - Thobe is a MALE garment",
    garment: "traditional Saudi white thobe (full-length robe)",
    key: "Single-piece garment wrapping AROUND the body - NOT a cape. Has sleeves, collar, buttons at chest. In flight: ripples gently but stays ON body, never streams behind like cape.",
  },

  girlDress: {
    genderRestriction: "GIRLS ONLY - Boys wear thobe instead",
    garment: "traditional colorful flowing dress with long sleeves",
    key: "Full-length dress, flowing skirt, may have embroidery. In flight: flows gracefully, princess-like appearance. Colors: jewel tones (purple, turquoise, burgundy, emerald) with gold accents.",
  },
} as const;

/**
 * Get outfit prompt for a specific gender
 */
export function getOutfitPromptForGender(
  gender: "boy" | "girl",
  isFlying: boolean = true
): string {
  if (!isFlying) {
    return `OUTFIT: ${CANONICAL_OUTFIT.bedroom.garment}. ${CANONICAL_OUTFIT.bedroom.description}`;
  }

  if (gender === "girl") {
    return `OUTFIT (GIRL): ${CANONICAL_OUTFIT.girlDress.garment}. ${CANONICAL_OUTFIT.girlDress.key} CRITICAL: Girls do NOT wear thobe.`;
  }

  return `OUTFIT (BOY): ${CANONICAL_OUTFIT.thobe.garment}. ${CANONICAL_OUTFIT.thobe.key}`;
}

/**
 * Child face position hints
 */
export type ChildPose =
  | "profile-left"
  | "profile-right"
  | "three-quarter"
  | "front-facing"
  | "looking-up"
  | "looking-down"
  | "back-view"
  | "side-silhouette";

export interface StoryPageConfig {
  pageNumber: number;
  imageFile: string;
  arabicText: string;
  hasChild: boolean;
  description: string;
  childPose?: ChildPose;
  childPosition?: string;
  sceneContext?: string;
}

/**
 * All 22 story pages with their configuration
 */
export const STORY_PAGES: StoryPageConfig[] = [
  {
    pageNumber: 1,
    imageFile: "page-1.png",
    arabicText: "في ليلةٍ هادئة… كان فيصل يقف عند نافذته ينظر إلى السماء المليئة بالنجوم.",
    hasChild: true,
    description: "Boy at bedroom window looking at stars",
    childPose: "profile-left",
    childPosition: "center-right, standing at window",
    sceneContext: "BEDROOM SCENE. Blue t-shirt. Child at window gazing at starry night, moonlit atmosphere."
  },
  {
    pageNumber: 2,
    imageFile: "page-2.png",
    arabicText: "وفجأة… ظهر صقرٌ تلمع جناحاه كالذهب أمام نافذته!",
    hasChild: true,
    description: "Boy in bedroom seeing golden falcon at window",
    childPose: "three-quarter",
    childPosition: "center, looking toward window",
    sceneContext: "BEDROOM SCENE. Blue t-shirt. Golden falcon appears at window, child surprised and amazed."
  },
  {
    pageNumber: 3,
    imageFile: "page-3.png",
    arabicText: "قال الصقر بصوتٍ دافئ: \"أنا من صقور هذه الأرض… أحمل حكاية وطنك.\"",
    hasChild: true,
    description: "Boy talking to falcon at window",
    childPose: "profile-right",
    childPosition: "left side, facing the falcon",
    sceneContext: "BEDROOM SCENE. Blue t-shirt. Intimate conversation, child listening to falcon's wisdom."
  },
  {
    pageNumber: 4,
    imageFile: "page-4.png",
    arabicText: "أمسك فيصل بجناح الصقر، فانطلقا عاليًا في السماء.",
    hasChild: true,
    description: "Boy holding falcon's wing, taking off into night sky",
    childPose: "looking-up",
    childPosition: "center, ascending into sky",
    sceneContext: "TAKEOFF SCENE. Gender-specific outfit. Child flying out of bedroom with falcon into starry night."
  },
  {
    pageNumber: 5,
    imageFile: "page-5.png",
    arabicText: "رأى فيصل مكة من الأعلى… الكعبة تُضيء قلوب الناس بنور الإيمان.",
    hasChild: true,
    description: "Boy riding falcon over Makkah, Kaaba visible below",
    childPose: "looking-down",
    childPosition: "upper portion, riding on falcon",
    sceneContext: "FLYING OVER MAKKAH. Gender-specific outfit. Aerial view of Kaaba glowing below, spiritual awe."
  },
  {
    pageNumber: 6,
    imageFile: "page-6.png",
    arabicText: "قال الصقر: \"من هنا بدأ نور الإسلام… هنا يتعلم الناس الرحمة والصدق.\"",
    hasChild: true,
    description: "Boy on falcon near Kaaba, falcon speaking",
    childPose: "three-quarter",
    childPosition: "center, beside falcon",
    sceneContext: "HOVERING NEAR KAABA. Gender-specific outfit. Sacred atmosphere, falcon teaching about faith."
  },
  {
    pageNumber: 7,
    imageFile: "page-7.png",
    arabicText: "اتجها إلى المدينة المنوّرة… حيث عاش رسول الله ﷺ.",
    hasChild: true,
    description: "Boy on falcon at Prophet's Mosque in Madinah",
    childPose: "looking-down",
    childPosition: "upper area, flying over mosque",
    sceneContext: "FLYING OVER MADINAH. Gender-specific outfit. Prophet's Mosque with green dome below."
  },
  {
    pageNumber: 8,
    imageFile: "page-8.png",
    arabicText: "رأى فيصل حلقات العلم تحت النخيل، والأطفال يتعلّمون الكتابة والقراءة.",
    hasChild: true,
    description: "Boy watching children learning under palm trees",
    childPose: "looking-down",
    childPosition: "upper portion, observing from above",
    sceneContext: "FLYING OVER PALM GROVE. Gender-specific outfit. Children studying below, knowledge-sharing scene."
  },
  {
    pageNumber: 9,
    imageFile: "page-9.png",
    arabicText: "طار الصقر إلى نجد… حيث تمتد الصحراء والوديان.",
    hasChild: true,
    description: "Boy riding falcon over Najd desert canyons",
    childPose: "profile-right",
    childPosition: "center, riding falcon in flight",
    sceneContext: "FLYING OVER NAJD. Gender-specific outfit. Vast desert with canyons and wadis, sense of adventure."
  },
  {
    pageNumber: 10,
    imageFile: "page-10.png",
    arabicText: "قال الصقر: \"هذه الرياض… قلب الجزيرة العربية.\"",
    hasChild: true,
    description: "Boy on falcon viewing Riyadh skyline at twilight",
    childPose: "looking-down",
    childPosition: "upper area, overlooking city",
    sceneContext: "FLYING OVER RIYADH. Gender-specific outfit. Modern skyline at golden hour, Kingdom Tower visible."
  },
  {
    pageNumber: 11,
    imageFile: "page-11.png",
    arabicText: "شاهد فيصل الرياض وهي تتغيّر… من حصون طينية إلى أبراج وروائع حديثة.",
    hasChild: true,
    description: "Boy on falcon between old Masmak and modern Kingdom Tower",
    childPose: "three-quarter",
    childPosition: "center, floating between old and new",
    sceneContext: "RIYADH OLD & NEW. Gender-specific outfit. Masmak Fort on one side, Kingdom Tower on other."
  },
  {
    pageNumber: 12,
    imageFile: "page-12.png",
    arabicText: "واصل الصقر طريقه نحو الشمال… إلى العلا ومدائن صالح.",
    hasChild: true,
    description: "Boy with falcon at AlUla ancient tombs",
    childPose: "looking-up",
    childPosition: "lower portion, among rock formations",
    sceneContext: "ALULA GROUND SCENE. Gender-specific outfit. Nabataean tombs in sandstone, child looking up in wonder."
  },
  {
    pageNumber: 13,
    imageFile: "page-13.png",
    arabicText: "قال الصقر: \"هنا نحت الإنسان الجبال، وبنى مدنًا وحضارات لا تُنسى.\"",
    hasChild: true,
    description: "Boy riding falcon through Hegra monuments",
    childPose: "profile-left",
    childPosition: "center, flying past carved facades",
    sceneContext: "FLYING AT HEGRA. Gender-specific outfit. Carved rock tombs, sunset lighting, ancient wonder."
  },
  {
    pageNumber: 14,
    imageFile: "page-14.png",
    arabicText: "هبط الصقر جنوبًا… حيث بيوت عسير تقف على الجبال كأنها تحرس السماء.",
    hasChild: true,
    description: "Boy sitting with falcon on Asir mountain peak",
    childPose: "profile-right",
    childPosition: "right side, seated on mountain",
    sceneContext: "ASIR MOUNTAIN REST. Gender-specific outfit. Colorful Asiri houses on slopes, misty green peaks."
  },
  {
    pageNumber: 15,
    imageFile: "page-15.png",
    arabicText: "طار الصقر شرقًا… حتى رأى فيصل البحر والمصافي الكبيرة.",
    hasChild: true,
    description: "Boy on falcon over Eastern Province oil refineries",
    childPose: "looking-down",
    childPosition: "upper portion, flying over industrial landscape",
    sceneContext: "EASTERN PROVINCE. Gender-specific outfit. Gulf coastline, oil refineries with glowing lights."
  },
  {
    pageNumber: 16,
    imageFile: "page-16.png",
    arabicText: "قال الصقر: \"كل مدينة تقول لك… أنا قطعة من وطنك.\"",
    hasChild: true,
    description: "Boy with falcon, feathers floating, emotional moment",
    childPose: "front-facing",
    childPosition: "center, emotional close-up",
    sceneContext: "EMOTIONAL CLOSE-UP. Gender-specific outfit. Golden feathers floating, wonder and connection."
  },
  {
    pageNumber: 17,
    imageFile: "page-17.png",
    arabicText: "قال: \"يا فيصل… ما يجمع هذه البلاد هو همة السعوديين وقيمهم.\"",
    hasChild: true,
    description: "Boy on falcon viewing map of Saudi Arabia from above",
    childPose: "looking-down",
    childPosition: "upper area, above glowing map",
    sceneContext: "MAGICAL MAP. Gender-specific outfit. Glowing map of Saudi Arabia below, national pride moment."
  },
  {
    pageNumber: 18,
    imageFile: "page-18.png",
    arabicText: "قال الصقر: \"كل مدينة تقول لك… أنا قطعة من وطنك.\"",
    hasChild: true,
    description: "Boy with falcon, golden feathers floating",
    childPose: "three-quarter",
    childPosition: "center, surrounded by feathers",
    sceneContext: "MAGICAL FEATHERS. Gender-specific outfit. Swirling golden falcon feathers, enchantment."
  },
  {
    pageNumber: 19,
    imageFile: "page-19.png",
    arabicText: "عاد الصقر يخفّض جناحيه… يقترب من نافذة فيصل.",
    hasChild: true,
    description: "Falcon returning to boy at bedroom window",
    childPose: "profile-left",
    childPosition: "right side, at window",
    sceneContext: "RETURN TO BEDROOM. Gender-specific outfit. Dawn sky (pink, orange, gold), homecoming."
  },
  {
    pageNumber: 20,
    imageFile: "page-20.png",
    arabicText: "همس الصقر: \"الأمة تبنى من كلمات صغيرة، وقلوب كبيرة.\"",
    hasChild: false,
    description: "Close-up of falcon whispering farewell"
  },
  {
    pageNumber: 21,
    imageFile: "page-21.png",
    arabicText: "عاد فيصل إلى غرفته… لكن قلبه أصبح أوسع وأغنى بحكايات وطنه.",
    hasChild: true,
    description: "Boy in bedroom holding storybook",
    childPose: "front-facing",
    childPosition: "center, sitting on bed",
    sceneContext: "MORNING BEDROOM. Blue t-shirt. Child on bed with book, golden feather as memento, peaceful smile."
  },
  {
    pageNumber: 22,
    imageFile: "page-22.png",
    arabicText: "الخاتمة",
    hasChild: false,
    description: "The End - golden feather on open book"
  },
];

/**
 * Get page configuration by page number
 */
export function getPageConfig(pageNumber: number): StoryPageConfig | undefined {
  return STORY_PAGES.find(p => p.pageNumber === pageNumber);
}

/**
 * Get the image URL for a page
 */
export function getPageImageUrl(pageNumber: number, baseUrl: string = ""): string {
  const page = getPageConfig(pageNumber);
  if (!page) return "";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/lubab-images/pagesimages/${page.imageFile}`;
  }

  return `${baseUrl}/pagesimages/${page.imageFile}`;
}

/**
 * Get all pages that need face swap
 */
export function getPagesNeedingFaceSwap(): StoryPageConfig[] {
  return STORY_PAGES.filter(p => p.hasChild);
}

/**
 * Get all pages
 */
export function getAllPages(): StoryPageConfig[] {
  return STORY_PAGES;
}

export const TOTAL_PAGES = STORY_PAGES.length;

/**
 * Replace child name placeholder in Arabic text
 */
export function personalizeArabicText(arabicText: string, childName: string): string {
  if (!arabicText) return '';
  if (!childName || childName.trim() === '') return arabicText;

  const trimmedName = childName.trim();
  return arabicText.replace(/فيصل/g, trimmedName);
}

/**
 * Convert pose to description
 */
function getPoseDescription(pose: ChildPose): string {
  const poseDescriptions: Record<ChildPose, string> = {
    "profile-left": "face turned left, left profile visible",
    "profile-right": "face turned right, right profile visible",
    "three-quarter": "face at three-quarter angle",
    "front-facing": "face looking directly at viewer",
    "looking-up": "face tilted upward",
    "looking-down": "face tilted downward",
    "back-view": "back of head visible",
    "side-silhouette": "side silhouette",
  };
  return poseDescriptions[pose] || "neutral position";
}

/**
 * Build page-specific face swap prompt (CONDENSED VERSION)
 * ~50% shorter than original while keeping core identity preservation
 */
export function buildPageSpecificPrompt(pageNumber: number, gender: "boy" | "girl" = "boy"): string {
  const page = getPageConfig(pageNumber);
  if (!page || !page.hasChild) return "";

  const style = ILLUSTRATION_STYLE_DNA;
  const poseDesc = page.childPose ? getPoseDescription(page.childPose) : "natural position";
  const isFlyingScene = pageNumber >= 4 && pageNumber <= 19;
  const outfitPrompt = getOutfitPromptForGender(gender, isFlyingScene);

  return `TASK: Create personalized storybook illustration where child looks EXACTLY like reference photo.
This is a gift - the child MUST be immediately recognizable to their family.

SCENE: ${page.sceneContext || page.description}
POSITION: ${page.childPosition || "center"}
POSE: ${poseDesc}

${outfitPrompt}

ART STYLE: ${style.medium}, ${style.texture}, ${style.lighting}, ${style.colorPalette}

═══════════════════════════════════════════════════════════════════════════════
IDENTITY PRESERVATION - MANDATORY (COPY EXACTLY FROM REFERENCE PHOTO)
═══════════════════════════════════════════════════════════════════════════════

1. FACE SHAPE: Copy exact shape - round/oval/etc, cheek fullness, chin, jawline

2. SKIN TONE (HIGHEST PRIORITY):
   - Copy EXACT skin color, shade, undertone from reference
   - NEVER lighten or darken - this makes child unrecognizable
   - Must be consistent across face, neck, ears

3. HAIR (CRITICAL):
   - COLOR: Must match exactly (black=black, brown=brown, blonde=blonde)
   - STYLE: Same length, texture (straight/wavy/curly), part location
   - Must be consistent across entire story

4. EYES: Match exact color (brown/black/blue/green) and shape from reference

5. FEATURES: Preserve nose shape, mouth/lips, cheeks, chin, eyebrows

6. UNIQUE MARKS: Include dimples, freckles, birthmarks if visible

═══════════════════════════════════════════════════════════════════════════════

TECHNICAL: Render in ${style.medium} style. Seamless blend with scene lighting.
Preserve background, clothing, body posture, composition. No photorealistic elements.

OUTPUT: Beautiful storybook illustration where child looks EXACTLY like reference - same skin, hair, features - naturally integrated into scene.`;
}

/**
 * Get simplified prompt for basic face swap (fallback)
 */
export function getBasicFaceSwapContext(pageNumber: number): string {
  const page = getPageConfig(pageNumber);
  if (!page) return "";
  return `Scene: ${page.description}. Pose: ${page.childPose || "neutral"}. Position: ${page.childPosition || "center"}.`;
}
