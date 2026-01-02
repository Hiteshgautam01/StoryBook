import { StoryTemplate, StoryPageTemplate, GenderOutfits } from "@/types";

// Master style prefix for all prompts
export const MASTER_STYLE_PREFIX =
  "Warm painterly children's book illustration, soft gouache and watercolor style, rich golden lighting, gentle textures, dreamlike quality, 300 DPI print quality.";

// Golden Falcon character description (consistent across all pages)
export const GOLDEN_FALCON_DESCRIPTION =
  "A magnificent giant falcon with rich shimmering golden feathers, large friendly wise amber eyes, powerful spread wings, majestic and gentle presence.";

// Outfit configurations by gender
export const OUTFITS: GenderOutfits = {
  boy: {
    home: "wearing a light blue crewneck t-shirt with a small chest pocket",
    journey: "wearing a simple clean white thobe"
  },
  girl: {
    home: "wearing a colorful floral dress with delicate embroidered details",
    journey: "wearing an elegant burgundy abaya with golden falcon embroidery and a matching light hijab"
  },
  neutral: {
    home: "wearing comfortable colorful clothes",
    journey: "wearing elegant traditional Arabian attire with golden details"
  }
};

// All 26 page templates (Cover + 25 pages)
// hasChild: true = use flux-pulid with reference image
// hasChild: false = use flux-pro (scenery/falcon only pages)
// idWeight: 1.0 = high face preservation (close-ups), 0.7-0.8 = wide shots (better composition)
const PAGES: StoryPageTemplate[] = [
  // COVER (Page 0) - Wide aerial shot
  {
    pageNumber: 0,
    arabicText: "رحلة {{childName}} والصقر الذهبي",
    promptTemplate: `${MASTER_STYLE_PREFIX} Children's book cover. A young child {{outfit}}, riding on the back of ${GOLDEN_FALCON_DESCRIPTION}, soaring through a golden-orange sunset sky. Below: the glowing Kaaba in Makkah, desert mountains, distant Riyadh skyline silhouette. The falcon leaves a magical glowing golden trail behind its wings. Warm sunset clouds, shimmering gold light and stardust.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.8 // Wide shot, less face emphasis
  },
  // PAGE 1 - Close-up bedroom
  {
    pageNumber: 1,
    arabicText: "في ليلةٍ هادئة… كان {{childName}} يقف عند نافذته ينظر إلى السماء المليئة بالنجوم.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Cozy nighttime bedroom scene. A young child {{outfit}}, standing at a large bedroom window gazing out with wonder and curiosity. Through the window, a magical dark blue night sky filled with bright twinkling stars. Soft warm bedside lamp glow inside the cozy room. Peaceful, dreamy atmosphere.`,
    isHomeSetting: true,
    hasChild: true,
    idWeight: 1.0 // Close-up, high face preservation
  },
  // PAGE 2 - Falcon only
  {
    pageNumber: 2,
    arabicText: "وفجأة… ظهر صقرٌ تلمع جناحاه كالذهب أمام نافذته!",
    promptTemplate: `${MASTER_STYLE_PREFIX} Magical nighttime scene. A cozy bedroom interior with large window view. Outside the window: ${GOLDEN_FALCON_DESCRIPTION} hovering majestically, looking warmly into the room. The falcon radiates magical golden light particles and sparkles that swirl around it. Dark blue night sky with stars floating magically.`,
    isHomeSetting: true,
    hasChild: false
  },
  // PAGE 3 - Falcon only
  {
    pageNumber: 3,
    arabicText: "قال الصقر بصوتٍ دافئ: \"أنا من صقور هذه الأرض… أحمل حكاية وطنك.\"",
    promptTemplate: `${MASTER_STYLE_PREFIX} Intimate window close-up. ${GOLDEN_FALCON_DESCRIPTION} perched on the outside window ledge, beak slightly open as if speaking kindly, detailed golden plumage gleaming. Starry night sky behind. Warm breath visible as swirling golden mist, magical calligraphy made of warm golden vapor and light.`,
    isHomeSetting: true,
    hasChild: false
  },
  // PAGE 4 - Dynamic takeoff
  {
    pageNumber: 4,
    arabicText: "أمسك {{childName}} بجناح الصقر، فانطلقا عاليًا في السماء.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Dynamic takeoff scene. A young child {{outfit}}, holding tightly onto the golden feathers of ${GOLDEN_FALCON_DESCRIPTION}, spreading its huge powerful wings. They lift off from a bedroom window ledge into the starry night sky. The falcon's wingtips leave trails of golden light across the dark sky. Magical skywriting against the stars.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.9 // Medium shot
  },
  // PAGE 5 - MAKKAH (wide aerial)
  {
    pageNumber: 5,
    arabicText: "رأى {{childName}} مكة من الأعلى… الكعبة تُضيء قلوب الناس بنور الإيمان.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Breathtaking aerial view. A young child {{outfit}} with awed expression, riding on the back of ${GOLDEN_FALCON_DESCRIPTION}, wings spread wide, flying high above Makkah at dawn. Below: the Grand Mosque with the glowing Kaaba at center, tiny pilgrims in white circling it. Rich gold and cream and soft blue palette. Warm golden rays of divine light rising from the Kaaba.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.7 // Wide aerial shot
  },
  // PAGE 6 - Intimate moment
  {
    pageNumber: 6,
    arabicText: "قال الصقر: \"من هنا بدأ نور الإسلام… هنا يتعلم الناس الرحمة والصدق.\"",
    promptTemplate: `${MASTER_STYLE_PREFIX} Intimate mid-flight moment. Close-up view of ${GOLDEN_FALCON_DESCRIPTION} turning its head to speak. A young child {{outfit}}, riding on the falcon's back with peaceful listening expression. Below them, soft white and golden clouds over the holy city shaped like flowing calligraphy. Dreamlike cloud formations.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.9 // Medium-close shot
  },
  // PAGE 7 - MADINAH landing
  {
    pageNumber: 7,
    arabicText: "اتجها إلى المدينة المنوّرة… حيث عاش رسول الله ﷺ.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Peaceful landing scene. ${GOLDEN_FALCON_DESCRIPTION} carrying a young child {{outfit}} with gentle happy expression, landing gently in Madinah. The Prophet's Mosque with its distinctive green dome and white minarets visible in the background. Soft afternoon golden sunlight, palm trees dotting the landscape. Calm reflecting pools of water with golden light ripples.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.85 // Medium shot with background
  },
  // PAGE 8 - Learning scene (close-up)
  {
    pageNumber: 8,
    arabicText: "رأى {{childName}} حلقات العلم تحت النخيل، والأطفال يتعلّمون الكتابة والقراءة.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Warm learning scene. Under large date palm trees, a wise elderly teacher in white traditional dress sits with a group of diverse young children holding books and tablets. A young child {{outfit}} stands nearby watching happily with a wide smile. Warm golden afternoon light filtering through the palm fronds.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 1.0 // Close-up ground scene
  },
  // PAGE 9 - NAJD (wide aerial)
  {
    pageNumber: 9,
    arabicText: "طار الصقر إلى نجد… حيث تمتد الصحراء والوديان.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Epic aerial desert view. A young child {{outfit}} with amazed joyful expression, riding on the back of ${GOLDEN_FALCON_DESCRIPTION}, wings spread wide, flying over the vast Najd desert at sunset. Below: rolling golden sand dunes and deep valleys. Dramatic sunset sky with orange, purple, and deep blue hues.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.7 // Wide aerial shot
  },
  // PAGE 10 - RIYADH
  {
    pageNumber: 10,
    arabicText: "قال الصقر: \"هذه الرياض… قلب الجزيرة العربية.\"",
    promptTemplate: `${MASTER_STYLE_PREFIX} Desert twilight atmosphere. ${GOLDEN_FALCON_DESCRIPTION} hovering in the air. A young child {{outfit}} with curious wondering expression, riding on the falcon's back, gazing toward the horizon. Across the sand dunes, the distant Riyadh skyline glows with thousands of tiny lights against the deep orange and purple twilight sky.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.8 // Medium-wide shot
  },
  // PAGE 11 - TRANSFORMATION
  {
    pageNumber: 11,
    arabicText: "شاهد {{childName}} الرياض وهي تتغيّر… من حصون طينية إلى أبراج وروائع حديثة.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Old meets new contrast scene. A young child {{outfit}} with amazed expression, riding on ${GOLDEN_FALCON_DESCRIPTION}, flying between two contrasting elements: LEFT - the traditional mud-brick Masmak Fortress in warm earthen tones, RIGHT - the modern gleaming Kingdom Centre tower reflecting bright sunlight. A large traditional Sadu woven textile banner with intricate geometric patterns bridging heritage and modernity.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.8 // Wide shot with architecture
  },
  // PAGE 12 - ALULA
  {
    pageNumber: 12,
    arabicText: "واصل الصقر طريقه نحو الشمال… إلى العلا ومدائن صالح.",
    promptTemplate: `${MASTER_STYLE_PREFIX} AlUla landscape. A young child {{outfit}} with wonder-filled expression, riding on ${GOLDEN_FALCON_DESCRIPTION}, flying low past massive ancient Nabataean tombs carved into giant reddish-orange sandstone cliffs of Hegra. Immense scale, dramatic shadows from the setting sun. Ancient carved rock inscriptions, weathered by centuries.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.8 // Wide shot with monuments
  },
  // PAGE 13 - Scenery only
  {
    pageNumber: 13,
    arabicText: "قال الصقر: \"هنا نحت الإنسان الجبال، وبنى مدنًا وحضارات لا تُنسى، جعلت من الصحراء متحفًا.\"",
    promptTemplate: `${MASTER_STYLE_PREFIX} Archaeological rock detail at AlUla. Close-up of an ancient tomb entrance carved into the sandstone cliff, intricate carved details, warm sunlight casting long shadows across the surface. Natural striations, layers, and textures in the ancient rock face. Letters emerging from natural patterns in the warm orange and cream rock layers.`,
    isHomeSetting: false,
    hasChild: false
  },
  // PAGE 14 - ASIR (medium shot on mountain)
  {
    pageNumber: 14,
    arabicText: "هبط الصقر جنوبًا… حيث بيوت عسير تقف على الجبال كأنها تحرس السماء.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Asir mountain vista. A young child {{outfit}} with peaceful happy expression, sitting with ${GOLDEN_FALCON_DESCRIPTION}, perched together on a high rugged Asir mountain peak. Below: terraced green farms cascading down the slopes, traditional stone houses built on cliff edges. Soft white mist in the deep valleys drifting poetically between the green peaks.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.85 // Medium shot on mountain
  },
  // PAGE 15 - Scenery only (Al-Qatt wall art)
  {
    pageNumber: 15,
    arabicText: "قال الصقر: \"هنا عاش الناس الشجاعة والكرامة… وهنا وُلدت الفنون الجميلة وزخارف القط العسيري.\"",
    promptTemplate: `${MASTER_STYLE_PREFIX} Asiri folk art close-up. A traditional Asiri house wall covered in colorful geometric Al-Qatt Al-Asiri patterns - bright reds, blues, yellows, greens painted on textured mud and stone surface. Text painted in traditional style as part of the folk art decoration, using the same vibrant colors and geometric framing as authentic Al-Qatt patterns.`,
    isHomeSetting: false,
    hasChild: false
  },
  // PAGE 16 - EASTERN PROVINCE (wide aerial)
  {
    pageNumber: 16,
    arabicText: "طار الصقر شرقًا… حتى رأى {{childName}} البحر والمصافي الكبيرة.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Eastern Province coast at dusk. A young child {{outfit}} with curious expression, riding on ${GOLDEN_FALCON_DESCRIPTION}, flying over the Arabian Gulf coast. Below: oil refineries with twinkling lights, pipelines, storage tanks, large tanker ships on dark blue water. Deep orange and navy sky. Industrial lights reflecting on the calm dark water surface.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.75 // Wide aerial industrial shot
  },
  // PAGE 17 - Scenery only (oil industry)
  {
    pageNumber: 17,
    arabicText: "قال الصقر: \"هنا اكتُشف النفط… ومن هنا تغير اقتصاد العالم.\"",
    promptTemplate: `${MASTER_STYLE_PREFIX} Industrial sunset landscape. Wide view of oil rigs and refinery towers silhouetted against the bright setting sun, Eastern Province, showing the grand scale of the energy industry. Complex network of pipelines, beams, and industrial structures against the bright orange sky. Infrastructure in black silhouette against the warm amber and gold sunset.`,
    isHomeSetting: false,
    hasChild: false
  },
  // PAGE 18 - ABOVE THE KINGDOM (very wide)
  {
    pageNumber: 18,
    arabicText: "ارتفع الصقر عاليًا فوق المملكة كلها.",
    promptTemplate: `${MASTER_STYLE_PREFIX} High altitude wonder. A young child {{outfit}} with ecstatic joyful expression, arms outstretched in joy, riding on ${GOLDEN_FALCON_DESCRIPTION}, flying very high in the atmosphere. The curve of the Earth visible below, atmosphere gradient from blue to dark. Magical aurora-like ribbons of golden and soft green light dancing and swirling in the thin upper atmosphere.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.7 // Very wide atmospheric shot
  },
  // PAGE 19 - High altitude map
  {
    pageNumber: 19,
    arabicText: "قال: \"يا {{childName}}… ما يجمع هذه البلاد هو همة السعوديين وقيمهم.\"",
    promptTemplate: `${MASTER_STYLE_PREFIX} High altitude map view. A young child {{outfit}} with thoughtful inspired expression, riding on ${GOLDEN_FALCON_DESCRIPTION}. Below them, Saudi Arabia's geography is visible from high above. Golden glowing lines of light connecting the visited regions - Makkah, Medina, Riyadh, Asir, Eastern coast - unity of the nation spelled out by connections between cities, glowing warmly against the landscape below.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.75 // Wide map view
  },
  // PAGE 20 - CITIES OF THE FUTURE (panoramic)
  {
    pageNumber: 20,
    arabicText: "رأى {{childName}} الرياض بعمارتها، والدرعية بثوبها التاريخي، نيوم تلمع كخيال مستقبلي، العلا تاريخ حضارات، القدية أرض المغامرات، والطائف، وأبها وجدة.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Visionary panorama. A young child {{outfit}} with amazed inspired expression, riding on ${GOLDEN_FALCON_DESCRIPTION}, viewing a magnificent horizon filled with Saudi landmarks: Riyadh with its modern architecture, Diriyah in its historical dress, NEOM glittering like a futuristic dream, AlUla representing ancient civilizations, Qiddiya as land of adventures. Colorful dreamlike panorama of past and future united. Futuristic holographic light projection, glowing cyan and gold.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.75 // Panoramic wide shot
  },
  // PAGE 21 - Emotional moment (medium-close)
  {
    pageNumber: 21,
    arabicText: "قال الصقر: \"كل مدينة تقول لك… أنا قطعة من وطنك.\"",
    promptTemplate: `${MASTER_STYLE_PREFIX} Emotional moment. A young child {{outfit}} with deeply moved amazed expression, gazing at the panoramic kingdom view. Beside them, ${GOLDEN_FALCON_DESCRIPTION}, looking proud and gentle. A few luminous golden feathers drifting from the falcon's wings, floating in the warm air, magical feathers glowing softly, suspended in golden light.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.9 // Emotional close-up moment
  },
  // PAGE 22 - THE RETURN (medium shot at window)
  {
    pageNumber: 22,
    arabicText: "عاد الصقر يخفّض جناحيه… يقترب من نافذة {{childName}}.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Gentle return scene. Nighttime, ${GOLDEN_FALCON_DESCRIPTION} hovering gently outside the bedroom window, wings lowered peacefully. A young child {{outfit}} standing inside the window looking out at the falcon with gratitude and peaceful expression. A bright moon behind soft clouds, moonlight streaming through gaps, silvery-gold light, peaceful and dreamlike against the deep blue night.`,
    isHomeSetting: false,
    hasChild: true,
    idWeight: 0.9 // Medium shot at window
  },
  // PAGE 23 - Falcon only (farewell)
  {
    pageNumber: 23,
    arabicText: "همس الصقر: \"الأمة تبنى من كلمات صغيرة، وقلوب كبيرة.\"",
    promptTemplate: `${MASTER_STYLE_PREFIX} Intimate farewell close-up. ${GOLDEN_FALCON_DESCRIPTION} with gentle loving expression, face close to the window as it prepares to depart. Starry night sky behind, magical warm golden glow around the falcon. Whispered breath visible as a mixture of warm golden mist and tiny newborn stars, words appearing as both warmth and starlight, fading gently into the night, magical and ephemeral.`,
    isHomeSetting: false,
    hasChild: false
  },
  // PAGE 24 - Cozy ending (close-up bedroom)
  {
    pageNumber: 24,
    arabicText: "عاد {{childName}} إلى غرفته… لكن قلبه أصبح أوسع وأغنى بحكايات وطنه.",
    promptTemplate: `${MASTER_STYLE_PREFIX} Cozy ending scene. A young child {{outfit}} with eyes full of wonder and contentment, gentle inspired smile, sitting comfortably on their bed holding a large open storybook. Warm cozy bedroom, soft bedside lamp light creating a safe peaceful atmosphere. The storybook's visible pages show beautiful illustrations and text, a story within the story.`,
    isHomeSetting: true,
    hasChild: true,
    idWeight: 1.0 // Close-up bedroom ending
  },
  // PAGE 25 - THE END (scenery only)
  {
    pageNumber: 25,
    arabicText: "الخاتمة",
    promptTemplate: `${MASTER_STYLE_PREFIX} Elegant simple closing page. Centered composition on a warm cream background: an open book with aged cream pages, and a single luminous golden falcon feather resting gently on the pages, soft warm light emanating from the feather. The delicate barbs and fibers of the golden feather glowing softly. Simple warm cream and gold gradient background. The word "الخاتمة" (The End) written elegantly.`,
    isHomeSetting: false,
    hasChild: false
  }
];

// Full story template
export const FALCON_STORY: StoryTemplate = {
  id: "golden-falcon",
  titleArabic: "رحلة {{childName}} والصقر الذهبي",
  titleEnglish: "{{childName}} and the Golden Falcon",
  defaultChildName: "فيصل",
  masterStylePrefix: MASTER_STYLE_PREFIX,
  totalPages: 26, // Cover (0) + 25 pages
  pages: PAGES
};

// Helper to get a specific page template
export function getPageTemplate(pageNumber: number): StoryPageTemplate | undefined {
  return PAGES.find(p => p.pageNumber === pageNumber);
}

// Get all page templates
export function getAllPageTemplates(): StoryPageTemplate[] {
  return PAGES;
}

// Check if a page has the child in it (for determining which model to use)
export function pageHasChild(pageNumber: number): boolean {
  const page = getPageTemplate(pageNumber);
  return page?.hasChild ?? false;
}
