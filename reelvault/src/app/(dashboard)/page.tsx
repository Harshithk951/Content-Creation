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
  Check,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  DollarSign,
  ChevronRight,
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

export default function HomePage() {
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

      // Default to Day 03 (latest)
      if (vList.length > 0) {
        const sorted = [...vList].sort((a, b) => b.episode_number - a.episode_number);
        const latest = sorted[0];
        setSelectedEpisodeId(latest.id);
        getVideoPlayUrl(latest.storage_path).then(setFeaturedVideoSrc).catch(() => {});
      }
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    toast.success("Caption copied", "Caption & hashtags ready to paste on Instagram");
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyPinnedComment = () => {
    if (!activeEpisode?.pinned_comment) return;
    navigator.clipboard.writeText(activeEpisode.pinned_comment);
    setCopiedComment(true);
    toast.success("Pinned comment copied", "Ready to paste as your 1st comment");
    setTimeout(() => setCopiedComment(false), 2000);
  };

  const sortedEpisodes = [...videos].sort((a, b) => b.episode_number - a.episode_number);

  return (
    <div className="space-y-10 sm:space-y-16 animate-fade-in pb-16">
      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. EDITORIAL HERO SECTION                                 */}
      {/* ───────────────────────────────────────────────────────── */}
      <section className="relative pt-4 sm:pt-6 pb-2 text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-semibold font-mono tracking-wide shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>SEASON 01 • 100 DAYS OF FREE AI</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.12]">
          Build smarter with AI. <br className="hidden sm:inline" />
          <span className="text-orange-600">Zero subscriptions required.</span>
        </h1>

        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
          A daily educational video series hosted by <strong className="text-stone-900">Harshith & Claude</strong>.
          We replace expensive \$10–\$50/mo tools with 100% free, open-source workflows you can run on your own laptop.
        </p>

        {/* Dual Co-Hosts Pill Bar */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 pt-2 flex-wrap text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200/90 shadow-xs">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-blue-500/50">
              <img src="/avatars/harshith_official.jpg" alt="Harshith" className="w-full h-full object-cover" />
            </div>
            <span className="text-stone-700 font-medium">Harshith Kumar (Creator)</span>
          </div>

          <div className="text-stone-400 font-mono">+</div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200/90 shadow-xs">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-orange-500/50">
              <img src="/avatars/claude_official.jpg" alt="Claude" className="w-full h-full object-cover" />
            </div>
            <span className="text-stone-700 font-medium">Claude (AI Co-Host)</span>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. KEY STATS STRIP                                        */}
      {/* ───────────────────────────────────────────────────────── */}
      <StatsCards stats={stats} loading={loading} />

      {/* ───────────────────────────────────────────────────────── */}
      {/* 3. FEATURED MASTER REEL STAGE                             */}
      {/* ───────────────────────────────────────────────────────── */}
      {activeEpisode && (
        <section className="relative rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
          {/* Subtle Ambient Warm Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-100/40 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl pointer-events-none" />

          <div className="relative">
            {/* Episode Switcher Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-stone-200/80 scrollbar-none">
              <span className="font-mono text-xs uppercase tracking-wider text-stone-500 mr-2 shrink-0 font-semibold">
                Select Episode:
              </span>
              {sortedEpisodes.map((ep) => {
                const isSelected = ep.id === activeEpisode.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelectEpisode(ep)}
                    className={`shrink-0 px-4 py-2 rounded-xl font-mono text-xs transition-all flex items-center gap-2 min-h-[40px] ${
                      isSelected
                        ? "bg-stone-900 text-white font-bold shadow-sm"
                        : "bg-[#FAF8F5] text-stone-700 hover:bg-stone-200/70 border border-stone-200"
                    }`}
                  >
                    <span>DAY {ep.episode_number.toString().padStart(2, "0")}</span>
                    {ep.episode_number === 3 && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        isSelected ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-800"
                      }`}>
                        Latest
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Metadata & 1-Tap Copy Station (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs tracking-wider text-orange-700 uppercase font-bold px-2.5 py-1 rounded-lg bg-orange-100 border border-orange-200">
                    Day {activeEpisode.episode_number.toString().padStart(2, "0")} Master
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="font-mono text-xs tracking-wide text-emerald-700 uppercase font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Status: {activeEpisode.status}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="font-mono text-xs text-stone-500">
                    {activeEpisode.series_name}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 leading-tight">
                  {activeEpisode.title}
                </h2>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                  {activeEpisode.description ||
                    "Standardized AI production series featuring Harshith & Claude co-hosts. 100% free tool workflows with zero subscriptions."}
                </p>

                {/* Savings Callout Box */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm shrink-0">
                      $0
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        {activeEpisode.episode_number === 3
                          ? "GitHub Copilot ($10/mo = $120/yr) vs Continue.dev"
                          : activeEpisode.episode_number === 2
                          ? "Midjourney ($10/mo = $120/yr) vs Flux.1 Schnell"
                          : "Commercial TTS ($50/mo) vs Kokoro 82M"}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {activeEpisode.episode_number === 3
                          ? "Replaced with free VS Code extension + DeepSeek / Ollama"
                          : "100% free open-source setup in your browser or local laptop"}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                    Saved $120/yr
                  </span>
                </div>

                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs tabular-nums">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Duration</span>
                    <span className="font-bold text-stone-900 mt-0.5 block">
                      {formatDuration(activeEpisode.duration_seconds)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Resolution</span>
                    <span className="font-bold text-stone-900 mt-0.5 block">
                      {activeEpisode.resolution || "1080×1920"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Target Audio</span>
                    <span className="font-bold text-emerald-700 mt-0.5 block">-14.0 LUFS</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Master Size</span>
                    <span className="font-bold text-stone-900 mt-0.5 block">
                      {formatBytes(activeEpisode.file_size)}
                    </span>
                  </div>
                </div>

                {/* 1-Tap Instagram Publishing Copy Station */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    Quick Instagram Publishing Station
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={handleCopyCaption}
                      className="min-h-[46px] flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 active:bg-stone-200 text-xs font-semibold text-stone-900 border border-stone-200 transition-all shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        {copiedCaption ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-orange-600" />
                        )}
                        <span>{copiedCaption ? "Caption Copied!" : "Copy Instagram Caption"}</span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 uppercase bg-white px-1.5 py-0.5 rounded border border-stone-200">
                        1-Tap
                      </span>
                    </button>

                    <button
                      onClick={handleCopyPinnedComment}
                      className="min-h-[46px] flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 active:bg-stone-200 text-xs font-semibold text-stone-900 border border-stone-200 transition-all shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        {copiedComment ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                        )}
                        <span>{copiedComment ? "Comment Copied!" : "Copy Pinned Comment"}</span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 uppercase bg-white px-1.5 py-0.5 rounded border border-stone-200">
                        1-Tap
                      </span>
                    </button>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-3 pt-2 flex-wrap">
                  <button
                    onClick={() => setPreviewVideo(activeEpisode)}
                    className="min-h-[46px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold transition-all shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch 9:16 Reel</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="min-h-[46px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold border border-stone-200 transition-all shadow-xs"
                  >
                    <Download className="w-4 h-4 text-orange-600" />
                    <span>Download Master MP4</span>
                  </button>

                  <a
                    href="https://app.notion.com/p/40f7cd75d68b81bda8d6e3bf4a7e4866"
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[46px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-semibold border border-orange-200 transition-all"
                  >
                    <span>Read Public Notion Guide</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </div>
              </div>

              {/* Right Column: 9:16 Vertical Video Frame (5 cols) */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  onClick={() => setPreviewVideo(activeEpisode)}
                  className="w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16] rounded-3xl bg-stone-950 border-4 border-stone-900 overflow-hidden cursor-pointer relative group/preview shrink-0 shadow-2xl transition-transform hover:scale-[1.02]"
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
                    <div className="w-full h-full bg-stone-900 flex items-center justify-center text-stone-400 font-mono text-xs">
                      1080 × 1920
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-2xl transition-transform group-hover/preview:scale-110">
                      <Play className="w-6 h-6 translate-x-0.5 fill-stone-900" />
                    </div>
                  </div>

                  {/* Bottom Video Badge */}
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-xs font-mono tabular-nums text-white">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20">
                      {formatDuration(activeEpisode.duration_seconds)}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-orange-500 text-white font-bold uppercase shadow-sm">
                      DAY {activeEpisode.episode_number.toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 4. MASTER EPISODE CATALOG                                */}
      {/* ───────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              The 100-Day Episode Library
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Explore released episodes and verified zero-dollar AI workflows.
            </p>
          </div>

          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-stone-700 hover:text-orange-600 transition-colors"
          >
            <span>View All ({videos.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-white border border-stone-200 animate-pulse" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {videos.map((video) => (
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
      </section>

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
