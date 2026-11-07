"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Download,
  Copy,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  HardDrive,
  Monitor,
  Check,
  Calendar,
} from "lucide-react";
import { VideoRecord } from "@/types/video";
import { formatBytes, formatDuration, formatDate } from "@/lib/utils";
import { getVideoPlayUrl, getVideoDownloadUrl } from "@/lib/video-service";
import { useToast } from "./toast";

interface VideoCardProps {
  video: VideoRecord;
  onPreview: (video: VideoRecord) => void;
  onEdit: (video: VideoRecord) => void;
  onDelete: (video: VideoRecord) => void;
}

export function VideoCard({ video, onPreview, onEdit, onDelete }: VideoCardProps) {
  const { toast } = useToast();
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("");

  useEffect(() => {
    getVideoPlayUrl(video.storage_path).then(setVideoSrc).catch(() => {});
  }, [video.storage_path]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoPreviewRef.current && videoSrc) {
      videoPreviewRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoPreviewRef.current) {
      videoPreviewRef.current.pause();
      videoPreviewRef.current.currentTime = 0;
    }
  };

  const handleCopyCaption = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video.caption) return;
    navigator.clipboard.writeText(video.caption);
    setCopiedCaption(true);
    toast.success("Caption copied", "Ready to paste on Instagram");
    setTimeout(() => setCopiedCaption(false), 2000);
    setMenuOpen(false);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloading(true);
      const { url, filename } = await getVideoDownloadUrl(video);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started", filename);
    } catch {
      toast.error("Download failed", "Could not fetch original video file");
    } finally {
      setDownloading(false);
      setMenuOpen(false);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative p-1 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.16] hover:bg-white/[0.04] transition-all duration-300 shadow-lg shadow-black/40 flex flex-col"
    >
      <div className="rounded-[calc(1rem-2px)] bg-[#0b0c10] overflow-hidden flex flex-col flex-1">
        {/* 9:16 Video Thumbnail Container */}
        <div
          onClick={() => onPreview(video)}
          className="relative w-full aspect-[9/16] max-h-[380px] bg-black overflow-hidden cursor-pointer flex items-center justify-center select-none"
        >
          {videoSrc ? (
            <video
              ref={videoPreviewRef}
              src={videoSrc}
              poster={video.thumbnail_path || undefined}
              preload="metadata"
              muted
              loop
              playsInline
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#0d0e14] flex items-center justify-center text-zinc-600 font-mono text-xs">
              1080 × 1920
            </div>
          )}

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-black/60 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-mono tracking-[0.16em] uppercase font-bold text-orange-400 border border-orange-500/20 shadow-sm">
              DAY {video.episode_number.toString().padStart(2, "0")}
            </span>

            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono tracking-wider uppercase backdrop-blur-md border font-medium ${
                video.status === "Published"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : video.status === "Ready"
                  ? "bg-orange-500/15 text-orange-300 border-orange-500/30"
                  : "bg-white/[0.06] text-zinc-400 border-white/[0.1]"
              }`}
            >
              {video.status}
            </span>
          </div>

          {/* Center Play Button Overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-200 z-10 ${
              isHovering ? "opacity-100 scale-100" : "opacity-80 md:opacity-0 scale-95"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl shadow-black/60 transition-transform hover:scale-110">
              <Play className="w-5 h-5 translate-x-0.5 fill-black" />
            </div>
          </div>

          {/* Bottom Thumbnail Telemetry Overlay */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[10px] font-mono tabular-nums text-zinc-300 z-10">
            <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md flex items-center gap-1.5 border border-white/[0.08]">
              <Clock className="w-3 h-3 text-zinc-400" />
              {formatDuration(video.duration_seconds)}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md flex items-center gap-1.5 border border-white/[0.08]">
              <HardDrive className="w-3 h-3 text-zinc-400" />
              {formatBytes(video.file_size)}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-zinc-500 block">
                  Episode {video.episode_number.toString().padStart(2, "0")} • {video.series_name}
                </span>
                <h3
                  onClick={() => onPreview(video)}
                  className="font-medium text-xs sm:text-sm text-white hover:text-orange-400 transition-colors line-clamp-1 mt-0.5 cursor-pointer tracking-tight"
                  title={video.title}
                >
                  {video.title}
                </h3>
              </div>

              {/* Options Menu Toggle */}
              <div className="relative shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(!menuOpen);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                      }}
                    />
                    <div className="absolute right-0 top-9 z-40 w-48 rounded-2xl bg-[#12131a] border border-white/[0.12] shadow-2xl p-1 text-xs backdrop-blur-xl animate-fade-in">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          onPreview(video);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/[0.08] flex items-center gap-2.5 min-h-[40px]"
                      >
                        <Play className="w-3.5 h-3.5 text-zinc-400" />
                        Preview 9:16
                      </button>

                      <button
                        onClick={handleDownload}
                        className="w-full px-3 py-2.5 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/[0.08] flex items-center gap-2.5 min-h-[40px]"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        Download MP4
                      </button>

                      <button
                        onClick={handleCopyCaption}
                        className="w-full px-3 py-2.5 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/[0.08] flex items-center gap-2.5 min-h-[40px]"
                      >
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        Copy Caption
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          onEdit(video);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/[0.08] flex items-center gap-2.5 min-h-[40px]"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-400" />
                        Edit Metadata
                      </button>

                      <div className="h-px bg-white/[0.08] my-1" />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          onDelete(video);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 min-h-[40px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Reel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Technical Specs Footer */}
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-2 font-mono tabular-nums">
              <span className="flex items-center gap-1 text-zinc-400">
                <Monitor className="w-3 h-3 text-zinc-500" />
                {video.resolution || "1080 × 1920"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-zinc-400">
                <Calendar className="w-3 h-3 text-zinc-500" />
                {formatDate(video.created_at)}
              </span>
            </div>
          </div>

          {/* Action Button Row - 44px touch targets on mobile */}
          <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/[0.06]">
            <button
              onClick={() => onPreview(video)}
              className="min-h-[40px] sm:min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] active:bg-white/[0.14] text-zinc-200 text-xs font-medium transition-colors border border-white/[0.08]"
            >
              <Play className="w-3.5 h-3.5 text-zinc-300 fill-zinc-300" />
              <span>Preview</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="min-h-[40px] sm:min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 active:bg-zinc-300 text-xs font-semibold transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>{downloading ? "Saving..." : "Download"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
