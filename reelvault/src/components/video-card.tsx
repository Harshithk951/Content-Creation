"use client";

import React, { useState, useRef } from "react";
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
  Sparkles,
} from "lucide-react";
import { VideoRecord } from "@/types/video";
import { formatBytes, formatDuration, formatDate, generateDownloadFilename } from "@/lib/utils";
import { getVideoDownloadUrl } from "@/lib/video-service";
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

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoPreviewRef.current) {
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
    toast.success("Caption copied", "Ready to paste directly on Instagram!");
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
      className="group relative rounded-2xl bg-gradient-to-b from-[#11131c] to-[#0c0e15] border border-[#1f2231] hover:border-[#33384d] transition-all duration-300 overflow-hidden shadow-subtle hover:shadow-card flex flex-col"
    >
      {/* 9:16 Thumbnail Container with Preview Trigger */}
      <div
        onClick={() => onPreview(video)}
        className="relative w-full aspect-[9/16] max-h-[380px] bg-[#07080b] overflow-hidden cursor-pointer flex items-center justify-center select-none"
      >
        {/* Poster / Video Element for Hover Play */}
        <video
          ref={videoPreviewRef}
          src={video.storage_path === "sample-ep01.mp4" ? "/sample-ep01.mp4" : undefined}
          poster={video.thumbnail_path || undefined}
          preload="metadata"
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Dark Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e15] via-black/25 to-black/70 group-hover:via-black/15 transition-colors" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-mono font-bold text-brand border border-brand/30 tracking-wider shadow-subtle">
            DAY {video.episode_number.toString().padStart(2, "0")}
          </span>

          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md shadow-subtle ${
              video.status === "Published"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/35"
                : video.status === "Ready"
                ? "bg-orange-500/20 text-orange-400 border border-orange-500/35"
                : "bg-zinc-800/80 text-zinc-400 border border-zinc-700/60"
            }`}
          >
            {video.status}
          </span>
        </div>

        {/* Center Hover Play Button */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 z-10 ${
            isHovering ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-brand/95 text-white flex items-center justify-center shadow-glow transform transition-transform group-hover:scale-105">
            <Play className="w-6 h-6 translate-x-0.5 fill-white" />
          </div>
        </div>

        {/* Bottom Thumbnail Overlay Tags */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-mono text-zinc-300 z-10">
          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md flex items-center gap-1.5 border border-white/10">
            <Clock className="w-3 h-3 text-brand" />
            {formatDuration(video.duration_seconds)}
          </span>
          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md flex items-center gap-1.5 border border-white/10">
            <HardDrive className="w-3 h-3 text-emerald-400" />
            {formatBytes(video.file_size)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-brand tracking-wider uppercase font-mono">
                Episode {video.episode_number.toString().padStart(2, "0")} • {video.series_name}
              </p>
              <h3
                onClick={() => onPreview(video)}
                className="font-bold text-sm text-white hover:text-brand-light transition-colors line-clamp-1 mt-0.5 cursor-pointer"
                title={video.title}
              >
                {video.title}
              </h3>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
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
                  <div className="absolute right-0 top-8 z-40 w-48 rounded-xl bg-[#141620] border border-[#272b3c] shadow-2xl py-1 text-xs animate-fade-in">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onPreview(video);
                      }}
                      className="w-full px-3 py-2 text-left text-zinc-300 hover:text-white hover:bg-[#1d2030] flex items-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 text-brand" />
                      Preview 9:16
                    </button>

                    <button
                      onClick={handleDownload}
                      className="w-full px-3 py-2 text-left text-zinc-300 hover:text-white hover:bg-[#1d2030] flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      Download Video
                    </button>

                    <button
                      onClick={handleCopyCaption}
                      className="w-full px-3 py-2 text-left text-zinc-300 hover:text-white hover:bg-[#1d2030] flex items-center gap-2"
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
                      className="w-full px-3 py-2 text-left text-zinc-300 hover:text-white hover:bg-[#1d2030] flex items-center gap-2"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-400" />
                      Edit Metadata
                    </button>

                    <div className="h-px bg-[#272b3c] my-1" />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onDelete(video);
                      }}
                      className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2"
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
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-2 font-mono">
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

        {/* Action Button Row */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#181a26]">
          <button
            onClick={() => onPreview(video)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#151824] hover:bg-[#1d2030] text-zinc-200 text-xs font-semibold transition-colors border border-[#242738]"
          >
            <Play className="w-3.5 h-3.5 text-brand" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-brand/10 hover:bg-brand/20 text-brand text-xs font-bold transition-colors border border-brand/25"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? "Saving..." : "Download"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
