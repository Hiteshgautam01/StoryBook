# Prompt Improvement Discussion

**Date**: 2026-01-30
**Purpose**: Document potential improvements to face-swap and portrait generation prompts

---

## Current Prompt System Overview

The codebase uses a two-stage hybrid pipeline:
1. **Stage 1 (InstantID)**: Generate stylized watercolor portraits from uploaded child photo
2. **Stage 2 (Easel)**: Composite portraits onto story illustrations

### Key Files:
- `/lib/prompts/pose-prompts.ts` - Portrait generation prompts (7 poses)
- `/lib/prompts/story-pages.ts` - Page-specific integration prompts
- `/lib/hybrid-pipeline/instant-id.ts` - Identity preservation settings
- `/lib/hybrid-pipeline/easel-face-swap.ts` - Face compositing logic

---

## Potential Improvement Areas

### 1. Identity Preservation Settings
**Current Configuration** (`instant-id.ts:36`):
```typescript
const DEFAULT_CONFIG = {
  ipAdapterScale: 0.8,              // Face identity strength
  identityControlnetScale: 0.9,     // Identity preservation
  guidanceScale: 7.0,               // Prompt adherence
  numInferenceSteps: 30,            // Quality
};
```

**Potential Enhancement**:
- Increase `ipAdapterScale` to 0.85-0.95
- Increase `identityControlnetScale` to 0.95-1.0
- **Tradeoff**: Higher values = stronger facial similarity but may reduce artistic watercolor style

---

### 2. More Explicit Facial Feature Preservation
**Current**: General "face" and "portrait" mentions

**Could Add**:
- Eye color and shape preservation
- Nose structure matching
- Mouth/lip shape retention
- Face proportions and structure
- Exact skin tone from reference photo
- Eyebrow shape and color matching

**Example Addition**:
```
"Preserve the child's exact eye color, nose shape, lip structure, and facial proportions from the reference photo"
```

---

### 3. Hair Color/Style Preservation
**Current**:
- Easel uses `workflow_type: "user_hair"` (easel-face-swap.ts:65)
- InstantID prompts don't explicitly mention hair

**Could Add to InstantID Prompts**:
```
"Maintain the exact hair color, texture, and style from the reference photo"
```

---

### 4. Age-Appropriate Rendering
**Current**: Generic "child" descriptor

**Could Specify**:
- "Young child aged 4-8 years old"
- "Preschool-aged child"
- Or allow dynamic age specification from user input

**Benefit**: Prevents AI from aging up or down the child's appearance

---

### 5. Ethnicity & Skin Tone Accuracy
**Current**: Mentions "natural skin texture" but not explicit preservation

**Could Add**:
- "Maintain exact skin tone and undertones from reference photo"
- "Preserve ethnic facial characteristics and features"
- "Keep natural complexion without alteration"
- "Match melanin levels and skin warmth from original photo"

---

### 6. Expression Matching
**Current**: Page configs have `sceneContext` but no emotion directives

**Could Add Scene-Specific Emotions**:
- Page 1 (Looking at stars): "Curious, dreamy expression"
- Page 4 (Taking flight): "Excited, joyful, wonder-filled expression"
- Page 5 (Viewing Kaaba): "Awe, reverence, peaceful expression"
- Page 12 (At AlUla): "Amazed, contemplative expression"

**Implementation**: Add `childExpression` field to `StoryPageConfig` type

---

### 7. Negative Prompt Expansion
**Current Negative Prompt** (`pose-prompts.ts:75`):
```typescript
"photorealistic, photograph, photo, 3d render, cgi,
harsh shadows, sharp edges, digital art, anime, cartoon,
blurry, low quality, distorted features,
multiple people, full body, hands"
```

**Could Add**:
- "different person, wrong face, generic face, unfamiliar features"
- "adult features, aged up, teenager, older child"
- "oversaturated, neon colors, unnatural colors"
- "stiff pose, robotic, mannequin-like"
- "inconsistent character, different ethnicity"

---

### 8. Lighting Direction Matching
**Current**: General "warm golden ambient lighting" in style DNA

**Could Enhance**:
- Parse illustration to detect light source direction
- Add page-specific lighting hints:
  - "Light from upper right matching the illustration"
  - "Moonlight from left side as in original scene"
  - "Overhead sunlight as shown in background"

---

### 9. Prompt Length/Complexity
**Current**: `buildPageSpecificPrompt()` creates very detailed multi-line prompts

**Consideration**:
- Some AI models respond better to concise prompts
- Could A/B test shortened vs. detailed versions
- Current approach: Detailed and explicit
- Alternative: Short, focused keywords

**Potential Test**: Compare success rates between detailed vs. condensed prompts

---

### 10. Consistency Tokens
**Current**: Each image generated independently

**Could Add**:
- Character identity reinforcement across generations
- "This is [ChildName], maintain consistent facial features across all images"
- Reference to "character sheet" concept
- Batch processing with character consistency hints

**Implementation Ideas**:
- Add character description to all prompts
- Use first successful portrait as reference for subsequent ones
- Cache and reference "canonical features" description

---

## Questions to Answer Before Implementation

### 1. What specific issues are you seeing with current face swaps?
- Faces look too different from child?
- Not enough similarity to uploaded photo?
- Wrong artistic style (too realistic/too abstract)?
- Skin tone inaccuracies?
- Other specific problems?

### 2. Are certain poses working better than others?
- Which pose prompts produce best results?
- Which poses consistently fail or look wrong?
- Are profile views better/worse than front-facing?

### 3. Do you have example outputs to review?
- Successful examples showing what works well?
- Failed examples showing what needs improvement?
- Side-by-side comparisons?

### 4. What's your priority?
**Option A**: Maximum facial similarity to uploaded photo
**Option B**: Better artistic integration into watercolor style
**Option C**: Balanced approach between similarity and style

### 5. Are you experiencing specific technical issues?
- Skin tone accuracy problems?
- Hair color mismatches?
- Age appearance issues (looking older/younger)?
- Expression mismatches with scene context?
- Ethnicity/features not preserved correctly?

---

## Next Steps

1. Gather feedback on specific issues
2. Review example outputs if available
3. Prioritize which improvements to implement first
4. Test changes incrementally (one improvement at a time)
5. A/B test before/after to validate improvements
6. Document successful changes for future reference

---

## Notes

- All improvements should be tested with FAL AI credits available
- Changes should be made incrementally to isolate impact
- Consider A/B testing with multiple children's photos
- Document success metrics (similarity score, artistic quality, consistency)
