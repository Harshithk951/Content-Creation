# ReelVault — 100 Days of Free AI
### Personal Video Management Dashboard & Reel Studio

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Storage-emerald?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

**ReelVault** is a SaaS-grade personal video management dashboard tailored for the Instagram educational Reel series **100 Days of Free AI**, starring **Harshith** and **Claude**.

It provides permanent cloud storage for completed 9:16 vertical reels, in-browser vertical previews, instant original-quality downloads, 1-click Instagram caption & hashtag publishing packages, and a complete 100-day series roadmap.

---

## ✨ Core Features

1. **Video Library (Core Hub):**
   - 9:16 vertical video grid with live preview triggers.
   - Real-time metadata: Episode number, title, series name, duration (e.g. `38.67s`), resolution (`1080 × 1920`), file size (`6.49 MB`), and upload date.
   - Status indicators: `Ready`, `Published`, `Draft`.
   - 5 core actions per video card:
     1. **Preview Video** (opens 9:16 vertical player)
     2. **Download Video** (real, uncompressed direct download with meaningful filenames)
     3. **Copy Caption** (instant clipboard copy with feedback toast)
     4. **Edit Metadata** (inline editing of title, episode, description, hashtags, etc.)
     5. **Delete Video** (permanently cleans up both PostgreSQL and Supabase Storage)

2. **Direct Original Video Downloads:**
   - Downloads the original, uncompressed MP4 file stored in Supabase Storage.
   - Generates clean, human-readable file names:
     `100-days-of-free-ai-day-01-kokoro-82m.mp4`
   - Uses Supabase authenticated signed URLs with `Content-Disposition: attachment`.

3. **In-Browser 9:16 Vertical Video Player:**
   - Optimized for mobile and desktop 9:16 vertical reels.
   - Controls: Play/Pause, time scrub bar, volume + mute, fullscreen toggle.
   - Variable playback speed: `0.5x`, `1x`, `1.5x`, `2x`.
   - Side panel with full technical specs and Instagram caption / hashtag packages.

4. **Upload Video Studio:**
   - Drag-and-drop & file browser for `MP4`, `MOV`, and `WebM`.
   - In-browser duration and resolution detection.
   - Live upload progress percentage bar.
   - Saves original video file into private Supabase Storage bucket `reel-videos`.
   - Saves record to Supabase PostgreSQL `videos` table with RLS.

5. **Series Calendar (100 Days of Free AI):**
   - Complete 100-day timeline grid (Day 01 / 100 through Day 100 / 100).
   - Episode states: `Video Ready`, `Published`, `Scripting`, `Planned`.
   - Fast filtering and search across episode topics and tools.

6. **Captions & Hashtags Manager:**
   - Dedicated workspace for Instagram distribution.
   - Stores caption, hashtags, pinned comment, CTA, and target posting time.
   - **Copy Full Publishing Package** button for 1-click Instagram posting.

7. **SaaS Design System:**
   - Deep charcoal / near-black surfaces (`#090a0d`, `#111218`).
   - Vibrant creator orange accent (`#ff5a1f`) and emerald green secondary accent (`#10b981`).
   - Custom sleek scrollbars, glassmorphism cards, and responsive layouts.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Storage:** Supabase Storage (S3-compatible)
- **Auth:** Supabase Auth (`@supabase/ssr`)
- **Hosting:** Vercel

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd reelvault
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note:** If you start the app without Supabase credentials, ReelVault will automatically operate in **Local Demo Mode** using the bundled Episode 01 video asset (`sample-ep01.mp4`).

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Setup & SQL Migrations

### 1. Run the SQL Migration
Open your Supabase Project Dashboard → **SQL Editor** → **New Query**, paste the contents of `supabase/migrations/20250101_init_reelvault.sql` and run:

```sql
-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    episode_number INTEGER NOT NULL,
    series_name TEXT NOT NULL DEFAULT '100 Days of Free AI',
    description TEXT,
    storage_path TEXT NOT NULL,
    thumbnail_path TEXT,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    duration_seconds NUMERIC(8, 2) DEFAULT 0.00,
    resolution TEXT NOT NULL DEFAULT '1080x1920',
    mime_type TEXT NOT NULL DEFAULT 'video/mp4',
    caption TEXT,
    hashtags TEXT,
    pinned_comment TEXT,
    cta TEXT DEFAULT 'Comment below for the free code & repo!',
    topic_keywords TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'Ready' CHECK (status IN ('Draft', 'Ready', 'Published')),
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_episode_number ON public.videos(episode_number);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own videos"
    ON public.videos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own videos"
    ON public.videos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos"
    ON public.videos FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos"
    ON public.videos FOR DELETE
    USING (auth.uid() = user_id);
```

### 2. Storage Buckets & Policies
Under **Storage** in Supabase:
- Create private bucket: `reel-videos` (Max size: 1024 MB, allowed MIME types: `video/mp4, video/quicktime, video/webm`)
- Create public/authenticated bucket: `reel-thumbnails`

Run the storage RLS policies included in `supabase/migrations/20250101_init_reelvault.sql`:
```sql
CREATE POLICY "Allow user upload to reel-videos"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'reel-videos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Allow user read from reel-videos"
    ON storage.objects FOR SELECT TO authenticated
    USING (
        bucket_id = 'reel-videos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Allow user delete from reel-videos"
    ON storage.objects FOR DELETE TO authenticated
    USING (
        bucket_id = 'reel-videos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );
```

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/new), click **Add New...** → **Project** and select your repository.
3. If importing the full repository root, set **Root Directory** to `reelvault` (or leave as root since `vercel.json` is configured).
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-publishable-key`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-production-domain.vercel.app`
5. Click **Deploy**.

---

## 🎬 Seed Video: Episode 01
ReelVault is pre-linked with the real Episode 01 video:
- **Title:** Kokoro 82M — The $50 Voiceover Trap
- **Format:** 38.67s 9:16 Vertical HD Reel (1080 × 1920)
- **Hosts:** Harshith & Claude
- **Core Topic:** Open-weight Apache-2.0 TTS running 100% locally on CPU without API keys or subscriptions.
- **Original Asset:** `Exports/100DaysOfFreeAI_Day01_Kokoro82M.mp4`

---

## 🔒 Security
- All database queries and video storage operations enforce **Row Level Security (RLS)** using authenticated Supabase user tokens.
- Videos are stored in a private bucket; browser preview and direct downloads use expiring signed URLs.
- Service-role secrets are never exposed in client bundles.
