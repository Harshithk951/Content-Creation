"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
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
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Film className="w-6 h-6 text-brand" />
            Video Library
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            All stored 9:16 vertical Reel episodes for 100 Days of Free AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadVideos()}
            className="p-2.5 rounded-xl bg-[#14161f] hover:bg-[#1d202c] text-zinc-400 hover:text-white border border-[#232635] transition-colors"
            title="Refresh videos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-semibold transition-all shadow-glow"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Video</span>
          </Link>
        </div>
      </div>

      {/* Search, Filter, Sort Toolbar */}
      <div className="p-4 rounded-2xl bg-[#111218] border border-[#20232f] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-subtle">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, episode number, topic, caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#171922] border border-[#282b3a] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand transition-colors"
          >
          </input>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Status Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#171922] border border-[#282b3a] text-xs">
            {(["All", "Ready", "Published", "Draft"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  statusFilter === st
                    ? "bg-brand text-white font-semibold shadow-subtle"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171922] border border-[#282b3a] text-xs text-zinc-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-[#171922] text-white">Newest First</option>
              <option value="oldest" className="bg-[#171922] text-white">Oldest First</option>
              <option value="episode-asc" className="bg-[#171922] text-white">Episode (1 → 100)</option>
              <option value="episode-desc" className="bg-[#171922] text-white">Episode (100 → 1)</option>
              <option value="title" className="bg-[#171922] text-white">Title (A → Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-[#121319] border border-[#21242f] animate-pulse"
            />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <EmptyState isFiltered={isFiltered} onResetFilters={handleResetFilters} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
