"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Film,
  UploadCloud,
  Search,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { SeriesEpisodePlan, VideoRecord } from "@/types/video";
import { INITIAL_SERIES_ROADMAP, fetchVideos } from "@/lib/video-service";
import { VideoPreviewModal } from "@/components/video-preview-modal";

const PHASES = [
  { label: "All 100 Days", key: "All", range: "01 – 100" },
  { label: "Phase 1: Hook Week", key: "Phase 1", range: "Days 01 – 20" },
  { label: "Phase 2: Dev + Student Core", key: "Phase 2", range: "Days 21 – 40" },
  { label: "Phase 3: Voice + Creator", key: "Phase 3", range: "Days 41 – 60" },
  { label: "Phase 4: Full Stacks", key: "Phase 4", range: "Days 61 – 80" },
  { label: "Phase 5: Job & Finale", key: "Phase 5", range: "Days 81 – 100" },
];

export default function CalendarPage() {
  const [roadmap, setRoadmap] = useState<SeriesEpisodePlan[]>(INITIAL_SERIES_ROADMAP);
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewVideo, setPreviewVideo] = useState<VideoRecord | null>(null);

  useEffect(() => {
    fetchVideos().then((vList) => {
      setVideos(vList);
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

  const categories = Array.from(new Set(INITIAL_SERIES_ROADMAP.map((r) => r.category).filter(Boolean)));

  const filteredEpisodes = roadmap.filter((item) => {
    const matchesPhase =
      selectedPhase === "All" || (item.phase && item.phase.startsWith(selectedPhase));

    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Video Ready" && item.status === "Video Ready") ||
      (selectedStatus === "Published" && item.status === "Published") ||
      (selectedStatus === "Scripting" && item.status === "Scripting") ||
      (selectedStatus === "Planned" && item.status === "Planned");

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.planned_topic && item.planned_topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tool_name && item.tool_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.episode_number.toString() === searchQuery;

    return matchesPhase && matchesStatus && matchesCategory && matchesSearch;
  });

  const readyCount = roadmap.filter((r) => r.status === "Video Ready").length;
  const publishedCount = roadmap.filter((r) => r.status === "Published").length;
  const scriptingCount = roadmap.filter((r) => r.status === "Scripting").length;
  const plannedCount = roadmap.length - readyCount - publishedCount - scriptingCount;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-brand uppercase font-medium">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Master Cadence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-white mt-1">
            100-Day Production Roadmap
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-normal">
            Complete Day 01 through Day 100 schedule featuring Harshith & Claude replacing paid subscriptions with $0 tools.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono tabular-nums">
          <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Active Archive:</span>
          <span className="text-white font-medium">{readyCount} Master Ready • {scriptingCount} In Scripting</span>
        </div>
      </div>

      {/* Progress Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#090a0f] border border-white/[0.06] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-[0.18em] text-zinc-500 uppercase font-medium">Masters Ready</p>
            <p className="text-2xl font-mono tabular-nums font-medium text-emerald-400 mt-1">{readyCount.toString().padStart(2, "0")}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090a0f] border border-white/[0.06] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-[0.18em] text-zinc-500 uppercase font-medium">In Scripting</p>
            <p className="text-2xl font-mono tabular-nums font-medium text-amber-400 mt-1">{scriptingCount.toString().padStart(2, "0")}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090a0f] border border-white/[0.06] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-[0.18em] text-zinc-500 uppercase font-medium">Published Live</p>
            <p className="text-2xl font-mono tabular-nums font-medium text-brand mt-1">{publishedCount.toString().padStart(2, "0")}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090a0f] border border-white/[0.06] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-[0.18em] text-zinc-500 uppercase font-medium">Series Total</p>
            <p className="text-2xl font-mono tabular-nums font-medium text-white mt-1">100 Days</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-zinc-400">
            <Film className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Phase Segment Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PHASES.map((ph) => (
          <button
            key={ph.key}
            onClick={() => setSelectedPhase(ph.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-colors whitespace-nowrap border ${
              selectedPhase === ph.key
                ? "bg-white text-black font-semibold border-white"
                : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <span>{ph.label}</span>
            <span className="ml-1.5 opacity-60 text-[10px]">({ph.range})</span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-2xl bg-[#090a0f] border border-white/[0.06] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-subtle">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all 100 days (e.g. Midjourney, Copilot, Cline, Wan 2.1, Coolify, DeepSeek)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand font-mono"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono">
            {["All", "Video Ready", "Scripting", "Planned"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  selectedStatus === st
                    ? "bg-white text-black font-semibold shadow-subtle"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#090a0f] border border-white/[0.08] text-[10px] font-mono uppercase tracking-wider text-white focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1">
        <span>Displaying {filteredEpisodes.length} of 100 series episodes</span>
        {selectedPhase !== "All" && (
          <button
            onClick={() => setSelectedPhase("All")}
            className="text-zinc-400 hover:text-white underline underline-offset-2"
          >
            View all phases
          </button>
        )}
      </div>

      {/* 100 Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredEpisodes.map((ep) => {
          const matchedVideo = videos.find((v) => v.episode_number === ep.episode_number);
          const isReady = ep.status === "Video Ready" || ep.status === "Published" || Boolean(matchedVideo);

          return (
            <div
              key={ep.episode_number}
              className={`p-4 rounded-2xl border transition-colors flex flex-col justify-between group ${
                isReady
                  ? "bg-[#0b0c11] border-emerald-500/25 hover:border-emerald-500/40"
                  : ep.status === "Scripting"
                  ? "bg-[#0b0b10] border-amber-500/20 hover:border-amber-500/40"
                  : "bg-[#090a0f] border-white/[0.05] hover:border-white/[0.1]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono tabular-nums font-semibold text-brand tracking-wider">
                    DAY {ep.episode_number.toString().padStart(2, "0")} / 100
                  </span>
                  <div className="flex items-center gap-1.5">
                    {ep.category && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                        {ep.category}
                      </span>
                    )}
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                        ep.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : ep.status === "Video Ready"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : ep.status === "Scripting"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-white/[0.03] text-zinc-500 border border-white/[0.05]"
                      }`}
                    >
                      {ep.status}
                    </span>
                  </div>
                </div>

                <h4 className="font-medium text-sm text-white group-hover:text-brand transition-colors line-clamp-2 leading-snug tracking-tight">
                  {ep.title}
                </h4>

                {ep.planned_topic && (
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-normal">
                    {ep.planned_topic}
                  </p>
                )}

                {ep.tool_name && (
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-zinc-300 border border-white/[0.06]">
                      {ep.tool_name}
                    </span>
                    {ep.target_date && (
                      <span className="text-[10px] font-mono text-zinc-500">
                        • {ep.target_date}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action link */}
              <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono">
                {matchedVideo ? (
                  <button
                    onClick={() => setPreviewVideo(matchedVideo)}
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-white transition-colors"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Watch Master Reel</span>
                  </button>
                ) : (
                  <Link
                    href={`/upload?ep=${ep.episode_number}`}
                    className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Ingest Reel</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <VideoPreviewModal
        video={previewVideo}
        isOpen={Boolean(previewVideo)}
        onClose={() => setPreviewVideo(null)}
      />
    </div>
  );
}
