import { createClient, isSupabaseConfigured } from "./supabase/client";
import { VideoRecord, VideoStats, VideoFilterOptions, SeriesEpisodePlan } from "@/types/video";
import { generateDownloadFilename, slugify } from "./utils";

// Real seed data based on the project's actual Episode 01: Kokoro 82M & Harshith/Claude series
const SAMPLE_LOCAL_EPISODE_1: VideoRecord = {
  id: "ep-01-local-kokoro",
  user_id: "demo-harshith-id",
  title: "Kokoro 82M — The $50 Voiceover Trap",
  episode_number: 1,
  series_name: "100 Days of Free AI",
  description: "Stop paying $40/mo for voiceovers. Kokoro 82M is an open-weight, Apache 2.0 text-to-speech model with 82M params that runs 100% locally on your laptop CPU.",
  storage_path: "sample-ep01.mp4",
  thumbnail_path: null,
  file_name: "100DaysOfFreeAI_Day01_Kokoro82M.mp4",
  file_size: 6490713, // 6.49 MB
  duration_seconds: 38.67,
  resolution: "1080 × 1920",
  mime_type: "video/mp4",
  caption: "Stop paying $40 a month for voiceover credits when you have 12 cents in your account. Kokoro 82M is an 82 million parameter open-weight TTS model that runs 100% locally on your laptop CPU in 2 seconds. Zero API keys. Zero subscriptions. Fully Apache-2.0 licensed.",
  hashtags: "#100DaysOfFreeAI #AI #OpenSource #Kokoro #DeveloperTools #TechReels #CodingLife #Nextjs #FreeAI",
  pinned_comment: "GitHub repository and local setup instructions in bio. Comment 'VOICE' and Claude will DM you the one-click script.",
  cta: "Comment 'VOICE' below to get the one-click local setup script!",
  topic_keywords: ["Kokoro 82M", "Text-to-Speech", "ONNX", "Local AI", "Harshith and Claude"],
  status: "Ready",
  scheduled_at: null,
  published_at: null,
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  updated_at: new Date().toISOString(),
};

const SAMPLE_LOCAL_EPISODE_2: VideoRecord = {
  id: "ep-02-local-flux",
  user_id: "dc04941d-2849-4fd1-9a82-4e9fd18a0296",
  title: "Midjourney vs Flux.1 Schnell — $120/yr Saved",
  episode_number: 2,
  series_name: "100 Days of Free AI",
  description: "Stop paying $120/year for Midjourney thumbnails. Flux.1 Schnell is an open-source 12B parameter image model that runs in your browser for $0.",
  storage_path: "https://tqtfkuhtvkevqhhmnkfv.supabase.co/storage/v1/object/public/reel-videos/day-02-midjourney-vs-flux.mp4",
  thumbnail_path: null,
  file_name: "100DaysOfFreeAI_Day02_MidjourneyVsFlux.mp4",
  file_size: 4728812,
  duration_seconds: 26.67,
  resolution: "1080 × 1920",
  mime_type: "video/mp4",
  caption: "DAY 02 / 100 - Stop paying for Midjourney.\n\nMidjourney = $10/month = $120/year\nFlux.1 Schnell = $0. Open-source. Same quality.\n\nPhotoreal, anime, 3D, and it actually writes text correctly in images.\nComment FREE and I'll send you the exact setup link.\n\nSave this for your next thumbnail.",
  hashtags: "#100daysoffreeai #midjourney #flux #opensource #aitools #freedevtools #studentdeveloper #thumbnaildesign",
  pinned_comment: "Setup: Go to Hugging Face > Search 'Flux.1 Schnell' > Type prompt > Download. No install needed. Want the direct link? Comment FREE",
  cta: "Comment FREE below for the instant direct setup guide!",
  topic_keywords: ["Flux.1 Schnell", "Midjourney", "Open Source AI", "Thumbnails", "Harshith and Claude"],
  status: "Ready",
  scheduled_at: null,
  published_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEFAULT_LOCAL_VIDEOS = [SAMPLE_LOCAL_EPISODE_2, SAMPLE_LOCAL_EPISODE_1];

// Re-export full 100-day series roadmap
export { INITIAL_SERIES_ROADMAP } from "./series-roadmap";

// Local storage cache key for client testing mode
const LOCAL_STORAGE_VIDEOS_KEY = "reelvault_local_videos_cache";

function getLocalStoredVideos(): VideoRecord[] {
  if (typeof window === "undefined") return DEFAULT_LOCAL_VIDEOS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VIDEOS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(DEFAULT_LOCAL_VIDEOS));
      return DEFAULT_LOCAL_VIDEOS;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.some((v: VideoRecord) => v.episode_number === 2)) {
      const merged = [SAMPLE_LOCAL_EPISODE_2, ...parsed];
      localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return DEFAULT_LOCAL_VIDEOS;
  }
}

function saveLocalStoredVideos(videos: VideoRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(videos));
  } catch {
    // ignore
  }
}

export async function fetchVideos(options?: VideoFilterOptions): Promise<VideoRecord[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    let query = supabase.from("videos").select("*");

    if (options?.status && options.status !== "All") {
      query = query.eq("status", options.status);
    }

    if (options?.searchQuery) {
      const q = `%${options.searchQuery}%`;
      query = query.or(`title.ilike.${q},caption.ilike.${q},hashtags.ilike.${q}`);
    }

    if (options?.sortBy === "oldest") {
      query = query.order("created_at", { ascending: true });
    } else if (options?.sortBy === "episode-asc") {
      query = query.order("episode_number", { ascending: true });
    } else if (options?.sortBy === "episode-desc") {
      query = query.order("episode_number", { ascending: false });
    } else if (options?.sortBy === "title") {
      query = query.order("title", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching videos from Supabase:", error);
      return getLocalStoredVideos();
    }
    return data as VideoRecord[];
  }

  // Fallback demo mode when Supabase credentials are pending
  let list = getLocalStoredVideos();

  if (options?.status && options.status !== "All") {
    list = list.filter((v) => v.status === options.status);
  }

  if (options?.searchQuery) {
    const term = options.searchQuery.toLowerCase();
    list = list.filter(
      (v) =>
        v.title.toLowerCase().includes(term) ||
        (v.caption && v.caption.toLowerCase().includes(term)) ||
        (v.hashtags && v.hashtags.toLowerCase().includes(term)) ||
        v.episode_number.toString() === term
    );
  }

  if (options?.sortBy === "oldest") {
    list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else if (options?.sortBy === "episode-asc") {
    list.sort((a, b) => a.episode_number - b.episode_number);
  } else if (options?.sortBy === "episode-desc") {
    list.sort((a, b) => b.episode_number - a.episode_number);
  } else if (options?.sortBy === "title") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return list;
}

export async function fetchVideoStats(): Promise<VideoStats> {
  const videos = await fetchVideos();

  return {
    totalVideos: videos.length,
    publishedReels: videos.filter((v) => v.status === "Published").length,
    draftVideos: videos.filter((v) => v.status === "Draft").length,
    readyVideos: videos.filter((v) => v.status === "Ready").length,
    totalStorageBytes: videos.reduce((acc, v) => acc + (Number(v.file_size) || 0), 0),
  };
}

export async function getVideoPlayUrl(storagePath: string): Promise<string> {
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://") || storagePath.startsWith("/")) {
    return storagePath;
  }

  if (storagePath === "sample-ep01.mp4") {
    return "/sample-ep01.mp4";
  }

  if (storagePath === "sample-ep02.mp4" || storagePath.includes("Flux") || storagePath.includes("Day02")) {
    return "/sample-ep02.mp4";
  }

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const cleanPath = storagePath.includes("reel-videos/")
      ? storagePath.split("reel-videos/")[1]
      : storagePath;

    const { data, error } = await supabase.storage
      .from("reel-videos")
      .createSignedUrl(cleanPath, 3600);

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  }

  return `/${storagePath}`;
}

export async function getVideoDownloadUrl(video: VideoRecord): Promise<{ url: string; filename: string }> {
  const filename = generateDownloadFilename(video.episode_number, video.title, "mp4");

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const cleanPath = video.storage_path.includes("reel-videos/")
      ? video.storage_path.split("reel-videos/")[1]
      : video.storage_path;

    if (!cleanPath.startsWith("http")) {
      const { data, error } = await supabase.storage
        .from("reel-videos")
        .createSignedUrl(cleanPath, 3600, {
          download: filename,
        });

      if (!error && data?.signedUrl) {
        return { url: data.signedUrl, filename };
      }
    }
  }

  // Fallback for sample file or direct public storage URL
  if (video.storage_path.startsWith("http://") || video.storage_path.startsWith("https://")) {
    return { url: video.storage_path, filename };
  }

  if (video.storage_path.includes("ep02") || video.episode_number === 2) {
    return { url: "/sample-ep02.mp4", filename };
  }

  return { url: "/sample-ep01.mp4", filename };
}

export async function uploadVideoFile(
  file: File,
  metadata: {
    title: string;
    episode_number: number;
    series_name?: string;
    description?: string;
    caption?: string;
    hashtags?: string;
    pinned_comment?: string;
    cta?: string;
    status?: "Draft" | "Ready" | "Published";
    duration_seconds?: number;
    resolution?: string;
  },
  thumbnailBlob?: Blob | null,
  onProgress?: (percent: number) => void
): Promise<VideoRecord> {
  const ext = file.name.split(".").pop() || "mp4";
  const slug = slugify(metadata.title || `day-${metadata.episode_number}`);
  const episodeStr = metadata.episode_number.toString().padStart(2, "0");
  const fileName = `100-days-of-free-ai-day-${episodeStr}-${slug}.${ext}`;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || "anonymous-user";
    const storagePath = `${userId}/100-days-of-free-ai/day-${episodeStr}-${slug}.${ext}`;

    // Upload video file
    onProgress?.(15);
    const { error: uploadError } = await supabase.storage
      .from("reel-videos")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload video to Supabase Storage: ${uploadError.message}`);
    }
    onProgress?.(70);

    let thumbnailPath: string | null = null;
    if (thumbnailBlob) {
      const thumbPath = `${userId}/100-days-of-free-ai/day-${episodeStr}-${slug}-thumb.jpg`;
      const { data: thumbData } = await supabase.storage
        .from("reel-thumbnails")
        .upload(thumbPath, thumbnailBlob, {
          cacheControl: "3600",
          upsert: true,
          contentType: "image/jpeg",
        });
      if (thumbData?.path) {
        thumbnailPath = thumbData.path;
      }
    }
    onProgress?.(85);

    // Insert metadata into PostgreSQL
    const newRecord: Partial<VideoRecord> = {
      user_id: userId,
      title: metadata.title,
      episode_number: Number(metadata.episode_number),
      series_name: metadata.series_name || "100 Days of Free AI",
      description: metadata.description || null,
      storage_path: storagePath,
      thumbnail_path: thumbnailPath,
      file_name: fileName,
      file_size: file.size,
      duration_seconds: metadata.duration_seconds || 38.67,
      resolution: metadata.resolution || "1080 × 1920",
      mime_type: file.type || "video/mp4",
      caption: metadata.caption || null,
      hashtags: metadata.hashtags || null,
      pinned_comment: metadata.pinned_comment || null,
      cta: metadata.cta || "Comment below for the free code & repo!",
      status: metadata.status || "Ready",
    };

    const { data: inserted, error: insertError } = await supabase
      .from("videos")
      .insert(newRecord)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to save video metadata: ${insertError.message}`);
    }
    onProgress?.(100);
    return inserted as VideoRecord;
  }

  // Demo mode fallback when Supabase keys are not set
  onProgress?.(50);
  await new Promise((r) => setTimeout(r, 600));
  onProgress?.(100);

  const localVideos = getLocalStoredVideos();
  const newRecord: VideoRecord = {
    id: `video-${Date.now()}`,
    user_id: "demo-user",
    title: metadata.title,
    episode_number: Number(metadata.episode_number),
    series_name: metadata.series_name || "100 Days of Free AI",
    description: metadata.description || null,
    storage_path: "/sample-ep01.mp4",
    thumbnail_path: null,
    file_name: fileName,
    file_size: file.size,
    duration_seconds: metadata.duration_seconds || 38.67,
    resolution: metadata.resolution || "1080 × 1920",
    mime_type: file.type || "video/mp4",
    caption: metadata.caption || null,
    hashtags: metadata.hashtags || null,
    pinned_comment: metadata.pinned_comment || null,
    cta: metadata.cta || null,
    topic_keywords: [],
    status: metadata.status || "Ready",
    scheduled_at: null,
    published_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localVideos.unshift(newRecord);
  saveLocalStoredVideos(localVideos);
  return newRecord;
}

export async function updateVideo(id: string, updates: Partial<VideoRecord>): Promise<VideoRecord> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("videos")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update video: ${error.message}`);
    }
    return data as VideoRecord;
  }

  const localVideos = getLocalStoredVideos();
  const index = localVideos.findIndex((v) => v.id === id);
  if (index !== -1) {
    localVideos[index] = { ...localVideos[index], ...updates, updated_at: new Date().toISOString() };
    saveLocalStoredVideos(localVideos);
    return localVideos[index];
  }
  throw new Error("Video not found");
}

export async function deleteVideo(id: string, storagePath: string, thumbnailPath?: string | null): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();

    // 1. Delete video from storage
    if (storagePath && !storagePath.startsWith("sample-")) {
      await supabase.storage.from("reel-videos").remove([storagePath]);
    }

    // 2. Delete thumbnail from storage
    if (thumbnailPath) {
      await supabase.storage.from("reel-thumbnails").remove([thumbnailPath]);
    }

    // 3. Delete row from postgres table
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) {
      throw new Error(`Failed to delete video: ${error.message}`);
    }
    return;
  }

  const localVideos = getLocalStoredVideos();
  const filtered = localVideos.filter((v) => v.id !== id);
  saveLocalStoredVideos(filtered);
}
