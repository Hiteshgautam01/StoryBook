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

  // GIRL'S ABAYA - Alternative traditional outer garment for girls - ⚠️ GIRLS ONLY
  girlAbaya: {
    genderRestriction: "⚠️ MANDATORY: GIRLS ONLY - Abaya is a female outer garment. Boys wear thobe instead.",
    garment: "traditional Saudi abaya (elegant full-length outer cloak)",
    description: "beautiful traditional abaya suitable for a young girl, " +
      "full-length loose-fitting outer cloak reaching to ankles, " +
      "long wide sleeves, " +
      "open front design that flows gracefully, " +
      "worn over dress or clothing underneath, " +
      "elegant and modest silhouette",
    structure: "ABAYA STRUCTURE: " +
      "open-front flowing cloak (like a long open cardigan/robe), " +
      "no buttons or closures - worn open and flowing, " +
      "wide sleeves that drape beautifully, " +
      "lightweight fabric that moves with the body, " +
      "creates an elegant flowing silhouette",
    fit: "loose and flowing throughout, " +
      "drapes gracefully over the body, " +
      "allows complete freedom of movement for flying adventure",
    fabric: "lightweight flowing fabric (chiffon, crepe, or soft cotton), " +
      "has beautiful draping and movement quality, " +
      "catches the wind elegantly",
    inMotion: "WHEN FLYING OR IN MOTION: " +
      "the abaya flows dramatically and gracefully with the wind, " +
      "the open front panels may billow and flutter like gentle wings, " +
      "wide sleeves catch the wind beautifully, " +
      "creates a magical, ethereal, princess-like appearance while flying, " +
      "the fabric ripples and dances in the air, " +
      "underneath dress remains visible as abaya flows open",
    colors: "traditionally BLACK abaya, but can also be: " +
      "deep navy blue, dark burgundy, or rich dark purple, " +
      "may have elegant gold or silver embroidery along edges, " +
      "subtle beading or decorative trim on sleeves and hem, " +
      "can have delicate lace or embroidered patterns",
    withHijab: "OPTIONAL HIJAB: " +
      "may be paired with a matching or complementary hijab (headscarf), " +
      "hijab drapes softly around head and shoulders, " +
      "hijab fabric flows gently in the wind during flight, " +
      "creates a complete traditional look",
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
    girlAbaya: "OUTFIT (GIRL - ABAYA): Child wears a traditional Saudi abaya (elegant full-length outer cloak). " +
      "⚠️ CRITICAL: Girls do NOT wear thobe - thobe is a male-only garment. " +
      "The abaya is an open-front flowing cloak worn over a dress underneath. " +
      "In flight, the abaya flows dramatically and gracefully, panels billowing like gentle wings. " +
      "Traditional black or dark jewel tones (navy, burgundy, purple) with elegant gold/silver embroidery. " +
      "May be paired with a matching hijab that flows softly in the wind.",
    genderNote: "⚠️ GENDER OUTFIT RULE (MUST FOLLOW): " +
      "If child is BOY → wears white thobe (traditional male garment). " +
      "If child is GIRL → wears colorful traditional dress OR abaya (NOT thobe - thobe is male-only). " +
      "This is a cultural accuracy requirement that must be followed no matter what.",
  },
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
    sceneContext: `FLYING SCENE AT HEGRA - Child wearing traditional thobe while riding falcon.

    ⚠️⚠️⚠️ CRITICAL THOBE CORRECTION - READ CAREFULLY ⚠️⚠️⚠️

    THE THOBE IS **NOT** A CAPE. DO NOT DRAW IT LIKE A CAPE.

    ❌ WRONG (DO NOT DO THIS):
    - Thobe streaming/flying behind the child like a superhero cape
    - Thobe attached only at shoulders with fabric billowing behind
    - Child's chest/torso exposed with thobe flowing backward
    - Cape-like dramatic flowing behind the body
    - Thobe looking like Batman's cape or Superman's cape

    ✅ CORRECT (DO THIS):
    - Thobe is a LONG SHIRT/ROBE that the child WEARS (body is INSIDE it)
    - Thobe wraps AROUND the entire body - front, sides, AND back
    - Child's chest, stomach, and back are COVERED by the thobe
    - The thobe has SLEEVES that the arms go through
    - Only the bottom hem may flutter slightly in the wind
    - Think of it like a long dress or hospital gown - you WEAR it, it doesn't fly behind you

    THOBE STRUCTURE: ${CANONICAL_OUTFIT.thobe.structure}.
    ${CANONICAL_OUTFIT.thobe.notACape}.

    CORRECT IN-FLIGHT APPEARANCE:
    - The thobe stays WRAPPED around the child's body at all times
    - Wind causes gentle rippling of the fabric ON the body
    - The bottom hem may lift slightly showing ankles
    - Sleeves may billow slightly but remain on the arms
    - The garment NEVER detaches or streams behind like a cape
    - Child looks like they are wearing a white robe/dress while flying

    ${CANONICAL_OUTFIT.flyingOutfitPrompt.genderNote}
    FOR BOY: ${CANONICAL_OUTFIT.flyingOutfitPrompt.boy}
    FOR GIRL: ${CANONICAL_OUTFIT.flyingOutfitPrompt.girl}

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
    sceneContext: `RESTING SCENE ON ASIR MOUNTAIN - Child wearing traditional thobe while seated.

    OUTFIT (THOBE - NOT A CAPE): ${CANONICAL_OUTFIT.thobe.garment}.
    ${CANONICAL_OUTFIT.thobe.structure}.
    WHILE SEATED: Thobe drapes naturally around seated body, fabric pools slightly around legs, garment wraps the body properly.

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
    sceneContext: `FLYING SCENE OVER EASTERN PROVINCE - Child wearing traditional thobe while riding falcon.

    OUTFIT (THOBE - NOT A CAPE): ${CANONICAL_OUTFIT.thobe.garment}.
    ${CANONICAL_OUTFIT.thobe.structure}.
    IN-FLIGHT: ${CANONICAL_OUTFIT.thobe.inMotion}.
    The thobe wraps AROUND the child's body - NOT streaming behind like a cape.

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
    sceneContext: `EMOTIONAL CLOSE-UP SCENE - Child wearing traditional thobe.

    OUTFIT (THOBE - NOT A CAPE): ${CANONICAL_OUTFIT.thobe.garment}.
    ${CANONICAL_OUTFIT.thobe.structure}.
    CLOSE-UP: Upper portion of thobe visible with proper collar and front closure, garment worn correctly around body.

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
    sceneContext: `FLYING SCENE OVER MAGICAL MAP - Child wearing traditional thobe while riding falcon.

    OUTFIT (THOBE - NOT A CAPE): ${CANONICAL_OUTFIT.thobe.garment}.
    ${CANONICAL_OUTFIT.thobe.structure}.
    IN-FLIGHT: ${CANONICAL_OUTFIT.thobe.inMotion}.
    The thobe wraps AROUND the child's body - NOT streaming behind like a cape.

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
    sceneContext: `MAGICAL FEATHER SCENE - Child wearing traditional thobe.

    OUTFIT (THOBE - NOT A CAPE): ${CANONICAL_OUTFIT.thobe.garment}.
    ${CANONICAL_OUTFIT.thobe.structure}.
    WHILE FLOATING: Thobe drapes naturally around body, gentle magical wind causes soft rippling but garment stays wrapped around body - NOT like a cape.

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
    sceneContext: `RETURN SCENE - Child returning to bedroom at dawn, still wearing thobe from adventure.

    OUTFIT (THOBE - NOT A CAPE): ${CANONICAL_OUTFIT.thobe.garment}.
    ${CANONICAL_OUTFIT.thobe.structure}.
    LANDING/DESCENDING: ${CANONICAL_OUTFIT.thobe.inMotion}.
    As child descends to land, thobe may flutter gently but stays wrapped around body - NOT streaming behind like a cape.

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
 * Enhanced to emphasize face preservation at every angle
 */
function getPoseDescription(pose: ChildPose): string {
  const poseDescriptions: Record<ChildPose, string> = {
    "profile-left": "face turned to the left showing left profile - CRITICAL: The visible eye must be crystal clear, perfectly shaped, and match the reference eye color exactly. Face shape and features must still be recognizable from the reference photo. Skin tone must match reference.",
    "profile-right": "face turned to the right showing right profile - CRITICAL: The visible eye must be crystal clear, perfectly shaped, and match the reference eye color exactly. Face shape and features must still be recognizable from the reference photo. Skin tone must match reference.",
    "three-quarter": "face at three-quarter angle, slightly turned - CRITICAL: Both eyes must be visible, clear, bright, and match reference eye color. Face shape, nose, and lips clearly visible and matching reference. Skin tone must match reference exactly.",
    "front-facing": "face looking directly forward at the viewer - CRITICAL: This is the clearest view of the face. Both eyes must be perfectly symmetrical, clear, and match reference color exactly. All facial features must be a perfect match to the reference photo. Skin tone must be identical to reference.",
    "looking-up": "face tilted upward, looking at the sky with wonder - CRITICAL: Despite the angle, the face must still be clearly recognizable as the child from the reference. Eyes looking upward but still clear and matching reference color. Skin tone consistent with reference.",
    "looking-down": "face tilted downward, looking below - CRITICAL: Despite the angle, face shape and features must still match the reference. Forehead and hair clearly visible with exact hair color from reference. Skin tone consistent with reference.",
    "back-view": "back of head visible, facing away - CRITICAL: Hair color, texture, and style must match the reference EXACTLY. Even from behind, the child must be identifiable by their hair.",
    "side-silhouette": "side silhouette profile - CRITICAL: The silhouette shape must match the child's face shape from the reference. Hair style and profile contour must be recognizable.",
  };
  return poseDescriptions[pose] || "neutral position - face must match reference photo exactly in all visible features";
}

/**
 * Build a page-specific face swap prompt with scene context
 * Enhanced for maximum identity preservation - the child MUST look exactly like their photo
 *
 * KEY CONCEPT: The child from the reference photo is the STAR of the storybook.
 * They are playing the main character role - like an actor in a movie made just for them.
 * The illustration must show THIS EXACT CHILD in the storybook scene.
 */
export function buildPageSpecificPrompt(pageNumber: number): string {
  const page = getPageConfig(pageNumber);

  if (!page || !page.hasChild) {
    return ""; // No prompt needed for pages without children
  }

  const style = ILLUSTRATION_STYLE_DNA;
  const poseDesc = page.childPose ? getPoseDescription(page.childPose) : "natural position";

  return `🎬 PERSONALIZED STORYBOOK: The child in the reference photo is the STAR of this story!
This is THEIR book - they are PLAYING the main character role.
Think of it like a movie poster where THIS SPECIFIC CHILD is the hero.
This is a precious gift for a family - the child MUST look EXACTLY like themselves.

═══════════════════════════════════════════════════════════════════════════════
🎭 THE CHILD IS THE STAR - FACE CLONING PROTOCOL
═══════════════════════════════════════════════════════════════════════════════

The child in the reference photo IS the main character.
Every single feature of the child must be COPIED EXACTLY from the reference.
Imagine painting a portrait of THIS SPECIFIC CHILD dressed as a storybook character.
The face, skin, hair - everything must be IDENTICAL to the reference photo.

SCENE CONTEXT:
- Scene: ${page.sceneContext || page.description}
- Child position: ${page.childPosition || "center of frame"}
- Child's head angle: ${poseDesc}

═══════════════════════════════════════════════════════════════════════════════
🔴 RULE #1 - FACE IS SACRED (ZERO TOLERANCE FOR CHANGES)
═══════════════════════════════════════════════════════════════════════════════

The child's face is their IDENTITY. It must be a DIRECT COPY from the reference.
DO NOT modify, beautify, stylize, or change ANY facial feature.
DO NOT make the face look "better" or "cuter" - copy it EXACTLY as it is.
The face shape, proportions, and every detail must match the reference PRECISELY.

FACE SHAPE (COPY EXACTLY):
- If round → keep round. If oval → keep oval. If heart → keep heart.
- Cheek fullness: Chubby cheeks stay chubby, slim cheeks stay slim.
- Chin shape: Copy exactly - pointed, rounded, square, etc.
- Jawline: Soft, defined, round - match the reference.
- Forehead: Size and shape must match.
- The OUTLINE/SILHOUETTE of the face must be identical to reference.

═══════════════════════════════════════════════════════════════════════════════
🔴 RULE #2 - SKIN TONE (HIGHEST PRIORITY - DEFINES WHO THE CHILD IS)
═══════════════════════════════════════════════════════════════════════════════

Skin color is the FOUNDATION of this child's appearance and identity.
This is NON-NEGOTIABLE and must be PERFECT.

SAMPLE the skin tone DIRECTLY from the reference photo:
- DARK skin → paint DARK skin (same exact shade and undertone)
- BROWN skin → paint BROWN skin (same exact shade and undertone)
- OLIVE skin → paint OLIVE skin (same exact shade and undertone)
- TAN skin → paint TAN skin (same exact shade and undertone)
- LIGHT skin → paint LIGHT skin (same exact shade and undertone)
- FAIR skin → paint FAIR skin (same exact shade and undertone)

⚠️ CRITICAL VIOLATIONS (NEVER DO):
- NEVER lighten dark skin
- NEVER darken light skin
- NEVER change the undertone (warm/cool)
- NEVER make skin look washed out or grayish
- NEVER make skin look too pink, too yellow, or too orange

Skin tone must be CONSISTENT across:
✓ Entire face
✓ Neck
✓ Ears
✓ Hands (if visible)
✓ Any exposed skin

═══════════════════════════════════════════════════════════════════════════════
🔴 RULE #3 - HAIR (CRITICAL IDENTITY MARKER - MUST BE IDENTICAL)
═══════════════════════════════════════════════════════════════════════════════

Parents notice hair changes INSTANTLY. Hair must be EXACTLY like the reference.

HAIR COLOR (COPY THE EXACT COLOR):
- BLACK hair → stays BLACK (not dark brown, not gray, not charcoal)
- DARK BROWN hair → stays DARK BROWN (not black, not medium brown)
- MEDIUM BROWN hair → stays MEDIUM BROWN (exact shade)
- LIGHT BROWN hair → stays LIGHT BROWN (exact shade)
- BLONDE hair → stays BLONDE (exact shade - platinum, golden, dirty blonde)
- RED/AUBURN hair → stays RED/AUBURN (exact shade)
  
HAIR STYLE (COPY THE EXACT STYLE):
- LENGTH: Short, medium, long - match exactly
- TEXTURE: Straight, wavy, curly, coily, kinky - match exactly
- PARTING: Left part, right part, middle part, no part - match exactly
- BANGS: If present, include them. If not, don't add them.
- SPECIAL STYLES: Braids, ponytail, buns, etc. - match exactly

HAIR THICKNESS & VOLUME:
- Thick hair → thick hair
- Thin hair → thin hair
- Voluminous hair → voluminous hair
- Fine hair → fine hair

═══════════════════════════════════════════════════════════════════════════════
🔴 RULE #4 - EYES (THE WINDOW TO THE CHILD'S SOUL)
═══════════════════════════════════════════════════════════════════════════════

Eyes must be CLEAR, BRIGHT, and PERFECTLY FORMED.
⚠️ DO NOT spoil, blur, distort, or damage the eyes in any way.

EYE COLOR (MATCH EXACTLY):
- BROWN eyes → BROWN (the exact shade from reference)
- BLACK eyes → BLACK
- DARK eyes → DARK
- BLUE eyes → BLUE (only if in reference)
- GREEN eyes → GREEN (only if in reference)
- HAZEL eyes → HAZEL (only if in reference)

EYE SHAPE (COPY EXACTLY):
- Round, almond, hooded, monolid - whatever the reference shows
- Eye size and spacing - match the reference proportions

EYE QUALITY REQUIREMENTS:
✓ Clear, bright, alive-looking eyes
✓ Properly shaped iris with correct color
✓ Natural highlights/reflections
✓ No distortion, warping, or melting
✓ No uneven sizes or misalignment

═══════════════════════════════════════════════════════════════════════════════
🔴 RULE #5 - ALL OTHER FACIAL FEATURES (COPY EVERYTHING)
═══════════════════════════════════════════════════════════════════════════════

NOSE:
- Size: Small, medium, large - match reference
- Shape: Button, straight, wide, narrow - match reference
- Bridge and tip shape - copy exactly

LIPS/MOUTH:
- Fullness: Thin, medium, full - match reference
- Shape: Bow-shaped, wide, narrow - match reference
- Natural lip color from reference

EYEBROWS:
- Shape: Arched, straight, curved - match reference
- Thickness: Thin, medium, thick - match reference
- Color: Should match hair color from reference

EARS (if visible):
- Size and shape - match reference

UNIQUE CHARACTERISTICS (MUST INCLUDE):
- Freckles: If in reference, include them
- Dimples: If in reference, include them
- Birthmarks/moles: If visible in reference, include them
- Any distinctive features that make this child unique

═══════════════════════════════════════════════════════════════════════════════
🔴 RULE #6 - AGE PRESERVATION
═══════════════════════════════════════════════════════════════════════════════

The child must look the SAME AGE as in the reference photo.
- Baby features → keep baby features
- Toddler features → keep toddler features
- Young child features → keep young child features
- Older child features → keep older child features

DO NOT age up or age down the child.

═══════════════════════════════════════════════════════════════════════════════
ART STYLE (APPLY AFTER PRESERVING IDENTITY)
═══════════════════════════════════════════════════════════════════════════════

- Medium: ${style.medium}
- Texture: ${style.texture}
- Lighting: ${style.lighting}
- Colors: ${style.colorPalette}
- Quality: ${style.quality}
- Pose/Angle: ${poseDesc}

INTEGRATION REQUIREMENTS:
- Seamlessly blend the child's EXACT likeness into the illustrated style
- The child should look like they BELONG in this storybook world
- Preserve background, clothing, body posture, Arabic text, composition
- Maintain illustrated storybook quality (not photorealistic)
- The child is an ACTOR in this scene - same person, artistic style

═══════════════════════════════════════════════════════════════════════════════
✅ FINAL VERIFICATION CHECKLIST (ALL MUST PASS)
═══════════════════════════════════════════════════════════════════════════════

Before finalizing, verify EACH of these:

□ FACE SHAPE matches reference exactly (same outline/silhouette)
□ SKIN TONE is IDENTICAL to reference (not lighter, not darker, same undertone)
□ HAIR COLOR is IDENTICAL to reference (exact shade - black=black, brown=brown)
□ HAIR STYLE matches reference (length, texture, parting, thickness)
□ EYE COLOR matches reference exactly
□ EYE SHAPE matches reference exactly
□ EYES are clear, bright, properly formed (NOT spoiled/distorted)
□ NOSE shape and size matches reference
□ LIPS shape and fullness matches reference
□ EYEBROWS shape and thickness matches reference
□ UNIQUE FEATURES preserved (freckles, dimples, birthmarks if present)
□ CHILD looks the same AGE as in reference
□ Child is IMMEDIATELY recognizable as the same person from the reference

═══════════════════════════════════════════════════════════════════════════════
🎯 THE ULTIMATE TEST
═══════════════════════════════════════════════════════════════════════════════

When parents see this illustration, they MUST say:
"That's MY child! That looks EXACTLY like them!"

If there is ANY doubt about the identity, the illustration has FAILED.

OUTPUT: A beautiful storybook illustration where the child looks EXACTLY like
the reference photo - same skin tone, same hair, same face, same features -
naturally integrated into the magical scene as the STAR of their own story.`;
}

/**
 * Get a simplified prompt for basic face swap (fallback)
 * Still includes critical identity preservation instructions
 */
export function getBasicFaceSwapContext(pageNumber: number): string {
  const page = getPageConfig(pageNumber);
  if (!page) return "";

  return `Scene: ${page.description}. Child pose: ${page.childPose || "neutral"}. Position: ${page.childPosition || "center"}.

CRITICAL IDENTITY RULES:
1. Face must match reference EXACTLY - same face shape, same features
2. Skin tone must be IDENTICAL to reference (no lightening or darkening)
3. Hair color must match reference EXACTLY (black=black, brown=brown)
4. Hair style must match reference (length, texture, parting)
5. Eye color must match reference exactly
6. Eyes must be clear, bright, not spoiled or distorted
7. The child IS the star - they must be immediately recognizable`;
}