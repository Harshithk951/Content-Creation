import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { VideoRecord } from "../types";

const extra = Constants.expoConfig?.extra || {};

export const SUPABASE_URL =
  extra.supabaseUrl || "https://tqtfkuhtvkevqhhmnkfv.supabase.co";
export const SUPABASE_ANON_KEY =
  extra.supabaseAnonKey ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGZrdWh0dmtldnFoaG1ua2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDEyMDMsImV4cCI6MjA3MDgxNzIwM30.yXNC4ibZmHtO0o6BEttF7sBET4sF49Kr4vmGkHu3-C4";

export const NOTION_LIBRARY_URL =
  extra.notionGuideUrl ||
  "https://app.notion.com/p/40f7cd75d68b81bda8d6e3bf4a7e4866";

export const INSTAGRAM_URL =
  extra.instagramUrl || "https://instagram.com/harshith.claude";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fallback seed videos in case network is disconnected
export const FALLBACK_VIDEOS: VideoRecord[] = [
  {
    id: "ep-03",
    episode_number: 3,
    title: "Day 03 | Continue.dev - Free AI Coding Assistant",
    description:
      "GitHub Copilot costs $10/month. Continue.dev doesn't. Free open-source AI coding assistant inside VS Code and JetBrains.",
    series_name: "100 Days of Free AI",
    storage_path: "videos/sample-ep03.mp4",
    duration_seconds: 37.9,
    resolution: "1080x1920",
    file_size: 6472291,
    status: "published",
    caption:
      "Day 03 | Continue.dev - Free AI Coding Assistant\n\nGitHub Copilot costs $10/month. Continue.dev doesn't.\n\nContinue.dev is a free, open-source AI coding assistant. Works inside VS Code and JetBrains. Autocompletes code, explains functions, edits files.\n\nConnects to any free LLM - Ollama, DeepSeek, Llama. Runs locally. Your code stays on your machine. No subscription. No credit limit.\n\nFull setup in pinned comment.\n\nSave this for your next project.",
    hashtags:
      "#100daysoffreeai #continue #freecodingassistant #opensource #studentdeveloper #githubcopilot #deepseek",
    pinned_comment:
      "Setup:\n1. Open VS Code > Extensions\n2. Search 'Continue' > Install\n3. Open Continue > Select Model > Ollama / DeepSeek\n\nWorks on: VS Code, JetBrains, CPU + GPU\nOne line tip: Use Ollama + DeepSeek-Coder for fully offline coding.",
    cta: "Save this for your next project.",
    video_url: "https://tqtfkuhtvkevqhhmnkfv.supabase.co/storage/v1/object/public/videos/sample-ep03.mp4",
    created_at: new Date().toISOString(),
  },
  {
    id: "ep-02",
    episode_number: 2,
    title: "Day 02 | Midjourney vs Flux.1 Schnell",
    description:
      "Midjourney charges $10/mo. Flux.1 Schnell generates stunning photorealistic AI art for $0 on your machine or browser.",
    series_name: "100 Days of Free AI",
    storage_path: "videos/sample-ep02.mp4",
    duration_seconds: 40.5,
    resolution: "1080x1920",
    file_size: 4728812,
    status: "published",
    caption:
      "Day 02 | Midjourney vs Flux.1 Schnell - Studio Art for $0\n\nStop paying $10/month for Midjourney when Flux.1 gives you equal quality for free.\n\nRuns on Hugging Face, fal.ai, or locally with ComfyUI. Open-weights, no queue, zero subscription.",
    hashtags: "#100daysoffreeai #flux #midjourney #freeai #digitalart #openweights",
    pinned_comment:
      "Free Links:\n1. Hugging Face Spaces > Black Forest Labs Flux Schnell\n2. Fal.ai playground for fast browser generation\nFull guide in bio Notion library!",
    cta: "Comment FREE and I'll send you the prompt sheet.",
    video_url: "https://tqtfkuhtvkevqhhmnkfv.supabase.co/storage/v1/object/public/videos/sample-ep02.mp4",
    created_at: new Date().toISOString(),
  },
  {
    id: "ep-01",
    episode_number: 1,
    title: "Day 01 | Kokoro 82M: Studio Quality AI Voice for $0",
    description:
      "Commercial voice cloning costs $50/mo. Kokoro 82M runs locally on your laptop with American & British accents for ₹0.",
    series_name: "100 Days of Free AI",
    storage_path: "videos/sample-ep01.mp4",
    duration_seconds: 38.2,
    resolution: "1080x1920",
    file_size: 6490713,
    status: "published",
    caption:
      "Day 01 | Kokoro 82M: Studio Quality AI Voice for $0\n\nCommercial voice tools charge up to $50/mo. Kokoro 82M gives you studio grade synthetic voice generation for ₹0.\n\nTiny model under 100MB, runs in Python, zero GPU required.",
    hashtags: "#100daysoffreeai #kokoro82m #freeaivoice #tts #opensource",
    pinned_comment:
      "Quick Install:\npip install kokoro-onnx soundfile\nFull guide & audio samples in Notion link in bio!",
    cta: "Comment VOICE to get the Colab notebook.",
    video_url: "https://tqtfkuhtvkevqhhmnkfv.supabase.co/storage/v1/object/public/videos/sample-ep01.mp4",
    created_at: new Date().toISOString(),
  },
];

export async function fetchLiveEpisodes(): Promise<VideoRecord[]> {
  try {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("episode_number", { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Using fallback video data due to:", error?.message);
      return FALLBACK_VIDEOS;
    }

    return data.map((v) => ({
      ...v,
      video_url:
        v.storage_path && !v.storage_path.startsWith("http")
          ? `${SUPABASE_URL}/storage/v1/object/public/videos/${v.storage_path.replace(/^videos\//, "")}`
          : v.storage_path,
    }));
  } catch (e) {
    console.error("fetchLiveEpisodes error:", e);
    return FALLBACK_VIDEOS;
  }
}
