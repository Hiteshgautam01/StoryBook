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
 * Canonical Falcon Design - MUST be consistent across all scenes with the falcon
 * The falcon appears in pages 2-19 and must have CORRECT anatomy
 */
export const CANONICAL_FALCON = {
  anatomy: "CRITICAL ANATOMY - REAL FALCON: The falcon MUST have exactly TWO wings (one on each side of its body), like a real bird. Never three wings, never one wing. Two symmetrical wings attached at the shoulders.",
  appearance: "majestic golden falcon with wings that shimmer like burnished gold, powerful broad wingspan, sleek aerodynamic body",
  feathers: "golden-bronze feathers with iridescent highlights, each feather detailed and layered naturally",
  eyes: "piercing intelligent amber-gold eyes, wise and ancient",
  size: "large majestic falcon, large enough for a child to ride on its back",
  motion: "wings beat powerfully and gracefully, feathers ripple in the wind, tail feathers fan for steering",
  glow: "subtle magical golden aura emanates from the falcon, especially from wing tips",
  personality: "noble, wise, protective guide - the spirit of Saudi heritage",
} as const;

/**
 * Canonical Bedroom Design - MUST be consistent across all bedroom scenes
 * Pages 1, 2, 3, 4, 19, 21 all feature the same bedroom
 */
export const CANONICAL_BEDROOM = {
  bed: "wooden bed frame with carved traditional Saudi geometric patterns, plush cream-colored bedding with subtle gold embroidery, multiple soft pillows in cream and deep burgundy",
  walls: "warm terracotta/sand colored walls with subtle texture, traditional Saudi geometric border pattern near ceiling in gold and deep blue",
  window: "large arched window with dark wooden frame, traditional mashrabiya-inspired lattice details, deep blue night sky visible through glass",
  decor: "traditional brass lantern on wooden bedside table, small potted palm plant, woven rug in burgundy and gold tones on wooden floor, framed Arabic calligraphy art on wall",
  lighting: "warm amber glow from lantern, soft moonlight streaming through window creating gentle shadows",
  atmosphere: "cozy, warm, magical, traditional Saudi Arabian children's room with blend of heritage and comfort",
  colors: "warm palette: terracotta walls, cream bedding, burgundy accents, gold details, dark wood furniture, deep blue night sky",
} as const;

/**
 * Canonical Child Outfits
 * The child wears DIFFERENT outfits depending on location AND GENDER:
 * - BEDROOM (pages 1-3, 21): Blue half-sleeve t-shirt (same for boy/girl)
 * - OUTDOOR/FLYING (pages 4-19):
 *   - BOY: Traditional Saudi white thobe
 *   - GIRL: Traditional colorful dress (NOT thobe - girls do NOT wear thobe)
 *
 * ⚠️ CRITICAL GENDER RULE - MUST FOLLOW NO MATTER WHAT:
 * Thobe is a MALE-ONLY garment in Saudi culture.
 * If the child is a GIRL, she must NEVER wear a thobe.
 * Girls wear traditional dresses or abayas instead.
 */
export const CANONICAL_OUTFIT = {
  // BEDROOM OUTFIT - Blue t-shirt for indoor/bedroom scenes (same for boy/girl)
  bedroom: {
    garment: "casual blue half-sleeve t-shirt",
    description: "comfortable blue cotton t-shirt with short sleeves reaching mid-upper-arm, " +
      "round neckline, solid blue color (medium to light blue), " +
      "relaxed fit appropriate for bedtime/casual wear",
    fit: "comfortable relaxed fit, not too tight or loose",
    colors: "solid blue color (sky blue or medium blue tone)",
  },

  // THOBE - For outdoor flying adventure scenes - ⚠️ BOYS ONLY
  thobe: {
    genderRestriction: "⚠️ MANDATORY: BOYS ONLY - Thobe is a MALE garment. Girls do NOT wear thobe under ANY circumstances.",
    garment: "traditional Saudi white thobe (full-length ankle-length robe) - FOR BOYS ONLY",
    structure: "CRITICAL: The thobe is a SINGLE-PIECE GARMENT worn like a long shirt/dress - NOT a cape or cloak. It has: " +
      "straight vertical cut from shoulders to ankles, " +
      "proper sleeves (not armholes), " +
      "collar at neckline (small standing collar or round neck), " +
      "buttons or closures down the front chest area, " +
      "the garment wraps AROUND the body, not behind like a cape",
    fit: "loose-fitting but structured garment that maintains its shape, " +
      "hangs straight down from shoulders, " +
      "the fabric falls vertically along the body's contours",
    fabric: "white cotton fabric with subtle texture, " +
      "clean crisp appearance, " +
      "fabric has natural draping weight (not flowy like silk or stiff like cardboard)",
    inMotion: "WHEN FLYING OR IN MOTION: " +
      "the thobe ripples and flows gently with the wind but KEEPS ITS SHAPE as a garment worn around the body, " +
      "the bottom hem may flutter and lift slightly revealing ankles, " +
      "sleeves may billow slightly with wind, " +
      "NEVER flies straight back like a cape or superhero cloak, " +
      "NEVER separates from the body like wings or cape, " +
      "the child is WEARING the thobe (it wraps their body), not having it attached at shoulders only",
    notACape: "CRITICAL DISTINCTION - A thobe is NOT a cape because: " +
      "1. Cape attaches only at neck/shoulders and hangs behind the body - thobe wraps AROUND the entire body front and back " +
      "2. Cape is open at front showing clothes underneath - thobe IS the main garment covering the torso " +
      "3. Cape flares dramatically when flying - thobe maintains its wrapped-around-body structure " +
      "4. Cape has no sleeves - thobe has full sleeves " +
      "5. The child's chest, stomach, and back are INSIDE the thobe, not with thobe behind them",
    colors: "pure white or cream white, may have subtle gold embroidery at collar or cuffs",
  },

  // GIRL'S DRESS - For outdoor flying adventure scenes - ⚠️ GIRLS ONLY
  girlDress: {
    genderRestriction: "⚠️ MANDATORY: GIRLS ONLY - This outfit is for female children. Boys wear thobe instead.",
    garment: "traditional colorful flowing dress with long sleeves",
    description: "beautiful traditional-style dress suitable for a young girl, " +
      "full-length reaching to ankles, " +
      "long sleeves for modesty, " +
      "flowing skirt portion that moves gracefully, " +
      "fitted or slightly loose bodice, " +
      "may have decorative embroidery or patterns",
    fit: "comfortable fit at top, flowing and loose below waist, " +
      "allows freedom of movement for flying adventure",
    fabric: "soft flowing fabric that moves beautifully in the wind, " +
      "has gentle draping quality",
    inMotion: "WHEN FLYING OR IN MOTION: " +
      "the dress flows and ripples gracefully with the wind, " +
      "the skirt may flutter and billow gently, " +
      "sleeves may catch the wind slightly, " +
      "creates a magical, princess-like appearance while flying, " +
      "the dress wraps AROUND the body, not behind like a cape",
    colors: "rich jewel tones - deep purple, turquoise, burgundy, or emerald green, " +
      "may have gold embroidery or decorative patterns, " +
      "colors complement the warm desert and night sky scenes",
  },

  // Helper text for prompts - gender-conditional outfit instructions
  flyingOutfitPrompt: {
    boy: "OUTFIT (BOY - THOBE): Child wears traditional Saudi white thobe. " +
      "The thobe is a single-piece garment wrapping AROUND the body (not a cape). " +
      "In flight, it may ripple gently but stays ON the body, never streaming behind like a cape.",
    girl: "OUTFIT (GIRL - TRADITIONAL DRESS): Child wears a beautiful traditional flowing dress with long sleeves. " +
      "⚠️ CRITICAL: Girls do NOT wear thobe - thobe is a male-only garment. " +
      "The dress flows gracefully in the wind, creating a magical princess-like appearance. " +
      "Rich jewel-tone colors (purple, turquoise, burgundy) with possible gold embroidery.",
    genderNote: "⚠️ GENDER OUTFIT RULE (MUST FOLLOW): " +
      "If child is BOY → wears white thobe (traditional male garment). " +
      "If child is GIRL → wears colorful traditional dress (NOT thobe - thobe is male-only). " +
      "This is a cultural accuracy requirement that must be followed no matter what.",
  },
} as const;

/**
 * Get the outfit prompt for a specific gender
 * This is used at runtime to inject the correct outfit instructions
 *
 * @param gender - "boy" or "girl"
 * @param isFlying - whether this is a flying/outdoor scene (pages 4-19)
 * @returns The outfit instruction string for the prompt
 */
export function getOutfitPromptForGender(
  gender: "boy" | "girl",
  isFlying: boolean = true
): string {
  if (!isFlying) {
    // Bedroom scenes - same outfit for both
    return `OUTFIT: ${CANONICAL_OUTFIT.bedroom.garment}. ${CANONICAL_OUTFIT.bedroom.description}`;
  }

  // Flying/outdoor scenes - gender-specific
  if (gender === "girl") {
    return `OUTFIT (GIRL - TRADITIONAL DRESS):
Child wears a beautiful traditional flowing dress with long sleeves.
⚠️ CRITICAL: Girls do NOT wear thobe - thobe is a MALE-ONLY garment.
${CANONICAL_OUTFIT.girlDress.description}.
${CANONICAL_OUTFIT.girlDress.inMotion}.
Colors: ${CANONICAL_OUTFIT.girlDress.colors}.
The dress flows gracefully in the wind, creating a magical princess-like appearance.`;
  }

  // Boy - thobe
  return `OUTFIT (BOY - THOBE):
Child wears ${CANONICAL_OUTFIT.thobe.garment}.
${CANONICAL_OUTFIT.thobe.structure}.
${CANONICAL_OUTFIT.thobe.notACape}.
${CANONICAL_OUTFIT.thobe.inMotion}.
Colors: ${CANONICAL_OUTFIT.thobe.colors}.`;
}

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
    sceneContext: `CANONICAL BEDROOM SCENE - This establishes the bedroom design used in pages 1-4, 19, 21.

    OUTFIT (BEDROOM): ${CANONICAL_OUTFIT.bedroom.garment}.
    ${CANONICAL_OUTFIT.bedroom.description}.
    Child wearing casual blue t-shirt for bedtime.

    BED: ${CANONICAL_BEDROOM.bed}.
    WALLS: ${CANONICAL_BEDROOM.walls}.
    WINDOW: ${CANONICAL_BEDROOM.window}.
    DECOR: ${CANONICAL_BEDROOM.decor}.
    LIGHTING: ${CANONICAL_BEDROOM.lighting}.
    COLORS: ${CANONICAL_BEDROOM.colors}.
    Child stands at window gazing at starry night sky, moonlit atmosphere, magical anticipation.`
  },
  {
    pageNumber: 2,
    imageFile: "page-2.png",
    arabicText: "وفجأة… ظهر صقرٌ تلمع جناحاه كالذهب أمام نافذته!",
    hasChild: true,
    description: "Boy in bedroom seeing golden falcon at window",
    childPose: "three-quarter",
    childPosition: "center, looking toward window",
    sceneContext: `SAME BEDROOM as page 1 - MUST maintain IDENTICAL design.

    OUTFIT (BEDROOM): ${CANONICAL_OUTFIT.bedroom.garment}.
    ${CANONICAL_OUTFIT.bedroom.description}.
    Child wearing casual blue t-shirt for bedtime.

    BED: ${CANONICAL_BEDROOM.bed}.
    WALLS: ${CANONICAL_BEDROOM.walls}.
    WINDOW: ${CANONICAL_BEDROOM.window} - golden falcon with glowing wings appears outside.
    DECOR: ${CANONICAL_BEDROOM.decor}.
    LIGHTING: ${CANONICAL_BEDROOM.lighting} with added golden glow from falcon.
    COLORS: ${CANONICAL_BEDROOM.colors}.
    Child surprised and amazed, turned toward window, wonder on face.`
  },
  {
    pageNumber: 3,
    imageFile: "page-3.png",
    arabicText: "قال الصقر بصوتٍ دافئ: \"أنا من صقور هذه الأرض… أحمل حكاية وطنك.\"",
    hasChild: true,
    description: "Boy talking to falcon at window",
    childPose: "profile-right",
    childPosition: "left side, facing the falcon",
    sceneContext: `SAME BEDROOM as pages 1-2 - MUST maintain IDENTICAL design.

    OUTFIT (BEDROOM): ${CANONICAL_OUTFIT.bedroom.garment}.
    ${CANONICAL_OUTFIT.bedroom.description}.
    Child wearing casual blue t-shirt for bedtime.

    BED: ${CANONICAL_BEDROOM.bed}.
    WALLS: ${CANONICAL_BEDROOM.walls}.
    WINDOW: ${CANONICAL_BEDROOM.window} - majestic falcon perched on windowsill.
    DECOR: ${CANONICAL_BEDROOM.decor}.
    LIGHTING: ${CANONICAL_BEDROOM.lighting} with golden aura around falcon.
    COLORS: ${CANONICAL_BEDROOM.colors}.
    Intimate conversation scene, child listening intently to falcon's wisdom, sense of magic and destiny.`
  },
  {
    pageNumber: 4,
    imageFile: "page-4.png",
    arabicText: "أمسك فيصل بجناح الصقر، فانطلقا عاليًا في السماء.",
    hasChild: true,
    description: "Boy holding falcon's wing, taking off into night sky",
    childPose: "looking-up",
    childPosition: "center, ascending into sky",
    sceneContext: `TAKEOFF SCENE - Child flying out of bedroom with falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}

    THOBE DETAILS (IF BOY): ${CANONICAL_OUTFIT.thobe.structure}.
    ${CANONICAL_OUTFIT.thobe.notACape}.
    TAKING FLIGHT: Outfit may flutter at the bottom hem but MUST stay wrapped around the body. The wind lifts the hem slightly but the garment does NOT fly behind like a cape or superhero cloak. The child's body remains INSIDE the outfit.

    BEDROOM BELOW: SAME BEDROOM as pages 1-3 visible below as they take flight.
    BED: ${CANONICAL_BEDROOM.bed} - visible below getting smaller.
    WALLS: ${CANONICAL_BEDROOM.walls} - partial view as room recedes.
    WINDOW: ${CANONICAL_BEDROOM.window} - they're flying out through it.
    DECOR: ${CANONICAL_BEDROOM.decor} - glimpsed below.
    LIGHTING: Transition from ${CANONICAL_BEDROOM.lighting} to starry night sky.
    COLORS: ${CANONICAL_BEDROOM.colors} blending into deep blue night.
    Magical flight scene, child holding falcon's wing, ascending into starry night, bedroom becoming smaller below.`
  },
  {
    pageNumber: 5,
    imageFile: "page-5.png",
    arabicText: "رأى فيصل مكة من الأعلى… الكعبة تُضيء قلوب الناس بنور الإيمان.",
    hasChild: true,
    description: "Boy riding falcon over Makkah, Kaaba visible below",
    childPose: "looking-down",
    childPosition: "upper portion, riding on falcon",
    sceneContext: `FLYING SCENE OVER MAKKAH - Child riding falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    IN-FLIGHT: Outfit wraps AROUND the child's body - NOT streaming behind like a cape.

    SCENE: Majestic aerial view of Makkah at night, the Kaaba glowing with divine light below, thousands of worshippers circling, child looking down in spiritual awe from falcon's back.`
  },
  {
    pageNumber: 6,
    imageFile: "page-6.png",
    arabicText: "قال الصقر: \"من هنا بدأ نور الإسلام… هنا يتعلم الناس الرحمة والصدق.\"",
    hasChild: true,
    description: "Boy on falcon near Kaaba, falcon speaking",
    childPose: "three-quarter",
    childPosition: "center, beside falcon",
    sceneContext: `HOVERING SCENE NEAR KAABA - Child on falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    WHILE HOVERING: Outfit hangs naturally as they hover in place, gentle wind causes light rippling but garment stays wrapped around body.

    SCENE: Sacred atmosphere near the Kaaba, divine golden light, child listening intently to falcon's wisdom about faith and truth, reverent moment.`
  },
  {
    pageNumber: 7,
    imageFile: "page-7.png",
    arabicText: "اتجها إلى المدينة المنوّرة… حيث عاش رسول الله ﷺ.",
    hasChild: true,
    description: "Boy on falcon at Prophet's Mosque in Madinah",
    childPose: "looking-down",
    childPosition: "upper area, flying over mosque",
    sceneContext: `FLYING SCENE OVER MADINAH - Child riding falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    IN-FLIGHT: Outfit wraps AROUND the child's body - NOT streaming behind like a cape.

    SCENE: Prophet's Mosque with iconic green dome glowing serenely below, peaceful night in Madinah, child gazing down at this holy place with deep reverence.`
  },
  {
    pageNumber: 8,
    imageFile: "page-8.png",
    arabicText: "رأى فيصل حلقات العلم تحت النخيل، والأطفال يتعلّمون الكتابة والقراءة.",
    hasChild: true,
    description: "Boy watching children learning under palm trees",
    childPose: "looking-down",
    childPosition: "upper portion, observing from above",
    sceneContext: `FLYING SCENE OVER PALM GROVE - Child riding falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    IN-FLIGHT: Outfit wraps AROUND the child's body - NOT streaming behind like a cape.

    SCENE: Lush palm grove below with traditional learning circles, children studying under trees, warm dappled sunlight, child observing the scene of knowledge-sharing from above.`
  },
  {
    pageNumber: 9,
    imageFile: "page-9.png",
    arabicText: "طار الصقر إلى نجد… حيث تمتد الصحراء والوديان.",
    hasChild: true,
    description: "Boy riding falcon over Najd desert canyons",
    childPose: "profile-right",
    childPosition: "center, riding falcon in flight",
    sceneContext: `FLYING SCENE OVER NAJD DESERT - Child riding falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    IN-FLIGHT: Outfit wraps AROUND the child's body - desert wind causes gentle rippling but garment stays ON the body, NOT streaming behind like a cape.

    SCENE: Vast Najd desert landscape with dramatic canyons and wadis below, golden sand dunes, wind in child's hair, sense of adventure and freedom.`
  },
  {
    pageNumber: 10,
    imageFile: "page-10.png",
    arabicText: "قال الصقر: \"هذه الرياض… قلب الجزيرة العربية.\"",
    hasChild: true,
    description: "Boy on falcon viewing Riyadh skyline at twilight",
    childPose: "looking-down",
    childPosition: "upper area, overlooking city",
    sceneContext: `FLYING SCENE OVER RIYADH - Child riding falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    IN-FLIGHT: Outfit wraps AROUND the child's body - NOT streaming behind like a cape.

    SCENE: Modern Riyadh skyline at golden hour/twilight, city lights beginning to glow, Kingdom Tower and other landmarks visible, child amazed at the heart of Arabia.`
  },
  {
    pageNumber: 11,
    imageFile: "page-11.png",
    arabicText: "شاهد فيصل الرياض وهي تتغيّر… من حصون طينية إلى أبراج وروائع حديثة.",
    hasChild: true,
    description: "Boy on falcon between old Masmak and modern Kingdom Tower",
    childPose: "three-quarter",
    childPosition: "center, floating between old and new",
    sceneContext: `HOVERING SCENE - RIYADH OLD AND NEW - Child on falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    WHILE HOVERING: Outfit hangs naturally, gentle wind causes light rippling but garment stays wrapped around body - NOT like a cape.

    SCENE: Split scene showing contrast of historical Masmak Fort (mud-brick, traditional) on one side and modern Kingdom Tower on the other, child floating between past and future of Riyadh.`
  },
  {
    pageNumber: 12,
    imageFile: "page-12.png",
    arabicText: "واصل الصقر طريقه نحو الشمال… إلى العلا ومدائن صالح.",
    hasChild: true,
    description: "Boy with falcon at AlUla ancient tombs",
    childPose: "looking-up",
    childPosition: "lower portion, among rock formations",
    sceneContext: `LANDING/GROUND SCENE AT ALULA - Child with falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    ON GROUND: Outfit hangs naturally straight down, proper garment draping.

    SCENE: Dramatic AlUla rock formations towering above, ancient Nabataean tombs carved into sandstone, mystical golden-hour lighting, child looking up in wonder at the monumental ancient architecture.`
  },
  {
    pageNumber: 13,
    imageFile: "page-13.png",
    arabicText: "قال الصقر: \"هنا نحت الإنسان الجبال، وبنى مدنًا وحضارات لا تُنسى.\"",
    hasChild: true,
    description: "Boy riding falcon through Hegra monuments",
    childPose: "profile-left",
    childPosition: "center, flying past carved facades",
    sceneContext: `FLYING SCENE AT HEGRA - Child riding falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}

    IN-FLIGHT APPEARANCE: Outfit wraps AROUND the child's body (front, sides, back) - the wind may cause gentle rippling but the garment stays ON the body, not streaming behind like a cape.
    The child is WEARING the outfit, with their body INSIDE it.

    SCENE: Hegra/Madain Saleh carved rock tombs with dramatic Nabataean facades, warm sunset lighting casting long shadows on ancient stonework, child riding falcon past monumental carved entrances, sense of ancient wonder and historical magnificence.`
  },
  {
    pageNumber: 14,
    imageFile: "page-14.png",
    arabicText: "هبط الصقر جنوبًا… حيث بيوت عسير تقف على الجبال كأنها تحرس السماء.",
    hasChild: true,
    description: "Boy sitting with falcon on Asir mountain peak",
    childPose: "profile-right",
    childPosition: "right side, seated on mountain",
    sceneContext: `RESTING SCENE ON ASIR MOUNTAIN - Child seated with falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    WHILE SEATED: Outfit drapes naturally around seated body, fabric pools slightly around legs, garment wraps the body properly.

    SCENE: Asir mountain peak with colorful traditional Asiri houses visible on slopes, misty green peaks in background, cool mountain air, child resting peacefully with falcon after flight.`
  },
  {
    pageNumber: 15,
    imageFile: "page-15.png",
    arabicText: "طار الصقر شرقًا… حتى رأى فيصل البحر والمصافي الكبيرة.",
    hasChild: true,
    description: "Boy on falcon over Eastern Province oil refineries",
    childPose: "looking-down",
    childPosition: "upper portion, flying over industrial landscape",
    sceneContext: `FLYING SCENE OVER EASTERN PROVINCE - Child riding falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    IN-FLIGHT: Outfit wraps AROUND the child's body - NOT streaming behind like a cape.

    SCENE: Persian Gulf coastline below, massive oil refineries with glowing lights, modern industry where sea meets desert, child observing Saudi's industrial might from above.`
  },
  {
    pageNumber: 16,
    imageFile: "page-16.png",
    arabicText: "قال الصقر: \"كل مدينة تقول لك… أنا قطعة من وطنك.\"",
    hasChild: true,
    description: "Boy with falcon, feathers floating, emotional moment",
    childPose: "front-facing",
    childPosition: "center, emotional close-up",
    sceneContext: `EMOTIONAL CLOSE-UP SCENE - Child with falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    CLOSE-UP: Upper portion of outfit visible, garment worn correctly around body.

    SCENE: Intimate emotional moment, golden falcon feathers floating magically around, child's face showing deep wonder and connection to homeland, soft golden lighting.`
  },
  {
    pageNumber: 17,
    imageFile: "page-17.png",
    arabicText: "قال: \"يا فيصل… ما يجمع هذه البلاد هو همة السعوديين وقيمهم.\"",
    hasChild: true,
    description: "Boy on falcon viewing map of Saudi Arabia from above",
    childPose: "looking-down",
    childPosition: "upper area, above glowing map",
    sceneContext: `FLYING SCENE OVER MAGICAL MAP - Child riding falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    IN-FLIGHT: Outfit wraps AROUND the child's body - NOT streaming behind like a cape.

    SCENE: Magical glowing map of Saudi Arabia spread below like a treasure map, each region lighting up, child seeing the whole nation unified, profound moment of national pride and belonging.`
  },
  {
    pageNumber: 18,
    imageFile: "page-18.png",
    arabicText: "قال الصقر: \"كل مدينة تقول لك… أنا قطعة من وطنك.\"",
    hasChild: true,
    description: "Boy with falcon, golden feathers floating",
    childPose: "three-quarter",
    childPosition: "center, surrounded by feathers",
    sceneContext: `MAGICAL FEATHER SCENE - Child with falcon.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    WHILE FLOATING: Outfit drapes naturally around body, gentle magical wind causes soft rippling but garment stays wrapped around body - NOT like a cape.

    SCENE: Magical moment surrounded by swirling golden falcon feathers, child reaching out to touch them with wonder, soft magical lighting, sense of enchantment and connection.`
  },
  {
    pageNumber: 19,
    imageFile: "page-19.png",
    arabicText: "عاد الصقر يخفّض جناحيه… يقترب من نافذة فيصل.",
    hasChild: true,
    description: "Falcon returning to boy at bedroom window",
    childPose: "profile-left",
    childPosition: "right side, at window",
    sceneContext: `RETURN SCENE - Child returning to bedroom at dawn, still wearing adventure outfit.

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}
    LANDING/DESCENDING: As child descends to land, outfit may flutter gently but stays wrapped around body - NOT streaming behind like a cape.

    SAME BEDROOM as pages 1-4 - MUST maintain IDENTICAL design, now at dawn.
    BED: ${CANONICAL_BEDROOM.bed}.
    WALLS: ${CANONICAL_BEDROOM.walls}.
    WINDOW: ${CANONICAL_BEDROOM.window} - now with dawn sky colors (soft pink, orange, gold) instead of night blue.
    DECOR: ${CANONICAL_BEDROOM.decor}.
    LIGHTING: Dawn light streaming through window, warm pink and gold replacing moonlight, lantern still visible but dimmer.
    COLORS: ${CANONICAL_BEDROOM.colors} with dawn sky tones (soft pink, peach, golden) visible through window.
    Child approaching window from outside with falcon, about to land back in familiar bedroom, sense of homecoming.`
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
    sceneContext: `MORNING SCENE - Child back in bedroom after adventure.

    OUTFIT (BEDROOM): ${CANONICAL_OUTFIT.bedroom.garment}.
    ${CANONICAL_OUTFIT.bedroom.description}.
    Child back in casual blue t-shirt after the magical adventure.

    SAME BEDROOM as pages 1-4, 19 - MUST maintain IDENTICAL design, now in morning light.
    BED: ${CANONICAL_BEDROOM.bed} - child sitting on bed holding book.
    WALLS: ${CANONICAL_BEDROOM.walls}.
    WINDOW: ${CANONICAL_BEDROOM.window} - now with bright morning sky, soft golden sunlight streaming in.
    DECOR: ${CANONICAL_BEDROOM.decor} - PLUS a single golden falcon feather resting on bedside table as magical memento.
    LIGHTING: Warm morning sunlight replacing moonlight, room feels bright and hopeful, lantern unlit.
    COLORS: ${CANONICAL_BEDROOM.colors} with warm morning golden tones, brighter overall atmosphere.
    Child sits contentedly on bed, holding storybook, peaceful smile, transformed by the magical journey. Golden feather visible as proof of adventure.`
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
    console.warn('[personalizeArabicText] childName value:', JSON.stringify(childName), 'type:', typeof childName);
    return arabicText; // Return original text if no name provided
  }

  const trimmedName = childName.trim();
  const originalText = arabicText;
  const hasFaisal = arabicText.includes('فيصل');
  const personalizedText = arabicText.replace(/فيصل/g, trimmedName);

  // Always log personalization attempt
  console.log(`[personalizeArabicText] Input name: "${trimmedName}" (${trimmedName.length} chars)`);
  console.log(`[personalizeArabicText] Has "فيصل": ${hasFaisal}`);
  console.log(`[personalizeArabicText] Result: "${personalizedText.substring(0, 80)}..."`);

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
 * Enhanced for maximum identity preservation - the child MUST look exactly like their photo
 *
 * @param pageNumber - The page number to build prompt for
 * @param gender - Optional gender for outfit selection (defaults to "boy")
 */
export function buildPageSpecificPrompt(pageNumber: number, gender: "boy" | "girl" = "boy"): string {
  const page = getPageConfig(pageNumber);

  if (!page || !page.hasChild) {
    return ""; // No prompt needed for pages without children
  }

  const style = ILLUSTRATION_STYLE_DNA;
  const poseDesc = page.childPose ? getPoseDescription(page.childPose) : "natural position";

  // Determine if this is a flying/outdoor scene (pages 4-19) or bedroom scene
  const isFlyingScene = pageNumber >= 4 && pageNumber <= 19;
  const outfitPrompt = getOutfitPromptForGender(gender, isFlyingScene);

  return `CRITICAL TASK: Create a personalized storybook illustration where the child looks EXACTLY like the reference photo.
This is a gift for a family - the child MUST be immediately recognizable as THEIR child.

SCENE CONTEXT:
- Scene: ${page.sceneContext || page.description}
- Child position: ${page.childPosition || "center of frame"}
- Child's head angle: ${poseDesc}

OUTFIT REQUIREMENT (GENDER-SPECIFIC - MUST FOLLOW):
${outfitPrompt}

ART STYLE (MUST MATCH):
- Medium: ${style.medium}
- Texture: ${style.texture}
- Lighting: ${style.lighting}
- Colors: ${style.colorPalette}
- Quality: ${style.quality}

═══════════════════════════════════════════════════════════════════════════════
IDENTITY PRESERVATION - MANDATORY REQUIREMENTS (DO NOT DEVIATE FROM REFERENCE)
═══════════════════════════════════════════════════════════════════════════════

1. FACE SHAPE (ESSENTIAL FOR RECOGNITION):
   - Copy the EXACT face shape from the reference photo
   - Round face must stay round, oval must stay oval, etc.
   - Preserve cheek fullness, chin shape, jawline exactly as shown
   - The silhouette of the face must match the reference

2. SKIN TONE (HIGHEST PRIORITY - CORE IDENTITY):
   - The child's skin color is a fundamental part of their identity
   - Copy the EXACT skin color, shade, and undertone from reference photo
   - Fair/light skin → use fair/light skin
   - Medium/olive skin → use medium/olive skin
   - Brown/dark skin → use brown/dark skin
   - NEVER lighten or darken the skin under any circumstances
   - Skin tone must be consistent across face, neck, ears, and any visible skin
   - This is NON-NEGOTIABLE - incorrect skin tone makes the child unrecognizable

3. HAIR (CRITICAL FOR RECOGNITION - MUST BE IDENTICAL):
   - HAIR COLOR: Must match reference EXACTLY
     * Black hair → BLACK (not brown, not gray)
     * Brown hair → BROWN (the exact shade shown)
     * Blonde hair → BLONDE (the exact shade shown)
     * Red hair → RED (if shown in reference)
   - HAIR STYLE: Copy EXACTLY from reference
     * Length (short, medium, long)
     * Texture (straight, wavy, curly, coily)
     * Part location and direction
     * Thickness and volume
   - Hair color must be CONSISTENT across the entire story
   - Parents will immediately notice if hair color changes

4. EYES (ESSENTIAL FOR LIKENESS):
   - EYE COLOR: Must match reference EXACTLY
     * Brown eyes → BROWN
     * Black eyes → BLACK
     * Blue eyes → BLUE (only if in reference)
     * Green/hazel → only if in reference
   - EYE SHAPE: Copy exact shape (round, almond, hooded)
   - EYE SIZE: Preserve relative size from reference
   - Eyes must be clear, bright, well-defined with correct iris

5. FACIAL FEATURES (PRESERVE ALL):
   - NOSE: Exact shape and size from reference
   - MOUTH/LIPS: Shape, fullness, and expression style
   - CHEEKS: Roundness or slimness as shown
   - CHIN: Exact shape from reference
   - EYEBROWS: Shape and thickness from reference

6. UNIQUE CHARACTERISTICS (INCLUDE IF VISIBLE):
   - Dimples, freckles, birthmarks
   - Distinctive features that make this child unique
   - These details make the child recognizable to family

═══════════════════════════════════════════════════════════════════════════════
TECHNICAL REQUIREMENTS
═══════════════════════════════════════════════════════════════════════════════

- Pose/Angle: ${poseDesc}
- Style: Render in ${style.medium} - soft, painterly, illustrated
- Integration: Seamless blend with ${style.lighting}
- Preserve: Background, clothing, body posture, Arabic text, composition
- No photorealistic elements - maintain illustrated storybook quality

═══════════════════════════════════════════════════════════════════════════════
FINAL VERIFICATION CHECKLIST
═══════════════════════════════════════════════════════════════════════════════

Before finalizing, verify:
□ Face shape matches reference exactly
□ Skin tone is IDENTICAL to reference (not lighter, not darker)
□ Hair COLOR is IDENTICAL to reference (black=black, brown=brown)
□ Hair STYLE matches reference (length, texture, part)
□ Eye color matches reference exactly
□ Facial features (nose, lips, cheeks) match reference
□ Child is immediately recognizable as the same person from the reference
□ Parents would say "That's my child!" when they see this illustration

OUTPUT: A beautiful storybook illustration where the child looks EXACTLY like the reference photo - same skin tone, same hair, same features - naturally integrated into the scene.`;
}

/**
 * Get a simplified prompt for basic face swap (fallback)
 */
export function getBasicFaceSwapContext(pageNumber: number): string {
  const page = getPageConfig(pageNumber);
  if (!page) return "";

  return `Scene: ${page.description}. Child pose: ${page.childPose || "neutral"}. Position: ${page.childPosition || "center"}.`;
}
