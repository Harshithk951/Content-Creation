"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Film,
  Sparkles,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Layers,
  Play,
  Download,
  Copy,
  Flame,
  Radio,
  Cpu,
  Bot,
} from "lucide-react";
import { VideoRecord, VideoStats } from "@/types/video";
import { fetchVideos, fetchVideoStats, getVideoDownloadUrl } from "@/lib/video-service";
import { StatsCards } from "@/components/stats-cards";
import { VideoCard } from "@/components/video-card";
import { VideoPreviewModal } from "@/components/video-preview-modal";
import { VideoEditModal } from "@/components/video-edit-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/components/toast";

export default function OverviewPage() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [stats, setStats] = useState<VideoStats | null>(null);
  const [loading, setLoading] = useState(true);

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
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const featuredEpisode = videos.find((v) => v.episode_number === 1) || videos[0];

  const handleDownloadFeatured = async () => {
    if (!featuredEpisode) return;
    try {
      const { url, filename } = await getVideoDownloadUrl(featuredEpisode);
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

  const handleCopyFeaturedCaption = () => {
    if (!featuredEpisode?.caption) return;
    navigator.clipboard.writeText(featuredEpisode.caption);
    toast.success("Caption copied", "Ready to paste directly on Instagram!");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Statistics Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* 2. Hero Keynote Showcase: Day 01 Spotlight */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#12141e] via-[#0d0f17] to-[#07080c] border border-[#222638] p-6 lg:p-10 overflow-hidden shadow-card group">
        {/* Ambient mesh glow orbs */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-brand/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-brand/15 text-brand text-xs font-mono font-bold border border-brand/35 tracking-wider flex items-center gap-1.5 shadow-subtle">
                <Sparkles className="w-3.5 h-3.5" />
                SERIES SPOTLIGHT • DAY 01 / 100
              </span>

              <span className="text-xs font-semibold px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Master Render Ready • 1080×1920
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Kokoro 82M — The $50 Voiceover Trap
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">
              Starring <strong className="text-white">Harshith</strong> & <strong className="text-white">Claude</strong>. Explaining why you shouldn't waste \$40/month on voice credits when you have 12 cents in your checking account. Kokoro 82M runs 100% locally on CPU with zero API costs.
            </p>

            {/* Micro Tech Tags */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] font-mono text-zinc-400">
              <span className="px-2.5 py-1 rounded-lg bg-[#161826] border border-[#24283c] text-zinc-300 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-brand" /> ONNX CPU Inference
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#161826] border border-[#24283c] text-zinc-300">
                82 Million Parameters
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#161826] border border-[#24283c] text-emerald-400">
                Apache-2.0 Open Weight
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-3 flex-wrap">
              {featuredEpisode && (
                <>
                  <button
                    onClick={() => setPreviewVideo(featuredEpisode)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand via-[#ff6830] to-[#e04b15] hover:from-[#ff6830] hover:to-brand text-white text-xs font-bold transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch In-Browser (38s)</span>
                  </button>

                  <button
                    onClick={handleDownloadFeatured}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#181b28] hover:bg-[#222538] text-white text-xs font-bold border border-[#2e334a] transition-colors"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Original MP4</span>
                  </button>

                  <button
                    onClick={handleCopyFeaturedCaption}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#141622] hover:bg-[#1d2030] text-zinc-300 hover:text-white text-xs font-semibold border border-[#262a3c] transition-colors"
                  >
                    <Copy className="w-4 h-4 text-brand" />
                    <span>Copy Caption</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Mini Console: Series Specs & Claude Avatar */}
          <div className="lg:w-80 p-6 rounded-2xl bg-[#0a0b10]/85 border border-[#212435] backdrop-blur-xl space-y-4 shrink-0 shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c1f2d]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Claude AI Co-Host</p>
                  <p className="text-[10px] text-zinc-400">Companion Robot Avatar</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand/15 text-brand border border-brand/25 font-bold">
                DAY 1 / 100
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Reel Dimensions</span>
                <span className="text-white font-mono font-bold">1080 × 1920 (9:16)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Framerate</span>
                <span className="text-white font-mono font-bold">30.0 fps</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Audio Mastering</span>
                <span className="text-emerald-400 font-mono font-bold">-14 LUFS (EBU)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Captions</span>
                <span className="text-white font-medium">Word-level Whisper</span>
              </div>
            </div>

            <div className="h-px bg-[#1c1f2d] pt-1" />

            <Link
              href="/calendar"
              className="flex items-center justify-between text-xs text-brand hover:text-brand-light font-bold pt-1 group"
            >
              <span>Explore 100-Day Roadmap</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Stored Videos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Film className="w-5 h-5 text-brand" />
              Recently Stored Reels
            </h3>
            <p className="text-xs text-zinc-400">
              Direct access to permanent 9:16 vertical videos in Supabase
            </p>
          </div>

          <Link
            href="/library"
            className="flex items-center gap-1.5 text-xs text-brand hover:text-brand-light font-bold group"
          >
            <span>Full Video Library</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-[#11131c] border border-[#1f2231] animate-pulse"
              />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
