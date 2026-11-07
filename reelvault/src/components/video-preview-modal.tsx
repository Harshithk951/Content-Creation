"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Check,
  Clock,
  HardDrive,
  Monitor,
  Calendar,
} from "lucide-react";
import { VideoRecord } from "@/types/video";
import { formatBytes, formatDuration, formatDate, generateDownloadFilename } from "@/lib/utils";
import { getVideoPlayUrl, getVideoDownloadUrl } from "@/lib/video-service";
import { useToast } from "./toast";

interface VideoPreviewModalProps {
  video: VideoRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (video: VideoRecord) => void;
}

export function VideoPreviewModal({ video, isOpen, onClose }: VideoPreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!video || !isOpen) return;

    let active = true;
    getVideoPlayUrl(video.storage_path).then((url) => {
      if (active) {
        setVideoSrc(url);
      }
    });

    return () => {
      active = false;
    };
  }, [video, isOpen]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(false);
    }
  }, [isOpen, videoSrc]);

  if (!isOpen || !video) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const copyToClipboard = (text: string | null, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied`, "Ready to paste on Instagram");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const { url, filename } = await getVideoDownloadUrl(video);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started", filename);
    } catch {
      toast.error("Download failed", "Could not fetch signed video URL");
    } finally {
      setIsDownloading(false);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Top-Right Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors shadow-xs"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Clean Instagram Reels Video Player (No Unnecessary Buttons) */}
        <div className="lg:w-[400px] bg-stone-950 flex flex-col items-center justify-center relative p-4 sm:p-6 select-none shrink-0">
          <div
            onClick={togglePlay}
            className="relative w-full max-w-[300px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center cursor-pointer shadow-2xl group"
          >
            {videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-cover"
                playsInline
                loop
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              <div className="text-stone-500 font-mono text-xs">1080 × 1920</div>
            )}

            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* Minimalist Floating Mute/Unmute Pill in Top-Right */}
            <button
              onClick={toggleMute}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15 flex items-center justify-center hover:bg-black/80 transition-all shadow-md"
              title={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-orange-400" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            {/* Clean Center Play Icon When Paused */}
            {!isPlaying && (
              <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl pointer-events-none transition-transform group-hover:scale-110">
                <Play className="w-6 h-6 translate-x-0.5 fill-white" />
              </div>
            )}

            {/* Minimalist Bottom Scrubber Bar (Edge-to-Edge, Non-Intrusive) */}
            <div
              onClick={handleSeek}
              className="absolute bottom-0 inset-x-0 h-3 bg-black/30 flex items-end cursor-pointer group/bar"
            >
              <div className="w-full h-1 group-hover/bar:h-2 bg-white/20 transition-all relative">
                <div
                  className="h-full bg-orange-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Metadata, Captions, Actions */}
        <div className="flex-1 p-5 sm:p-7 lg:p-8 flex flex-col justify-between overflow-y-auto max-h-[92vh]">
          <div className="space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[10px] font-mono tracking-wider uppercase font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-200">
                  Day {video.episode_number.toString().padStart(2, "0")} / 100
                </span>
                <span
                  className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md border font-semibold ${
                    video.status === "Published"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : video.status === "Ready"
                      ? "bg-orange-100 text-orange-800 border-orange-200"
                      : "bg-stone-100 text-stone-600 border-stone-200"
                  }`}
                >
                  {video.status}
                </span>
                <span className="text-xs text-stone-500 font-mono">• {video.series_name}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-[-0.02em] leading-snug">
                {video.title}
              </h2>
              {video.description && (
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed font-normal">{video.description}</p>
              )}
            </div>

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-500 text-[10px] uppercase font-mono tracking-wider mb-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>Duration</span>
                </div>
                <p className="font-mono tabular-nums text-xs font-bold text-stone-900">
                  {formatDuration(video.duration_seconds)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-500 text-[10px] uppercase font-mono tracking-wider mb-1">
                  <Monitor className="w-3 h-3 text-stone-400" />
                  <span>Resolution</span>
                </div>
                <p className="font-mono tabular-nums text-xs font-bold text-stone-900">
                  {video.resolution || "1080 × 1920"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-500 text-[10px] uppercase font-mono tracking-wider mb-1">
                  <HardDrive className="w-3 h-3 text-stone-400" />
                  <span>File Size</span>
                </div>
                <p className="font-mono tabular-nums text-xs font-bold text-stone-900">
                  {formatBytes(video.file_size)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-500 text-[10px] uppercase font-mono tracking-wider mb-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  <span>Created</span>
                </div>
                <p className="font-mono tabular-nums text-xs font-bold text-stone-900 truncate">
                  {formatDate(video.created_at)}
                </p>
              </div>
            </div>

            {/* Instagram Caption Block */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-stone-600 font-bold">
                  Instagram Caption
                </span>
                <button
                  onClick={() => copyToClipboard(video.caption, "Caption")}
                  className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 font-mono transition-colors font-semibold"
                >
                  {copiedField === "Caption" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === "Caption" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto font-sans">
                {video.caption || "No caption provided."}
              </p>
            </div>

            {/* Hashtags Block */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-stone-600 font-bold">
                  Hashtags
                </span>
                <button
                  onClick={() => copyToClipboard(video.hashtags, "Hashtags")}
                  className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 font-mono transition-colors font-semibold"
                >
                  {copiedField === "Hashtags" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === "Hashtags" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-xs text-stone-600 font-mono leading-relaxed max-h-20 overflow-y-auto">
                {video.hashtags || "#100DaysOfFreeAI"}
              </p>
            </div>
          </div>

          {/* Bottom Actions: Direct Download */}
          <div className="pt-5 border-t border-stone-200 flex items-center justify-between gap-4 mt-6">
            <div className="text-[11px] text-stone-500 font-mono truncate">
              {generateDownloadFilename(video.episode_number, video.title, "mp4")}
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold transition-colors disabled:opacity-50 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? "Preparing..." : "Download Master MP4"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
