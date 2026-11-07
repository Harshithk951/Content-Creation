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
    toast.success("Caption copied", "Ready to paste on Instagram");
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
      className="group relative rounded-2xl bg-white border border-stone-200/90 hover:border-stone-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col shadow-xs"
    >
      {/* 9:16 Video Thumbnail Container */}
      <div
        onClick={() => onPreview(video)}
        className="relative w-full aspect-[9/16] max-h-[380px] bg-stone-950 overflow-hidden cursor-pointer flex items-center justify-center select-none"
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
          <div className="w-full h-full bg-stone-900 flex items-center justify-center text-stone-400 font-mono text-xs">
            1080 × 1920
          </div>
        )}

        {/* Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-mono tracking-[0.16em] uppercase font-bold text-orange-400 border border-white/20 shadow-sm">
            DAY {video.episode_number.toString().padStart(2, "0")}
          </span>

          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono tracking-wider uppercase backdrop-blur-md border font-semibold ${
              video.status === "Published"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                : video.status === "Ready"
                ? "bg-orange-500/20 text-orange-300 border-orange-400/40"
                : "bg-white/20 text-stone-200 border-white/30"
            }`}
          >
            {video.status}
          </span>
        </div>

        {/* Center Hover Play Button */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-200 z-10 ${
            isHovering ? "opacity-100 scale-100" : "opacity-80 md:opacity-0 scale-95"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-xl transition-transform hover:scale-110">
            <Play className="w-5 h-5 translate-x-0.5 fill-stone-900" />
          </div>
        </div>

        {/* Bottom Thumbnail Overlay Tags */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[10px] font-mono tabular-nums text-white z-10">
          <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md flex items-center gap-1.5 border border-white/10">
            <Clock className="w-3 h-3 text-stone-300" />
            {formatDuration(video.duration_seconds)}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md flex items-center gap-1.5 border border-white/10">
            <HardDrive className="w-3 h-3 text-stone-300" />
            {formatBytes(video.file_size)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-stone-500 block">
                Episode {video.episode_number.toString().padStart(2, "0")} • {video.series_name}
              </span>
              <h3
                onClick={() => onPreview(video)}
                className="font-bold text-sm text-stone-900 hover:text-orange-600 transition-colors line-clamp-1 mt-0.5 cursor-pointer tracking-tight"
                title={video.title}
              >
                {video.title}
              </h3>
            </div>

            {/* Actions Menu Toggle */}
            <div className="relative shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                title="Options"
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
                  <div className="absolute right-0 top-9 z-40 w-48 rounded-2xl bg-white border border-stone-200 shadow-2xl p-1 text-xs animate-fade-in">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onPreview(video);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl text-left text-stone-700 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-2.5 min-h-[40px]"
                    >
                      <Play className="w-3.5 h-3.5 text-stone-500" />
                      Preview 9:16
                    </button>

                    <button
                      onClick={handleDownload}
                      className="w-full px-3 py-2.5 rounded-xl text-left text-stone-700 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-2.5 min-h-[40px]"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      Download MP4
                    </button>

                    <button
                      onClick={handleCopyCaption}
                      className="w-full px-3 py-2.5 rounded-xl text-left text-stone-700 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-2.5 min-h-[40px]"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-600" />
                      Copy Caption
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onEdit(video);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl text-left text-stone-700 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-2.5 min-h-[40px]"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-600" />
                      Edit Metadata
                    </button>

                    <div className="h-px bg-stone-200 my-1" />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onDelete(video);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl text-left text-red-600 hover:bg-red-50 flex items-center gap-2.5 min-h-[40px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Reel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-2 font-mono tabular-nums">
            <span className="flex items-center gap-1 text-stone-600">
              <Monitor className="w-3 h-3 text-stone-400" />
              {video.resolution || "1080 × 1920"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-stone-600">
              <Calendar className="w-3 h-3 text-stone-400" />
              {formatDate(video.created_at)}
            </span>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-stone-200/80">
          <button
            onClick={() => onPreview(video)}
            className="min-h-[42px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors border border-stone-200"
          >
            <Play className="w-3.5 h-3.5 fill-stone-800 text-stone-800" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="min-h-[42px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? "Saving..." : "Download"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
