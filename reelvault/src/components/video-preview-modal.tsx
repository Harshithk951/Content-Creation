"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Copy,
  Check,
  RotateCcw,
  Clock,
  HardDrive,
  Monitor,
  Calendar,
  Sparkles,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoSrc, setVideoSrc] = useState<string>("/sample-ep01.mp4");
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

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        togglePlay();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPlaying]);

  if (!isOpen || !video) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const copyToClipboard = (text: string | null | undefined, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#101117] border border-[#232633] rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/60 hover:bg-black text-zinc-400 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: 9:16 Vertical Video Player */}
        <div
          ref={containerRef}
          className="lg:w-[420px] bg-black flex flex-col items-center justify-center relative p-4 group select-none shrink-0"
        >
          <div className="relative w-full max-w-[340px] aspect-[9/16] bg-[#07080a] rounded-xl overflow-hidden border border-[#222530] flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-cover"
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
            />

            {/* Play Overlay Button if paused */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-brand/90 hover:bg-brand text-white flex items-center justify-center shadow-glow transition-transform hover:scale-110 active:scale-95"
              >
                <Play className="w-7 h-7 translate-x-0.5 fill-white" />
              </button>
            )}

            {/* In-Player Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
              {/* Progress Slider */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.05"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-brand"
              />

              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <button onClick={togglePlay} className="p-1 hover:text-brand transition-colors">
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <div className="flex items-center gap-1 group/vol">
                    <button onClick={toggleMute} className="p-1 hover:text-brand transition-colors">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-14 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-brand"
                    />
                  </div>

                  <span className="font-mono text-[11px] text-zinc-300">
                    {formatDuration(currentTime)} / {formatDuration(duration || video.duration_seconds)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-700/60 text-[10px]">
                    {[0.5, 1, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`px-1 py-0.5 rounded ${
                          playbackRate === rate ? "bg-brand text-white font-bold" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>

                  <button onClick={toggleFullscreen} className="p-1 hover:text-brand transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Metadata, Captions, Actions */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto max-h-[92vh]">
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand/15 text-brand border border-brand/25">
                  Day {video.episode_number.toString().padStart(2, "0")} / 100
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    video.status === "Published"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                      : video.status === "Ready"
                      ? "bg-orange-500/15 text-orange-400 border border-orange-500/25"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                  }`}
                >
                  {video.status}
                </span>
                <span className="text-xs text-zinc-400">{video.series_name}</span>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
                {video.title}
              </h2>
              {video.description && (
                <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">{video.description}</p>
              )}
            </div>

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#14161f] border border-[#222533]">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                  <Clock className="w-3.5 h-3.5 text-brand" />
                  <span>Duration</span>
                </div>
                <p className="font-mono text-sm font-semibold text-white">
                  {formatDuration(video.duration_seconds)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#14161f] border border-[#222533]">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                  <Monitor className="w-3.5 h-3.5 text-brand" />
                  <span>Resolution</span>
                </div>
                <p className="font-mono text-sm font-semibold text-white">
                  {video.resolution || "1080 × 1920"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#14161f] border border-[#222533]">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                  <HardDrive className="w-3.5 h-3.5 text-brand" />
                  <span>File Size</span>
                </div>
                <p className="font-mono text-sm font-semibold text-white">
                  {formatBytes(video.file_size)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#14161f] border border-[#222533]">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5 text-brand" />
                  <span>Created</span>
                </div>
                <p className="text-xs font-semibold text-white truncate">
                  {formatDate(video.created_at)}
                </p>
              </div>
            </div>

            {/* Instagram Caption Block */}
            <div className="p-4 rounded-xl bg-[#13141c] border border-[#232635] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Instagram Caption
                </span>
                <button
                  onClick={() => copyToClipboard(video.caption, "Caption")}
                  className="flex items-center gap-1 text-xs text-brand hover:text-brand-light font-medium transition-colors"
                >
                  {copiedField === "Caption" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedField === "Caption" ? "Copied" : "Copy Caption"}
                </button>
              </div>
              <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto font-sans">
                {video.caption || "No caption provided."}
              </p>
            </div>

            {/* Hashtags Block */}
            <div className="p-4 rounded-xl bg-[#13141c] border border-[#232635] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Hashtags
                </span>
                <button
                  onClick={() => copyToClipboard(video.hashtags, "Hashtags")}
                  className="flex items-center gap-1 text-xs text-brand hover:text-brand-light font-medium transition-colors"
                >
                  {copiedField === "Hashtags" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedField === "Hashtags" ? "Copied" : "Copy Hashtags"}
                </button>
              </div>
              <p className="text-xs text-brand/90 font-mono leading-relaxed max-h-20 overflow-y-auto">
                {video.hashtags || "#100DaysOfFreeAI"}
              </p>
            </div>
          </div>

          {/* Bottom Actions: Direct Download */}
          <div className="pt-6 border-t border-[#1f222e] flex items-center justify-between gap-4 mt-6">
            <div className="text-xs text-zinc-500 font-mono truncate">
              {generateDownloadFilename(video.episode_number, video.title, "mp4")}
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-semibold transition-all duration-150 shadow-glow disabled:opacity-50 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? "Preparing..." : "Download Original MP4"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
