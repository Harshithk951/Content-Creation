# 100 DAYS OF FREE AI — OFFICIAL SERIES BIBLE

> **Permanent Standard**: Enforced across all episodes from Day 01 through Day 100.
> **Format:** 9:16 vertical (1080 × 1920 @ 30 FPS)
> **Pacing:** Snappy, balanced conversational latency (~320ms / 10 frames between turns).
> **Audio Master Standard:** Stereo 48 kHz, EBU R128 mastered to -14 LUFS.

---

## 1. Character Profiles & Permanent Voice Assignments

### Harshith (Creator / Host)
* **Age & Profile:** 21-year-old Indian tech creator, student developer, and smart tinkerer.
* **Visual Appearance:**
  * Clean, youthful 3D stylized adult face with subtle beard/stubble.
  * Distinctive black round spectacles.
  * Messy dark brown/black styled hair.
  * Dark charcoal hoodie over a white t-shirt.
  * Accent Ring: **Electric Blue (`#2563EB`)**
  * Official Avatar Asset: `reel-studio/public/avatars/harshith_official.jpg`
* **Permanent Voice:**
  * **Provider:** ElevenLabs
  * **Model:** `eleven_turbo_v2_5`
  * **Voice Name:** **`Liam`**
  * **Voice ID:** `TX3LPaxmHKxFdv7VOQHJ`
  * **Voice Settings:** Stability `0.55`, Similarity `0.80`, Style `0.20`, Speaker Boost `true`
  * **Vocal Personality:** Natural, fast-paced, relatable, skeptical yet enthusiastic young developer.

---

### Claude (AI Co-Host & Robotic Companion)
* **Design & Form:**
  * Spherical faceted companion bot with bright terracotta orange chassis.
  * Glowing yellow curved visor displaying deadpan and animated facial expressions.
  * Brass-tipped antenna and circular orbit ring.
  * Accent Ring: **Terracotta Orange (`#F97316`)**
  * Official Avatar Asset: `reel-studio/public/avatars/claude_official.jpg`
* **Permanent Voice:**
  * **Provider:** ElevenLabs
  * **Model:** `eleven_turbo_v2_5`
  * **Voice Name:** **`George`**
  * **Voice ID:** `JBFqnCBsd6RMkjVDRZzb`
  * **Voice Settings:** Stability `0.55`, Similarity `0.80`, Style `0.20`, Speaker Boost `true`
  * **Vocal Personality:** Warm, articulate British storyteller, deadpan sarcasm, authoritative technical sanity.

---

## 2. Whiteboard Layout & Mobile Safe Margins

* **Canvas:** `1080 × 1920` (9:16 vertical portrait).
* **Background:** Light off-white dry-erase grid (`#FAF9F6`).
* **Vertical Structure (No Large Voids):**
  1. **Top (Y: 90px):** Small Series Header (`100 DAYS OF FREE AI` • `DAY XX / 100`)
  2. **Upper-Middle (Y: 245px):** Educational Whiteboard Concept Card (SVG whiteboard drawing animations)
  3. **Middle-Lower (Y: 780px):** Circular Character Speaker Box (240px circle, subtle audio pulse)
  4. **Subtitles (Y: 1090px):** Dialogue subtitle pill with speaker color accent bar
  5. **CTA Section (Y: 1260px):** Prominent `COMMENT FREE` with animated arrow pointing down.

---

## 3. Production Workflow for Every Video
1. **Script:** 30–45s dialogue (~70–90 words), alternating between Harshith and Claude.
2. **Audio Synthesis:** Synthesize lines using ElevenLabs `Liam` and `George` via `eleven_turbo_v2_5`.
3. **Pacing Standardization:** Auto-trim silences and inject equal 320ms pauses between turns.
4. **Composition:** Render with Remotion using the `WhiteboardScene` template.
5. **Assets & Dashboard:** Push video and caption metadata to Supabase dashboard database.
6. **Public Notion Guides (Strict Rule):**
   * Public Notion setup guides are strictly student- and viewer-facing tutorials.
   * **Only include:** Hero callout, ELI5 explanation, step-by-step tutorial instructions (download links, install commands, code snippets), pro-tips, and checklist.
   * **NEVER include:** The character dialogue script (`The Harshith & Claude Dialogue`) or social copy / caption assets (`Social Copy & Instagram Reel Assets`). Those are internal creator assets that live in git and the dashboard.
