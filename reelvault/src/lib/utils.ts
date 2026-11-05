import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return "--:--";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.round((seconds - Math.floor(seconds)) * 100);
  
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Not set";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatEpisode(num: number): string {
  return `Day ${num.toString().padStart(2, "0")} / 100`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateDownloadFilename(
  episodeNumber: number,
  title: string,
  ext: string = "mp4"
): string {
  const cleanExt = ext.replace(/^\./, "");
  const ep = episodeNumber.toString().padStart(2, "0");
  const slug = slugify(title);
  return `100-days-of-free-ai-day-${ep}-${slug}.${cleanExt}`;
}
