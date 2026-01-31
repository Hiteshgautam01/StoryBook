/**
 * Story Page Mapping for Face Swap
 *
 * Maps existing story illustrations to their metadata.
 * The existing images in /public/pagesimages/ are the base illustrations.
 * For personalization, we swap the child's face with the uploaded photo.
 */

/**
 * Style DNA - Consistent art style definition for all illustrations
 * This ensures the AI maintains the same aesthetic across all face swaps
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
 * Child face position hints for each scene type
 */
export type ChildPose =
  | "profile-left"      // Face turned left
  | "profile-right"     // Face turned right
  | "three-quarter"     // Slightly angled
  | "front-facing"      // Looking at viewer
  | "looking-up"        // Tilted up (at sky/falcon)
  | "looking-down"      // Tilted down (at ground)
  | "back-view"         // Back of head visible
  | "side-silhouette";  // Side profile silhouette

export interface StoryPageConfig {
  pageNumber: number;
  imageFile: string;           // Filename in /public/pagesimages/
  arabicText: string;          // Arabic text for the page
  hasChild: boolean;           // Whether the page has a child (needs face swap)
  description: string;         // Brief description of the scene
  childPose?: ChildPose;       // Position of child's face in the scene
  childPosition?: string;      // Where child appears in frame (e.g., "center", "left side")
  sceneContext?: string;       // Additional scene details for better face integration
}

/**
 * All 22 story pages with their configuration
 *
 * Pages with hasChild: true will have face swap applied
 * Pages with hasChild: false will be used as-is
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
    sceneContext: "Child's bedroom with cozy bed, warm traditional Saudi decor, moonlit atmosphere, child gazing out window at starry night sky. CRITICAL: This is the canonical bedroom design - maintain consistent bed style, room layout, and decor elements across pages 1-4"
  },
  {
    pageNumber: 2,
    imageFile: "page-2.png",
    arabicText: "وفجأة… ظهر صقرٌ تلمع جناحاه كالذهب أمام نافذته!",
    hasChild: true,
    description: "Boy in bedroom seeing golden falcon at window",
    childPose: "three-quarter",
    childPosition: "center, looking toward window",
    sceneContext: "Same bedroom as page 1 - PRESERVE identical bed style, room layout, and decor. Child surprised and amazed, golden falcon visible at window, maintain consistent bedroom furniture and wall decorations"
  },
  {
    pageNumber: 3,
    imageFile: "page-3.png",
    arabicText: "قال الصقر بصوتٍ دافئ: \"أنا من صقور هذه الأرض… أحمل حكاية وطنك.\"",
    hasChild: true,
    description: "Boy talking to falcon at window",
    childPose: "profile-right",
    childPosition: "left side, facing the falcon",
    sceneContext: "CRITICAL: Same bedroom as pages 1-2 - maintain EXACT same bed design, headboard, bedding, pillows, room layout, wall decorations, and furniture placement. Intimate conversation scene, child listening intently to majestic falcon at window"
  },
  {
    pageNumber: 4,
    imageFile: "page-4.png",
    arabicText: "أمسك فيصل بجناح الصقر، فانطلقا عاليًا في السماء.",
    hasChild: true,
    description: "Boy holding falcon's wing, taking off into night sky",
    childPose: "looking-up",
    childPosition: "center, ascending into sky",
    sceneContext: "Same bedroom as pages 1-3 visible below - maintain consistent bed and room design. Magical flight scene, child holding falcon, lifting off from bedroom into starry night, bedroom becoming smaller below"
  },
  {
    pageNumber: 5,
    imageFile: "page-5.png",
    arabicText: "رأى فيصل مكة من الأعلى… الكعبة تُضيء قلوب الناس بنور الإيمان.",
    hasChild: true,
    description: "Boy riding falcon over Makkah, Kaaba visible below",
    childPose: "looking-down",
    childPosition: "upper portion, riding on falcon",
    sceneContext: "Aerial view of Makkah, Kaaba glowing below, child in awe looking down from falcon"
  },
  {
    pageNumber: 6,
    imageFile: "page-6.png",
    arabicText: "قال الصقر: \"من هنا بدأ نور الإسلام… هنا يتعلم الناس الرحمة والصدق.\"",
    hasChild: true,
    description: "Boy on falcon near Kaaba, falcon speaking",
    childPose: "three-quarter",
    childPosition: "center, beside falcon",
    sceneContext: "Hovering near Kaaba, sacred atmosphere, child listening to falcon's wisdom"
  },
  {
    pageNumber: 7,
    imageFile: "page-7.png",
    arabicText: "اتجها إلى المدينة المنوّرة… حيث عاش رسول الله ﷺ.",
    hasChild: true,
    description: "Boy on falcon at Prophet's Mosque in Madinah",
    childPose: "looking-down",
    childPosition: "upper area, flying over mosque",
    sceneContext: "Prophet's Mosque green dome visible, serene night, child gazing at holy site"
  },
  {
    pageNumber: 8,
    imageFile: "page-8.png",
    arabicText: "رأى فيصل حلقات العلم تحت النخيل، والأطفال يتعلّمون الكتابة والقراءة.",
    hasChild: true,
    description: "Boy watching children learning under palm trees",
    childPose: "looking-down",
    childPosition: "upper portion, observing from above",
    sceneContext: "Palm grove scene, traditional learning circles below, child observing from falcon"
  },
  {
    pageNumber: 9,
    imageFile: "page-9.png",
    arabicText: "طار الصقر إلى نجد… حيث تمتد الصحراء والوديان.",
    hasChild: true,
    description: "Boy riding falcon over Najd desert canyons",
    childPose: "profile-right",
    childPosition: "center, riding falcon in flight",
    sceneContext: "Vast desert landscape, dramatic canyons below, wind in child's hair"
  },
  {
    pageNumber: 10,
    imageFile: "page-10.png",
    arabicText: "قال الصقر: \"هذه الرياض… قلب الجزيرة العربية.\"",
    hasChild: true,
    description: "Boy on falcon viewing Riyadh skyline at twilight",
    childPose: "looking-down",
    childPosition: "upper area, overlooking city",
    sceneContext: "Modern Riyadh skyline at golden hour, child amazed by city lights"
  },
  {
    pageNumber: 11,
    imageFile: "page-11.png",
    arabicText: "شاهد فيصل الرياض وهي تتغيّر… من حصون طينية إلى أبراج وروائع حديثة.",
    hasChild: true,
    description: "Boy on falcon between old Masmak and modern Kingdom Tower",
    childPose: "three-quarter",
    childPosition: "center, floating between old and new",
    sceneContext: "Split scene showing historical Masmak Fort and modern Kingdom Tower"
  },
  {
    pageNumber: 12,
    imageFile: "page-12.png",
    arabicText: "واصل الصقر طريقه نحو الشمال… إلى العلا ومدائن صالح.",
    hasChild: true,
    description: "Boy with falcon at AlUla ancient tombs",
    childPose: "looking-up",
    childPosition: "lower portion, among rock formations",
    sceneContext: "Dramatic AlUla rock formations, ancient Nabataean tombs, mystical atmosphere"
  },
  {
    pageNumber: 13,
    imageFile: "page-13.png",
    arabicText: "قال الصقر: \"هنا نحت الإنسان الجبال، وبنى مدنًا وحضارات لا تُنسى.\"",
    hasChild: true,
    description: "Boy riding falcon through Hegra monuments",
    childPose: "profile-left",
    childPosition: "center, flying past carved facades",
    sceneContext: "Hegra carved rock tombs, dramatic lighting, child in wonder at ancient craftsmanship"
  },
  {
    pageNumber: 14,
    imageFile: "page-14.png",
    arabicText: "هبط الصقر جنوبًا… حيث بيوت عسير تقف على الجبال كأنها تحرس السماء.",
    hasChild: true,
    description: "Boy sitting with falcon on Asir mountain peak",
    childPose: "profile-right",
    childPosition: "right side, seated on mountain",
    sceneContext: "Asir mountain village, colorful traditional houses, misty peaks, child resting"
  },
  {
    pageNumber: 15,
    imageFile: "page-15.png",
    arabicText: "طار الصقر شرقًا… حتى رأى فيصل البحر والمصافي الكبيرة.",
    hasChild: true,
    description: "Boy on falcon over Eastern Province oil refineries",
    childPose: "looking-down",
    childPosition: "upper portion, flying over industrial landscape",
    sceneContext: "Persian Gulf coast, oil refineries glowing, modern industry meets sea"
  },
  {
    pageNumber: 16,
    imageFile: "page-16.png",
    arabicText: "قال الصقر: \"كل مدينة تقول لك… أنا قطعة من وطنك.\"",
    hasChild: true,
    description: "Boy with falcon, feathers floating, emotional moment",
    childPose: "front-facing",
    childPosition: "center, emotional close-up",
    sceneContext: "Intimate moment, golden feathers floating around, child's face shows wonder"
  },
  {
    pageNumber: 17,
    imageFile: "page-17.png",
    arabicText: "قال: \"يا فيصل… ما يجمع هذه البلاد هو همة السعوديين وقيمهم.\"",
    hasChild: true,
    description: "Boy on falcon viewing map of Saudi Arabia from above",
    childPose: "looking-down",
    childPosition: "upper area, above glowing map",
    sceneContext: "Magical map of Saudi Arabia glowing below, child seeing the whole nation"
  },
  {
    pageNumber: 18,
    imageFile: "page-18.png",
    arabicText: "قال الصقر: \"كل مدينة تقول لك… أنا قطعة من وطنك.\"",
    hasChild: true,
    description: "Boy with falcon, golden feathers floating",
    childPose: "three-quarter",
    childPosition: "center, surrounded by feathers",
    sceneContext: "Magical moment, golden feathers swirling, child reaching out to touch them"
  },
  {
    pageNumber: 19,
    imageFile: "page-19.png",
    arabicText: "عاد الصقر يخفّض جناحيه… يقترب من نافذة فيصل.",
    hasChild: true,
    description: "Falcon returning to boy at bedroom window",
    childPose: "profile-left",
    childPosition: "right side, at window",
    sceneContext: "Return to bedroom window, dawn breaking, child ready to land back home"
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
    sceneContext: "Cozy bedroom, morning light, child holding book, golden feather visible nearby"
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
 *
 * Returns Supabase storage URL for use with external APIs (FAL.ai)
 * Falls back to local URL if Supabase is not configured
 */
export function getPageImageUrl(pageNumber: number, baseUrl: string = ""): string {
  const page = getPageConfig(pageNumber);
  if (!page) return "";

  // Use Supabase storage URL (publicly accessible from FAL API)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/lubab-images/pagesimages/${page.imageFile}`;
  }

  // Fallback to local URL (won't work with external APIs)
  return `${baseUrl}/pagesimages/${page.imageFile}`;
}

/**
 * Get all pages that need face swap
 */
export function getPagesNeedingFaceSwap(): StoryPageConfig[] {
  return STORY_PAGES.filter(p => p.hasChild);
}

/**
 * Get all pages (for display)
 */
export function getAllPages(): StoryPageConfig[] {
  return STORY_PAGES;
}

/**
 * Total number of pages
 */
export const TOTAL_PAGES = STORY_PAGES.length;

/**
 * Replace child name placeholder in Arabic text
 * Replaces all occurrences of "فيصل" (Faisal) with the provided child name
 */
export function personalizeArabicText(arabicText: string, childName: string): string {
  // Validate inputs
  if (!arabicText) {
    console.warn('[personalizeArabicText] Empty arabicText provided');
    return '';
  }

  if (!childName || childName.trim() === '') {
    console.warn('[personalizeArabicText] Empty childName provided, using default');
    return arabicText; // Return original text if no name provided
  }

  const trimmedName = childName.trim();
  const originalText = arabicText;
  const personalizedText = arabicText.replace(/فيصل/g, trimmedName);

  // Log when replacement happens
  if (originalText !== personalizedText) {
    console.log(`[personalizeArabicText] Replaced "فيصل" with "${trimmedName}"`);
  }

  return personalizedText;
}

/**
 * Convert pose type to natural language description
 */
function getPoseDescription(pose: ChildPose): string {
  const poseDescriptions: Record<ChildPose, string> = {
    "profile-left": "face turned to the left showing left profile, one visible eye must be perfectly clear and accurately shaped",
    "profile-right": "face turned to the right showing right profile, one visible eye must be perfectly clear and accurately shaped",
    "three-quarter": "face at three-quarter angle, slightly turned",
    "front-facing": "face looking directly forward at the viewer",
    "looking-up": "face tilted upward, looking at the sky",
    "looking-down": "face tilted downward, looking below",
    "back-view": "back of head visible, facing away",
    "side-silhouette": "side silhouette profile",
  };
  return poseDescriptions[pose] || "neutral position";
}

/**
 * Build a page-specific face swap prompt with scene context
 * This creates a detailed prompt that helps the AI understand exactly what to do
 */
export function buildPageSpecificPrompt(pageNumber: number): string {
  const page = getPageConfig(pageNumber);

  if (!page || !page.hasChild) {
    return ""; // No prompt needed for pages without children
  }

  const style = ILLUSTRATION_STYLE_DNA;
  const poseDesc = page.childPose ? getPoseDescription(page.childPose) : "natural position";

  return `TASK: Seamlessly integrate the child's facial features from the reference photo into this children's book illustration.

SCENE CONTEXT:
- Scene: ${page.sceneContext || page.description}
- Child position: ${page.childPosition || "center of frame"}
- Child's head angle: ${poseDesc}

ART STYLE (MUST MATCH):
- Medium: ${style.medium}
- Texture: ${style.texture}
- Lighting: ${style.lighting}
- Colors: ${style.colorPalette}
- Quality: ${style.quality}

CRITICAL IDENTITY REQUIREMENTS - Make the child look EXACTLY like the reference photo:

1. SKIN TONE (HIGHEST PRIORITY - Most important for identity):
   - Copy the EXACT skin color from the child's reference photo
   - Match the precise shade, undertone (warm/cool/neutral), and complexion
   - If child has light skin, use light skin. If medium skin, use medium skin. If dark skin, use dark skin
   - DO NOT lighten or darken the skin - preserve the exact skin color as shown
   - Skin must be consistent with reference photo across face, neck, and any visible skin
   - Render in ${style.medium} style but maintain ACCURATE skin color

2. HAIR COLOR (HIGHEST PRIORITY - Must be IDENTICAL and CONSISTENT everywhere):
   - Copy the EXACT hair color from the child's reference photo
   - If child has BLACK hair, use BLACK hair. If BROWN hair, use BROWN hair. If BLONDE hair, use BLONDE hair
   - DO NOT change hair color under any circumstances - hair color must be IDENTICAL to reference
   - Hair color must be CONSISTENT across all pages of the story - same child, same hair color
   - Preserve exact hairstyle, hair length, hair part, and hair texture from reference
   - Hair must be consistent across all visible areas (top, sides, back)
   - Render in illustrated ${style.medium} style with soft painterly edges but maintain EXACT hair color

3. EYES (HIGH PRIORITY):
   - Preserve exact eye shape, size, color, and iris details from reference photo
   - Eyes must be clear, bright, perfectly shaped with accurate iris
   - Match eye color exactly from reference photo

4. FACIAL FEATURES: Use nose shape, mouth shape, face shape from reference photo
5. Render ALL features in ILLUSTRATED ${style.medium} style - NO photorealistic elements
6. Match the exact head angle and position: ${poseDesc}
7. Blend seamlessly with illustration's ${style.lighting}
8. PRESERVE completely: Arabic text, background, clothing, body posture, composition

QUALITY CHECKS (VERIFY ALL - CRITICAL FOR CONSISTENCY):
- SKIN TONE: Does the skin color EXACTLY match the reference photo? (HIGHEST PRIORITY)
  - Not lighter, not darker - exact same shade and undertone
  - Consistent across face, neck, and all visible skin
- HAIR COLOR: Does hair color EXACTLY match the reference photo? (HIGHEST PRIORITY)
  - Black hair must stay black, brown must stay brown, blonde must stay blonde
  - Hair color must be IDENTICAL to reference - no color changes allowed
  - Hair color must be CONSISTENT across all pages - same child = same hair color everywhere
- HAIR STYLE: Does hairstyle match reference? Same length, same part, same texture
- EYES: Are eyes perfectly shaped, clear, with correct color from reference?
- Face blends naturally without visible seams or mixed styles
- Child looks like the SAME child as in the reference photo

OUTPUT: A seamless illustration where the child's face is naturally integrated, with IDENTICAL skin tone and IDENTICAL hair color as the reference photo, maintaining CONSISTENCY across all story pages.`;
}

/**
 * Get a simplified prompt for basic face swap (fallback)
 */
export function getBasicFaceSwapContext(pageNumber: number): string {
  const page = getPageConfig(pageNumber);
  if (!page) return "";

  return `Scene: ${page.description}. Child pose: ${page.childPose || "neutral"}. Position: ${page.childPosition || "center"}.`;
}
