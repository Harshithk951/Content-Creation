export interface VideoRecord {
  id: string;
  title: string;
  description?: string;
  episode_number: number;
  series_name: string;
  storage_path: string;
  duration_seconds: number;
  resolution?: string;
  file_size?: number;
  status: "draft" | "rendered" | "published";
  caption?: string;
  hashtags?: string;
  pinned_comment?: string;
  cta?: string;
  video_url?: string;
  created_at: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  episodes: string;
  description: string;
  status: "active" | "upcoming" | "completed";
  topics: {
    day: number;
    title: string;
    tool: string;
    costSaved: string;
    completed: boolean;
  }[];
}
