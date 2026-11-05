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
  pinned_comment: "🔗 GitHub repo & local setup script in bio! Comment 'VOICE' and Claude will DM you the one-click script.",
  cta: "Comment 'VOICE' below to get the one-click local setup script!",
  topic_keywords: ["Kokoro 82M", "Text-to-Speech", "ONNX", "Local AI", "Harshith and Claude"],
  status: "Ready",
  scheduled_at: null,
  published_at: null,
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  updated_at: new Date().toISOString(),
};

// Initial planned episodes roadmap for 100 Days of Free AI
export const INITIAL_SERIES_ROADMAP: SeriesEpisodePlan[] = [
  {
    episode_number: 1,
    title: "Kokoro 82M — The $50 Voiceover Trap",
    planned_topic: "Local, open-weight TTS on CPU without GPU or subscriptions",
    tool_name: "Kokoro-82M",
    status: "Video Ready",
    target_date: "2026-11-05",
    notes: "Verified Apache-2.0, ONNX runtime, MacBook Pro benchmark.",
  },
  {
    episode_number: 2,
    title: "Whisper.cpp — Free Infinite Captions",
    planned_topic: "C/C++ port of OpenAI Whisper with zero cloud cost & metal acceleration",
    tool_name: "whisper.cpp",
    status: "Scripting",
    target_date: "2026-11-06",
    notes: "Word-level transcription for vertical reels.",
  },
  {
    episode_number: 3,
    title: "Ollama + DeepSeek R1 — Local Reasoning Agent",
    planned_topic: "Running distilled reasoning models 100% private on consumer silicon",
    tool_name: "Ollama / DeepSeek-R1",
    status: "Planned",
    target_date: "2026-11-07",
    notes: "Chain-of-thought demonstration in the terminal.",
  },
  {
    episode_number: 4,
    title: "ComfyUI + FLUX Schnell — High-End Image Studio",
    planned_topic: "4-step photorealistic image generation for free",
    tool_name: "FLUX.1-schnell",
    status: "Planned",
    target_date: "2026-11-08",
    notes: "Direct node setup vs Midjourney $30/mo.",
  },
  {
    episode_number: 5,
    title: "Remotion — Code-Driven Video Generation",
    planned_topic: "Programmatic React video rendering for reels and shorts",
    tool_name: "Remotion",
    status: "Planned",
    target_date: "2026-11-09",
    notes: "Auto-caption shaders & keyframe physics.",
  },
  {
    episode_number: 6,
    title: "Supabase Local Dev Stack",
    planned_topic: "Spinning up Postgres, Auth, and S3 Storage in 1 docker command",
    tool_name: "Supabase CLI",
    status: "Planned",
    target_date: "2026-11-10",
  },
  {
    episode_number: 7,
    title: "Crawlee + Camoufox — Stealth Web Scraping for AI",
    planned_topic: "Collect real-time data for your LLMs without Cloudflare blocks",
    tool_name: "Crawlee",
    status: "Planned",
    target_date: "2026-11-11",
  },
  {
    episode_number: 8,
    title: "vLLM — Production High-Throughput Inference",
    planned_topic: "PagedAttention engine that makes your local API 10x faster",
    tool_name: "vLLM",
    status: "Planned",
    target_date: "2026-11-12",
  },
  {
    episode_number: 9,
    title: "LlamaIndex Workflows — Event-Driven Agents",
    planned_topic: "Async state machines without vendor lock-in",
    tool_name: "LlamaIndex",
    status: "Planned",
    target_date: "2026-11-13",
  },
  {
    episode_number: 10,
    title: "FFmpeg Magic for Creators",
    planned_topic: "10 one-liner bash scripts that replace Adobe Premiere",
    tool_name: "ffmpeg",
    status: "Planned",
    target_date: "2026-11-14",
  },
];

// Fill the rest up to 100 days
for (let i = 11; i <= 100; i++) {
  INITIAL_SERIES_ROADMAP.push({
    episode_number: i,
    title: `Episode ${i.toString().padStart(2, "0")} — Free AI Tool Deep Dive`,
    planned_topic: `Curated open-source tool & practical workflow #${i}`,
    tool_name: `Open AI Stack #${i}`,
    status: "Planned",
    target_date: null,
  });
}

// Local storage cache key for client testing mode
const LOCAL_STORAGE_VIDEOS_KEY = "reelvault_local_videos_cache";

function getLocalStoredVideos(): VideoRecord[] {
  if (typeof window === "undefined") return [SAMPLE_LOCAL_EPISODE_1];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VIDEOS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify([SAMPLE_LOCAL_EPISODE_1]));
      return [SAMPLE_LOCAL_EPISODE_1];
    }
    return JSON.parse(raw);
  } catch {
    return [SAMPLE_LOCAL_EPISODE_1];
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

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("reel-videos")
      .createSignedUrl(storagePath, 3600); // 1 hour token

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  }

  return `/sample-ep01.mp4`;
}

export async function getVideoDownloadUrl(video: VideoRecord): Promise<{ url: string; filename: string }> {
  const filename = generateDownloadFilename(video.episode_number, video.title, "mp4");

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("reel-videos")
      .createSignedUrl(video.storage_path, 3600, {
        download: filename,
      });

    if (!error && data?.signedUrl) {
      return { url: data.signedUrl, filename };
    }
  }

  // Fallback for sample file
  if (video.storage_path === "sample-ep01.mp4" || !video.storage_path.includes("/")) {
    return { url: "/sample-ep01.mp4", filename };
  }

  return { url: video.storage_path, filename };
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
