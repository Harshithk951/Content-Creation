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

      {/* 2. Featured Series Hero Card: Day 01 Spotlight */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#151722] via-[#121319] to-[#0d0e13] border border-[#272a39] p-6 lg:p-8 overflow-hidden shadow-card">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-brand/15 text-brand text-xs font-bold border border-brand/30 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                SERIES SPOTLIGHT: DAY 01 / 100
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Video Ready • 1080×1920
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Kokoro 82M — The $50 Voiceover Trap
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed">
              Featuring Harshith and Claude. Explaining how to replace expensive \$40/month SaaS subscriptions with an open-weight, Apache 2.0 text-to-speech model that runs 100% locally on your laptop CPU.
            </p>

            <div className="flex items-center gap-3 pt-2 flex-wrap">
              {featuredEpisode && (
                <>
                  <button
                    onClick={() => setPreviewVideo(featuredEpisode)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-semibold transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Preview (38s)</span>
                  </button>

                  <button
                    onClick={handleDownloadFeatured}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d202c] hover:bg-[#272b3c] text-white text-xs font-semibold border border-[#34384e] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Original MP4</span>
                  </button>

                  <button
                    onClick={handleCopyFeaturedCaption}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161822] hover:bg-[#1f2230] text-zinc-300 hover:text-white text-xs font-semibold border border-[#272a39] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-brand" />
                    <span>Copy Caption</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats Pill on Right */}
          <div className="lg:w-72 p-5 rounded-xl bg-[#0c0d12]/80 border border-[#242735] backdrop-blur-md space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Series Goal</span>
              <span className="text-brand font-bold">100 Reels</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Target Cadence</span>
              <span className="text-white font-medium">1 Reel / Day</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Aspect Ratio</span>
              <span className="text-white font-mono font-medium">9:16 Vertical</span>
            </div>
            <div className="h-px bg-[#20222d] my-1" />
            <Link
              href="/calendar"
              className="flex items-center justify-between text-xs text-brand hover:text-brand-light font-semibold pt-1 group"
            >
              <span>Explore 100-Day Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Recent Videos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Videos</h3>
            <p className="text-xs text-zinc-400">
              Completed and drafted reels in your personal Supabase library
            </p>
          </div>
          <Link
            href="/library"
            className="flex items-center gap-1.5 text-xs text-brand hover:text-brand-light font-semibold group"
          >
            <span>View Full Library</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-[#121319] border border-[#21242f] animate-pulse"
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
