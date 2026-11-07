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
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-orange-700 uppercase font-bold">
            <Film className="w-3.5 h-3.5" />
            <span>Complete Collection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 mt-1">
            All Episodes (100 Days)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
            Browse the full catalog of vertical video masters and zero-dollar AI tutorials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadVideos()}
            className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200 transition-colors shadow-xs"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-colors shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest Reel</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-stone-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, episode number, topic, or caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 transition-colors font-mono"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs font-mono">
            {(["All", "Ready", "Published", "Draft"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-colors ${
                  statusFilter === st
                    ? "bg-white text-stone-900 font-bold shadow-xs border border-stone-200"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs font-mono text-stone-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[10px] font-mono tracking-wider uppercase text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="episode-asc">Day 1 → 100</option>
              <option value="episode-desc">Day 100 → 1</option>
              <option value="title">Title A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-white border border-stone-200 animate-pulse" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <EmptyState isFiltered={isFiltered} onResetFilters={handleResetFilters} />
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
