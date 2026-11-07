"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Film,
  ArrowRight,
  Play,
  Download,
  Copy,
  Clock,
  HardDrive,
  Volume2,
  Monitor,
  Check,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { VideoRecord, VideoStats } from "@/types/video";
import { fetchVideos, fetchVideoStats, getVideoDownloadUrl, getVideoPlayUrl } from "@/lib/video-service";
import { StatsCards } from "@/components/stats-cards";
import { VideoCard } from "@/components/video-card";
import { VideoPreviewModal } from "@/components/video-preview-modal";
import { VideoEditModal } from "@/components/video-edit-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/components/toast";
import { formatBytes, formatDuration } from "@/lib/utils";

export default function OverviewPage() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [stats, setStats] = useState<VideoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>("");
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedComment, setCopiedComment] = useState(false);
  const [featuredVideoSrc, setFeaturedVideoSrc] = useState<string>("");

  // Modals state
  const [previewVideo, setPreviewVideo] = useState<VideoRecord | null>(null);
  const [editVideo, setEditVideo] = useState<VideoRecord | null>(null);
  const [deleteTargetVideo, setDeleteTargetVideo] = useState<VideoRecord | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [vList, vStats] = await Promise.all([
        fetchVideos({ sortBy: "newest" }),
        fetchVideoStats(),
      ]);
      setVideos(vList);
      setStats(vStats);

      // Default to highest episode number (e.g. Day 03)
      if (vList.length > 0) {
        const sorted = [...vList].sort((a, b) => b.episode_number - a.episode_number);
        const latest = sorted[0];
        setSelectedEpisodeId(latest.id);
        getVideoPlayUrl(latest.storage_path).then(setFeaturedVideoSrc).catch(() => {});
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Selected episode for the hero showcase
  const activeEpisode = videos.find((v) => v.id === selectedEpisodeId) || videos[0];

  const handleSelectEpisode = (video: VideoRecord) => {
    setSelectedEpisodeId(video.id);
    getVideoPlayUrl(video.storage_path).then(setFeaturedVideoSrc).catch(() => {});
  };

  const handleDownload = async () => {
    if (!activeEpisode) return;
    try {
      const { url, filename } = await getVideoDownloadUrl(activeEpisode);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started", filename);
    } catch {
      toast.error("Download failed", "Could not fetch video URL");
    }
  };

  const handleCopyCaption = () => {
    if (!activeEpisode?.caption) return;
    const fullText = activeEpisode.hashtags
      ? `${activeEpisode.caption}\n\n${activeEpisode.hashtags}`
      : activeEpisode.caption;
    navigator.clipboard.writeText(fullText);
    setCopiedCaption(true);
    toast.success("Caption copied", "Caption & hashtags ready for Instagram");
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyPinnedComment = () => {
    if (!activeEpisode?.pinned_comment) return;
    navigator.clipboard.writeText(activeEpisode.pinned_comment);
    setCopiedComment(true);
    toast.success("Pinned comment copied", "Ready to paste as 1st comment");
    setTimeout(() => setCopiedComment(false), 2000);
  };

  // Sort episodes descending for switcher pills
  const sortedEpisodes = [...videos].sort((a, b) => b.episode_number - a.episode_number);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Telemetry Stats Strip */}
      <StatsCards stats={stats} loading={loading} />

      {/* Featured Master Reel Showcase */}
      {activeEpisode && (
        <div className="relative p-1 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/[0.08] shadow-2xl overflow-hidden">
          {/* Ambient Radial Colored Glow */}
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-orange-500/10 blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-blue-500/10 blur-[90px] pointer-events-none" />

          <div className="relative rounded-[calc(1rem-2px)] sm:rounded-[calc(1.5rem-4px)] bg-[#090a0f]/95 p-5 sm:p-7 lg:p-8 backdrop-blur-xl">
            {/* Episode Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 border-b border-white/[0.06] scrollbar-none">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mr-2 shrink-0">
                Switch Episode:
              </span>
              {sortedEpisodes.map((ep) => {
                const isSelected = ep.id === activeEpisode.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelectEpisode(ep)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 min-h-[36px] ${
                      isSelected
                        ? "bg-white text-black font-semibold shadow-md"
                        : "bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.06]"
                    }`}
                  >
                    <span>DAY {ep.episode_number.toString().padStart(2, "0")}</span>
                    {ep.episode_number === 3 && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        isSelected ? "bg-orange-600 text-white" : "bg-orange-500/20 text-orange-400"
                      }`}>
                        Latest
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-8">
              {/* Left Column: Metadata & Instagram Station */}
              <div className="space-y-4 w-full flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase font-semibold px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                    Day {activeEpisode.episode_number.toString().padStart(2, "0")} Master
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="font-mono text-[10px] tracking-[0.16em] text-emerald-400 uppercase font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Status: {activeEpisode.status}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="font-mono text-[10px] text-zinc-400">
                    {activeEpisode.series_name}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[-0.03em] text-white leading-tight">
                  {activeEpisode.title}
                </h2>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal line-clamp-3">
                  {activeEpisode.description ||
                    "Standardized AI production series featuring Harshith & Claude co-hosts. 100% free tool workflows with zero subscriptions."}
                </p>

                {/* Technical Telemetry Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-mono tabular-nums">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Duration</span>
                    <span className="font-medium text-white mt-0.5 block">
                      {formatDuration(activeEpisode.duration_seconds)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Resolution</span>
                    <span className="font-medium text-white mt-0.5 block">
                      {activeEpisode.resolution || "1080×1920"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Target Audio</span>
                    <span className="font-medium text-emerald-400 mt-0.5 block">-14.0 LUFS</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">File Size</span>
                    <span className="font-medium text-white mt-0.5 block">
                      {formatBytes(activeEpisode.file_size)}
                    </span>
                  </div>
                </div>

                {/* Quick Instagram Publishing Station */}
                <div className="pt-2 space-y-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    Quick Publishing Station (1-Tap Copy)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={handleCopyCaption}
                      className="min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] active:bg-white/[0.1] text-xs font-medium text-zinc-200 border border-white/[0.07] transition-all"
                    >
                      <div className="flex items-center gap-2">
                        {copiedCaption ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-orange-400" />
                        )}
                        <span>{copiedCaption ? "Caption Copied!" : "Copy Instagram Caption"}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">1-Tap</span>
                    </button>

                    <button
                      onClick={handleCopyPinnedComment}
                      className="min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] active:bg-white/[0.1] text-xs font-medium text-zinc-200 border border-white/[0.07] transition-all"
                    >
                      <div className="flex items-center gap-2">
                        {copiedComment ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-cyan-400" />
                        )}
                        <span>{copiedComment ? "Comment Copied!" : "Copy Pinned Comment"}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">1-Tap</span>
                    </button>
                  </div>
                </div>

                {/* Master Action Buttons */}
                <div className="flex items-center gap-2.5 pt-2 flex-wrap">
                  <button
                    onClick={() => setPreviewVideo(activeEpisode)}
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 active:bg-zinc-300 text-xs font-semibold transition-colors shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Preview 9:16 Reel</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] active:bg-white/[0.14] text-white text-xs font-medium border border-white/[0.08] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-400" />
                    <span>Download Master MP4</span>
                  </button>

                  <a
                    href="https://app.notion.com/p/40f7cd75d68b81bda8d6e3bf4a7e4866"
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 text-xs font-medium border border-white/[0.06] transition-colors"
                  >
                    <span>Notion Guide</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                </div>
              </div>

              {/* Right Column: 9:16 Mini Theatre Card (Optimized for Mobile) */}
              <div className="w-full sm:w-auto flex justify-center shrink-0">
                <div
                  onClick={() => setPreviewVideo(activeEpisode)}
                  className="w-full max-w-[240px] sm:max-w-[260px] lg:w-64 aspect-[9/16] rounded-2xl bg-black border border-white/[0.1] overflow-hidden cursor-pointer relative group/preview shrink-0 shadow-2xl transition-transform hover:scale-[1.02]"
                >
                  {featuredVideoSrc ? (
                    <video
                      key={activeEpisode.id}
                      src={featuredVideoSrc}
                      preload="metadata"
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0d0e14] flex items-center justify-center text-zinc-600 font-mono text-xs">
                      1080 × 1920
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                  {/* Pulsing Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-13 h-13 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transition-transform group-hover/preview:scale-110">
                      <Play className="w-5 h-5 translate-x-0.5 fill-black" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[10px] font-mono tabular-nums text-zinc-300">
                    <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/[0.08]">
                      {formatDuration(activeEpisode.duration_seconds)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-orange-500 text-black font-bold uppercase">
                      DAY {activeEpisode.episode_number.toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Library Grid Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-white font-medium uppercase tracking-wider">Master Library</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-500">100 Days of Free AI</span>
          </div>

          <Link
            href="/library"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono uppercase tracking-wider font-medium group transition-colors min-h-[36px]"
          >
            <span>View All ({videos.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.slice(0, 4).map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPreview={(v) => setPreviewVideo(v)}
                onEdit={(v) => setEditVideo(v)}
                onDelete={(v) => setDeleteTargetVideo(v)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <VideoPreviewModal
        video={previewVideo}
        isOpen={Boolean(previewVideo)}
        onClose={() => setPreviewVideo(null)}
      />

      <VideoEditModal
        video={editVideo}
        isOpen={Boolean(editVideo)}
        onClose={() => setEditVideo(null)}
        onSuccess={() => loadData()}
      />

      <DeleteConfirmModal
        video={deleteTargetVideo}
        isOpen={Boolean(deleteTargetVideo)}
        onClose={() => setDeleteTargetVideo(null)}
        onSuccess={() => loadData()}
      />
    </div>
  );
}
