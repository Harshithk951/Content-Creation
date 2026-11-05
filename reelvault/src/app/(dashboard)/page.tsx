"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Film,
  ArrowRight,
  UploadCloud,
  Play,
  Download,
  Copy,
  Clock,
  HardDrive,
  Volume2,
  Monitor,
  Check,
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
  const [copied, setCopied] = useState(false);

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

  const featured = videos.find((v) => v.episode_number === 1) || videos[0];

  const handleDownload = async () => {
    if (!featured) return;
    try {
      const { url, filename } = await getVideoDownloadUrl(featured);
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
    if (!featured?.caption) return;
    navigator.clipboard.writeText(featured.caption);
    setCopied(true);
    toast.success("Caption copied", "Ready to paste on Instagram");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Telemetry Stats Strip */}
      <StatsCards stats={stats} loading={loading} />

      {/* Featured Master Reel Showcase */}
      {featured && (
        <div className="rounded-3xl bg-[#090a0f] border border-white/[0.08] p-6 lg:p-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Left Column: Metadata & Actions */}
            <div className="space-y-4 max-w-2xl flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-[0.25em] text-brand uppercase font-bold">
                  EPISODE 01 MASTER
                </span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-[10px] tracking-[0.15em] text-emerald-400 uppercase font-semibold">
                  STATUS: READY FOR POSTING
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {featured.title}
              </h2>

              <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                {featured.description || "The 82M open-weight text-to-speech model running 100% locally on CPU without subscriptions or cloud fees."}
              </p>

              {/* Technical Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">Duration</span>
                  <span className="font-bold text-white mt-0.5 block">38.67s</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">Resolution</span>
                  <span className="font-bold text-white mt-0.5 block">1080×1920</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">Loudness</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">-14.0 LUFS</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">File Size</span>
                  <span className="font-bold text-white mt-0.5 block">6.49 MB</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 flex-wrap">
                <button
                  onClick={() => setPreviewVideo(featured)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Preview 9:16 Reel</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-bold border border-white/[0.1] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-brand" />
                  <span>Download Master MP4</span>
                </button>

                <button
                  onClick={handleCopyCaption}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 text-xs font-semibold border border-white/[0.06] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copied ? "Caption Copied" : "Copy Caption"}</span>
                </button>
              </div>
            </div>

            {/* Right Column: 9:16 Mini Theatre Card */}
            <div
              onClick={() => setPreviewVideo(featured)}
              className="w-full lg:w-64 aspect-[9/16] rounded-2xl bg-black border border-white/[0.1] overflow-hidden cursor-pointer relative group/preview shrink-0 shadow-2xl"
            >
              <video
                src="/sample-ep01.mp4"
                preload="metadata"
                muted
                loop
                playsInline
                className="w-full h-full object-cover group-hover/preview:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-glow group-hover/preview:scale-110 transition-transform">
                  <Play className="w-5 h-5 translate-x-0.5 fill-black" />
                </div>
              </div>

              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[10px] font-mono text-zinc-300">
                <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md">00:00:38:20</span>
                <span className="px-2 py-0.5 rounded bg-brand/90 text-white font-bold">DAY 01</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Library Grid Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-white font-bold uppercase tracking-wider">Master Library</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-500">100 Days of Free AI</span>
          </div>

          <Link
            href="/library"
            className="flex items-center gap-1.5 text-xs text-brand hover:text-brand-light font-mono uppercase tracking-wider font-semibold group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
