"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  UploadCloud,
  Film,
  RefreshCw,
} from "lucide-react";
import { VideoRecord, VideoStatus } from "@/types/video";
import { fetchVideos } from "@/lib/video-service";
import { VideoCard } from "@/components/video-card";
import { VideoPreviewModal } from "@/components/video-preview-modal";
import { VideoEditModal } from "@/components/video-edit-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { EmptyState } from "@/components/empty-state";

export default function LibraryPage() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VideoStatus | "All">("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "episode-asc" | "episode-desc" | "title">("newest");

  // Modals state
  const [previewVideo, setPreviewVideo] = useState<VideoRecord | null>(null);
  const [editVideo, setEditVideo] = useState<VideoRecord | null>(null);
  const [deleteTargetVideo, setDeleteTargetVideo] = useState<VideoRecord | null>(null);

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      const list = await fetchVideos({
        searchQuery,
        status: statusFilter,
        sortBy,
      });
      setVideos(list);
    } catch (err) {
      console.error("Failed to load videos", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setSortBy("newest");
  };

  const isFiltered = Boolean(searchQuery || statusFilter !== "All");

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-brand uppercase font-medium">
            <Film className="w-3.5 h-3.5" />
            <span>Archive Index</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-white mt-1">
            Master Reel Library
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-normal">
            Completed 9:16 vertical video masters for 100 Days of Free AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadVideos()}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Ingest Reel</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-2xl bg-[#090a0f] border border-white/[0.06] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-subtle">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, episode number, topic, or caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand transition-colors font-mono"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono">
            {(["All", "Ready", "Published", "Draft"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-colors ${
                  statusFilter === st
                    ? "bg-white text-black font-semibold shadow-subtle"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-zinc-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[10px] font-mono tracking-wider uppercase text-white focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-[#090a0f] text-white">Newest First</option>
              <option value="oldest" className="bg-[#090a0f] text-white">Oldest First</option>
              <option value="episode-asc" className="bg-[#090a0f] text-white">Day 1 → 100</option>
              <option value="episode-desc" className="bg-[#090a0f] text-white">Day 100 → 1</option>
              <option value="title" className="bg-[#090a0f] text-white">Title A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <EmptyState isFiltered={isFiltered} onResetFilters={handleResetFilters} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        onSuccess={() => loadVideos()}
      />

      <DeleteConfirmModal
        video={deleteTargetVideo}
        isOpen={Boolean(deleteTargetVideo)}
        onClose={() => setDeleteTargetVideo(null)}
        onSuccess={() => loadVideos()}
      />
    </div>
  );
}
