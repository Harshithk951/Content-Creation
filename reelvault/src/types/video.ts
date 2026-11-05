export type VideoStatus = "Draft" | "Ready" | "Published";

export interface VideoRecord {
  id: string;
  user_id: string;
  title: string;
  episode_number: number;
  series_name: string;
  description: string | null;
  storage_path: string;
  thumbnail_path: string | null;
  file_name: string;
  file_size: number;
  duration_seconds: number | null;
  resolution: string;
  mime_type: string;
  caption: string | null;
  hashtags: string | null;
  pinned_comment: string | null;
  cta: string | null;
  topic_keywords: string[] | null;
  status: VideoStatus;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VideoStats {
  totalVideos: number;
  publishedReels: number;
  draftVideos: number;
  readyVideos: number;
  totalStorageBytes: number;
}

export interface SeriesEpisodePlan {
  episode_number: number;
  title: string;
  planned_topic?: string;
  tool_name?: string;
  status: "Planned" | "Scripting" | "Video Ready" | "Published";
  target_date?: string | null;
  notes?: string | null;
}

export interface VideoFilterOptions {
  searchQuery?: string;
  status?: VideoStatus | "All";
  sortBy?: "newest" | "oldest" | "episode-asc" | "episode-desc" | "title";
}
