---
name: free-ai-reel-generator
description: "Standardized production pipeline for the '100 Days of Free AI' Instagram Reels series. Synthesizes dialogue with ElevenLabs Liam & George, animates Lemo Opuscar whiteboard explainer layouts in Remotion (1080x1920 9:16), enforces 320ms conversational pacing, renders master videos, and syncs directly to the ReelVault dashboard and Notion setup guides."
metadata:
  series: "100 Days of Free AI"
  format: "9:16 Vertical Reel (1080x1920 @ 30 FPS)"
  audio_standard: "-14 LUFS 48kHz Stereo"
---

# 100 Days of Free AI — Reel Production Skill

This skill automates and enforces the complete end-to-end production workflow for every episode in the **100 Days of Free AI** series.

---

## 1. Permanent Voice & Character Standards

All episodes **MUST** use these exact character identities, avatar assets, and ElevenLabs voice settings:

### 👤 Harshith (Host / Creator)
* **Visual:** 21-year-old Indian developer, black round spectacles, styled hair, dark hoodie.
* **Avatar File:** `reel-studio/public/avatars/harshith_official.jpg`
* **Ring Color:** Electric Blue (`#2563EB`)
* **Voice Provider:** ElevenLabs (`eleven_turbo_v2_5`)
* **Voice Name:** **`Liam`**
* **Voice ID:** `TX3LPaxmHKxFdv7VOQHJ`
* **Voice Settings:** Stability `0.55`, Similarity `0.80`, Style `0.20`, Speaker Boost `true`

### 🤖 Claude (Co-Host / Companion Bot)
* **Visual:** Terracotta orange geometric sphere robot, glowing yellow visor, antenna.
* **Avatar File:** `reel-studio/public/avatars/claude_official.jpg`
* **Ring Color:** Terracotta Orange (`#F97316`)
* **Voice Provider:** ElevenLabs (`eleven_turbo_v2_5`)
* **Voice Name:** **`George`**
* **Voice ID:** `JBFqnCBsd6RMkjVDRZzb`
* **Voice Settings:** Stability `0.55`, Similarity `0.80`, Style `0.20`, Speaker Boost `true`

---

## 2. Conversational Pacing & Timing Rules

* **Equal Conversational Gap:** Between every dialogue turn, enforce an exact **320ms (10 frames)** silence.
* **No Lag / Overlap:** Trim all lead/tail silences before timeline assembly.
* **Outro Hold:** Add a **2.0-second hold** after the final line to let the viewer read the `COMMENT FREE` CTA card.
* **Loudness Mastering:** Target **-14 LUFS (EBU R128)**, 48 kHz stereo PCM audio.

---

## 3. Visual Layout Architecture (9:16 Portrait Safe Areas)

The video layout follows the compact **Lemo Opuscar Clean Whiteboard Explainer** style with zero empty dead zones:

```
┌──────────────────────────────────────┐  Y = 0
│                                      │
│  [100 DAYS OF FREE AI • DAY XX/100]  │  Y = 90px (Series Branding)
│                                      │
│ ┌──────────────────────────────────┐ │
│ │      EDUCATIONAL CONCEPT CARD    │ │  Y = 245px (Height: ~480px)
│ │  (Step cards, pricing vs free,   │ │
│ │   visual diagrams, animated SVG) │ │
│ └──────────────────────────────────┘ │
│                                      │  Gap: ~55px (Compact)
│              ╭──────╮                │
│              │AVATAR│                │  Y = 780px (Speaker Circle: 240px)
│              ╰──────╯                │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ ▌ Subtitle Dialogue Text Bar     │ │  Y = 1090px (Subtitles)
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │       👇 COMMENT FREE 👇          │ │  Y = 1260px (Comment CTA)
│ │    GET THE FREE SETUP GUIDE      │ │
│ └──────────────────────────────────┘ │
│                                      │
│      [Mobile Navigation Safe Zone]   │  Y = 1720px - 1920px (Safe margin)
└──────────────────────────────────────┘  Y = 1920px
```

---

## 4. End-to-End Production Workflow

### Step 1: Prepare the Dialogue Script
Format the script as a JSON list of dialogue turns:
```json
[
  {"speaker": "harshith", "text": "Claude, I need Midjourney for thumbnails."},
  {"speaker": "claude", "text": "No you don't. You need Flux."},
  {"speaker": "harshith", "text": "Flux? That free thing? It looks cheap."},
  {"speaker": "claude", "text": "Flux.1 Schnell. Open-source. Same quality. Zero dollars."}
]
```

### Step 2: Generate Master Audio
Run the audio generation helper:
```bash
python3 .agents/skills/free-ai-reel-generator/scripts/generate_audio.py \
  --script series/episodes/XX-topic/script.json \
  --output reel-studio/public/episodeXX_master.wav
```
This automatically produces:
1. `reel-studio/public/episodeXX_master.wav` (Master audio)
2. `reel-studio/public/episodeXX_master_timeline.json` (Exact start/duration frame schedule for Remotion)

### Step 3: Implement Remotion Scene
Create or update `reel-studio/src/Series/WhiteboardSceneDayXX.tsx`:
- Import `SpeakerCircle` from `./SpeakerCircle`.
- Load dialogue lines from the generated timeline JSON.
- Add educational concept cards (costs, comparison arrows, step boxes) matching the episode's topic.
- Register the composition in `reel-studio/src/Root.tsx` with the calculated duration.

### Step 4: Render Master Video
Render using Remotion (requires unsandboxed execution for Chrome WebGL):
```bash
cd reel-studio && npx remotion render src/index.ts WhiteboardEpisodeXX ../Exports/100DaysOfFreeAI_DayXX_Topic.mp4 --gl=angle --overwrite
```

### Step 5: Push to Dashboard & Remote
1. Copy the rendered video to ReelVault public assets:
```bash
cp Exports/100DaysOfFreeAI_DayXX_Topic.mp4 reelvault/public/sample-epXX.mp4
```
2. Upload video and push database record to Supabase:
```bash
python3 .agents/skills/free-ai-reel-generator/scripts/push_to_dashboard.py \
  --episode XX \
  --title "Episode Title" \
  --file Exports/100DaysOfFreeAI_DayXX_Topic.mp4 \
  --duration <DURATION> \
  --caption "<INSTAGRAM_CAPTION>" \
  --cta "Comment FREE for the direct setup guide!"
```
3. Commit and push to Git:
```bash
git add . && git commit -m "feat(epXX): complete Day XX video production & dashboard sync" && git push origin main
```

### Step 6: Publish Viewer-Facing Notion Guide & Update Library
1. Create the dedicated episode setup guide using `notion-create-pages`.
2. **STRICT RULE FOR NOTION SETUP GUIDES:**
   * Public Notion setup guides are strictly student/viewer-facing tutorials.
   * **INCLUDE:** Hero callout, "Explain Like I'm 5", step-by-step setup instructions (download links, install commands, code snippets), pro-tips, and completion callout.
   * **NEVER INCLUDE:**
     * ❌ Do NOT include the dialogue script (`The Harshith & Claude Dialogue`).
     * ❌ Do NOT include social copy / caption copy-paste boxes (`Social Copy & Instagram Reel Assets`).
     * *(Dialogue scripts and Instagram captions belong strictly in the local repo and the ReelVault database, never in public tutorial guides).*
3. Update the master **100 Days of Free AI — Guide Library** page (`40f7cd75-d68b-81bd-a8d6-e3bf4a7e4866`) to feature the new guide.
