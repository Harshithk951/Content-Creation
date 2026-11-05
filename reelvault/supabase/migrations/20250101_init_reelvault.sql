-- ==============================================================================
-- REELVAULT — 100 DAYS OF FREE AI
-- Supabase PostgreSQL Schema & Storage Setup
-- ==============================================================================

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
    cta TEXT DEFAULT 'Comment VOICE below and I will DM you the GitHub repo + setup guide!',
    topic_keywords TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'Ready' CHECK (status IN ('Draft', 'Ready', 'Published')),
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. INDEXES FOR PERFORMANCE & SEARCH
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_episode_number ON public.videos(episode_number);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_title_trgm ON public.videos USING gin (to_tsvector('english', title));

-- 4. AUTO UPDATE TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_videos_updated_at ON public.videos;
CREATE TRIGGER trigger_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. ROW LEVEL SECURITY (RLS) FOR VIDEOS TABLE
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own videos" ON public.videos;
CREATE POLICY "Users can view their own videos"
    ON public.videos FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own videos" ON public.videos;
CREATE POLICY "Users can insert their own videos"
    ON public.videos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own videos" ON public.videos;
CREATE POLICY "Users can update their own videos"
    ON public.videos FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own videos" ON public.videos;
CREATE POLICY "Users can delete their own videos"
    ON public.videos FOR DELETE
    USING (auth.uid() = user_id);

-- 6. SERIES EPISODES CALENDAR TABLE (100 Days Roadmap)
CREATE TABLE IF NOT EXISTS public.series_calendar (
    episode_number INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    planned_topic TEXT,
    tool_name TEXT,
    status TEXT NOT NULL DEFAULT 'Planned' CHECK (status IN ('Planned', 'Scripting', 'Video Ready', 'Published')),
    target_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.series_calendar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view series calendar" ON public.series_calendar;
CREATE POLICY "Authenticated users can view series calendar"
    ON public.series_calendar FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can update series calendar" ON public.series_calendar;
CREATE POLICY "Authenticated users can update series calendar"
    ON public.series_calendar FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. STORAGE BUCKETS SETUP
-- Create private 'reel-videos' bucket and public/authenticated 'reel-thumbnails' bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('reel-videos', 'reel-videos', false, 1073741824, ARRAY['video/mp4', 'video/quicktime', 'video/webm']),
    ('reel-thumbnails', 'reel-thumbnails', true, 20971520, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 8. STORAGE ROW LEVEL SECURITY POLICIES
-- reel-videos: Users can upload, read, update, delete only within their user_id/ folder
DROP POLICY IF EXISTS "Allow user upload to reel-videos" ON storage.objects;
CREATE POLICY "Allow user upload to reel-videos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'reel-videos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Allow user read from reel-videos" ON storage.objects;
CREATE POLICY "Allow user read from reel-videos"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'reel-videos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Allow user update in reel-videos" ON storage.objects;
CREATE POLICY "Allow user update in reel-videos"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'reel-videos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Allow user delete from reel-videos" ON storage.objects;
CREATE POLICY "Allow user delete from reel-videos"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'reel-videos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- reel-thumbnails policies
DROP POLICY IF EXISTS "Allow public read from reel-thumbnails" ON storage.objects;
CREATE POLICY "Allow public read from reel-thumbnails"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'reel-thumbnails');

DROP POLICY IF EXISTS "Allow user upload to reel-thumbnails" ON storage.objects;
CREATE POLICY "Allow user upload to reel-thumbnails"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'reel-thumbnails' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Allow user delete from reel-thumbnails" ON storage.objects;
CREATE POLICY "Allow user delete from reel-thumbnails"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'reel-thumbnails' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );
