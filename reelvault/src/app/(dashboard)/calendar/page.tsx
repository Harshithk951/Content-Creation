"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Clock,
  Film,
  UploadCloud,
  ChevronRight,
  Flame,
  Search,
} from "lucide-react";
import { SeriesEpisodePlan, VideoRecord } from "@/types/video";
import { INITIAL_SERIES_ROADMAP, fetchVideos } from "@/lib/video-service";
import { VideoPreviewModal } from "@/components/video-preview-modal";

export default function CalendarPage() {
  const [roadmap, setRoadmap] = useState<SeriesEpisodePlan[]>(INITIAL_SERIES_ROADMAP);
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewVideo, setPreviewVideo] = useState<VideoRecord | null>(null);

  useEffect(() => {
    fetchVideos().then((vList) => {
      setVideos(vList);
      // Synchronize roadmap with uploaded videos
      setRoadmap((prev) =>
        prev.map((item) => {
          const match = vList.find((v) => v.episode_number === item.episode_number);
          if (match) {
            return {
              ...item,
              title: match.title,
              status: match.status === "Published" ? "Published" : "Video Ready",
            };
          }
          return item;
        })
      );
    });
  }, []);

  const filteredEpisodes = roadmap.filter((item) => {
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Video Ready" && item.status === "Video Ready") ||
      (selectedStatus === "Published" && item.status === "Published") ||
      (selectedStatus === "Planned" && (item.status === "Planned" || item.status === "Scripting"));

    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.planned_topic && item.planned_topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tool_name && item.tool_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.episode_number.toString() === searchQuery;

    return matchesStatus && matchesSearch;
  });

  const readyCount = roadmap.filter((r) => r.status === "Video Ready").length;
  const publishedCount = roadmap.filter((r) => r.status === "Published").length;
  const plannedCount = roadmap.length - readyCount - publishedCount;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-brand" />
            100 Days of Free AI — Series Calendar
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Full 100-day production roadmap featuring Harshith and Claude.
          </p>
        </div>

        {/* Milestone Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#14161f] border border-[#232635] text-xs">
          <Flame className="w-4 h-4 text-brand" />
          <span className="text-zinc-400 font-medium">Completed:</span>
          <span className="text-white font-bold">{readyCount + publishedCount} / 100</span>
        </div>
      </div>

      {/* Progress & Stat Pill Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#121319] border border-emerald-500/25 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Videos Ready</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{readyCount}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121319] border border-brand/25 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Published on Instagram</p>
            <p className="text-xl font-bold text-brand mt-0.5">{publishedCount}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121319] border border-zinc-700/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Planned Episodes</p>
            <p className="text-xl font-bold text-zinc-300 mt-0.5">{plannedCount}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-[#111218] border border-[#20232f] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-subtle">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search days (e.g. Day 1, Kokoro, Whisper, Ollama)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#161822] border border-[#272a39] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161822] border border-[#272a39] text-xs">
          {["All", "Video Ready", "Published", "Planned"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedStatus === st
                  ? "bg-brand text-white font-semibold shadow-subtle"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 100 Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEpisodes.map((ep) => {
          const matchedVideo = videos.find((v) => v.episode_number === ep.episode_number);
          const isReady = ep.status === "Video Ready" || ep.status === "Published" || Boolean(matchedVideo);

          return (
            <div
              key={ep.episode_number}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                isReady
                  ? "bg-[#13151f] border-emerald-500/25 hover:border-emerald-500/40 shadow-subtle"
                  : "bg-[#111218] border-[#1f222e] hover:border-[#2f3345]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-brand">
                    Day {ep.episode_number.toString().padStart(2, "0")} / 100
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      ep.status === "Published"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                        : ep.status === "Video Ready"
                        ? "bg-orange-500/15 text-orange-400 border border-orange-500/25"
                        : ep.status === "Scripting"
                        ? "bg-sky-500/15 text-sky-400 border border-sky-500/25"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700/60"
                    }`}
                  >
                    {ep.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-brand-light transition-colors line-clamp-2">
                  {ep.title}
                </h4>

                {ep.planned_topic && (
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {ep.planned_topic}
                  </p>
                )}

                {ep.tool_name && (
                  <div className="mt-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191b26] text-zinc-300 border border-[#262938]">
                      {ep.tool_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Card Action */}
              <div className="mt-4 pt-3 border-t border-[#1d202b] flex items-center justify-between text-xs">
                {matchedVideo ? (
                  <button
                    onClick={() => setPreviewVideo(matchedVideo)}
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Watch Stored Reel</span>
                  </button>
                ) : (
                  <Link
                    href={`/upload`}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-brand font-medium transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload for Day {ep.episode_number}</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Preview Modal */}
      <VideoPreviewModal
        video={previewVideo}
        isOpen={Boolean(previewVideo)}
        onClose={() => setPreviewVideo(null)}
      />
    </div>
  );
}
