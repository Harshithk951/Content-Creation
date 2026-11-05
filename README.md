# Content Creation Studio — 100 Days of Free AI
### Featuring Harshith & Claude • Local Remotion Pipeline + ReelVault Cloud Dashboard

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Storage-emerald?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Remotion](https://img.shields.io/badge/Remotion-4.0-blue?logo=react)](https://remotion.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

A complete, production-ready content creation and distribution ecosystem for the educational Instagram Reel series **100 Days of Free AI**, starring **Harshith** and **Claude**.

This repository contains both:
1. **`reelvault/`** — A premium dark-mode Next.js 15 SaaS dashboard for permanent video storage, vertical 9:16 browser previews, instant uncompressed downloads, and 1-click Instagram caption & hashtag packages.
2. **`reel-studio/` & Local Toolchain** — An automated, local pipeline using Remotion, whisper.cpp, and ffmpeg for generating 1080×1920 (9:16, 30fps) reels with animated word-by-word captions.

---

## 🏛️ Architecture Overview

```text
Content-Creation/
├── reelvault/                       # Next.js 15 + Supabase Studio Dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/         # Overview, Library, Upload, Calendar, Captions, Settings
│   │   │   ├── (auth)/              # Supabase Auth: Login, Signup, Forgot Password
│   │   │   └── api/                 # Direct downloads & video REST endpoints
│   │   ├── components/              # 9:16 Video Player, Cards, Modals, Stats, Toast
│   │   └── lib/                     # Supabase SSR client, data access, utilities
│   └── supabase/
│       └── migrations/              # PostgreSQL schema, RLS & Storage policies
├── reel-studio/                     # Remotion React programmatic video project
├── Exports/                         # Rendered 1080×1920 MP4 outputs (Day 01 Kokoro-82M)
├── series/                          # Series Bible, Character Profiles & Source Verification
├── make-reel.sh                     # Automated end-to-end video render script
└── vercel.json                      # Vercel deployment configuration
```

---

## ⚡ ReelVault Dashboard Features

- **Video Library:** Grid-based library with 9:16 vertical cards, episode badges, status tags (`Draft`, `Ready`, `Published`), duration, file size, and upload dates.
- **Direct Video Downloads:** 1-click uncompressed MP4 downloads with meaningful filenames (e.g. `100-days-of-free-ai-day-01-kokoro-82m.mp4`).
- **In-Browser 9:16 Vertical Video Player:** Scrub slider, variable playback speed (`0.5x` to `2x`), volume/mute, fullscreen, and metadata inspector.
- **Upload Studio:** Drag-and-drop video upload with automatic duration and resolution detection, progress percentage, and cloud storage upload.
- **100-Day Series Calendar:** Interactive timeline tracking Day 01 / 100 through Day 100 / 100 with status indicators and quick actions.
- **Captions & Hashtags Manager:** Dedicated Instagram publishing toolkit with 1-click **Copy Full Publishing Package** (caption + hashtags + pinned comment + CTA).
- **Security:** Built on Supabase Auth with Row Level Security (RLS) policies protecting video records and private storage buckets.

---

## 🚀 Quick Start — Running ReelVault

### 1. Install & Run Dashboard
```bash
# From repository root
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

ReelVault automatically boots in **Local Demo Mode** pre-loaded with Episode 01 (**Kokoro 82M — The $50 Voiceover Trap**) even before configuring Supabase credentials.

### 2. Configure Supabase (Optional for Cloud Persistence)
Copy the environment template:
```bash
cp reelvault/.env.example reelvault/.env.local
```
Add your credentials in `reelvault/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Execute `reelvault/supabase/migrations/20250101_init_reelvault.sql` in your Supabase SQL Editor to set up:
- Table `public.videos` with RLS policies
- Table `public.series_calendar`
- Storage buckets `reel-videos` (private) and `reel-thumbnails`

---

## 🎬 Local Video Generation Toolchain

| Tool | Version | Role |
| :--- | :--- | :--- |
| **Node.js** | `v25.2.1` | JavaScript / TypeScript runtime |
| **Remotion** | `4.0.540` | Programmatic React video engine in `./reel-studio` |
| **ffmpeg** | `8.1.2` | Video cropping, 9:16 mastering, audio loudness normalization |
| **whisper.cpp**| `1.9.1` | Local word-level speech-to-text |
| **Kokoro-82M** | `ONNX` | Local Apache-2.0 speech synthesis |

### Render a Reel with Remotion:
```bash
cd reel-studio
npm run build
```

---

## 🌐 Vercel Deployment

1. Push this repository to GitHub: `https://github.com/Harshithk951/Content-Creation`
2. Import the repository in [Vercel](https://vercel.com/new).
3. Set **Root Directory** to `reelvault` (or leave default root as `vercel.json` is pre-configured).
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.
