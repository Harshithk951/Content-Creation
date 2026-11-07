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

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-orange-700 uppercase font-bold">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Master Release Cadence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 mt-1">
            100-Day Production Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
            Complete schedule featuring Harshith & Claude replacing paid developer and creator subscriptions with \$0 tools.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-mono tabular-nums shadow-xs">
          <span className="text-stone-500 uppercase tracking-wider text-[10px]">Active Archive:</span>
          <span className="text-stone-900 font-bold">{readyCount} Master Ready • {scriptingCount} In Scripting</span>
        </div>
      </div>

      {/* Progress Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-mono tracking-wider text-stone-500 uppercase font-bold">Masters Ready</p>
            <p className="text-2xl font-mono tabular-nums font-extrabold text-emerald-700 mt-1">{readyCount.toString().padStart(2, "0")}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-mono tracking-wider text-stone-500 uppercase font-bold">In Scripting</p>
            <p className="text-2xl font-mono tabular-nums font-extrabold text-amber-700 mt-1">{scriptingCount.toString().padStart(2, "0")}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-mono tracking-wider text-stone-500 uppercase font-bold">Published Live</p>
            <p className="text-2xl font-mono tabular-nums font-extrabold text-orange-700 mt-1">{publishedCount.toString().padStart(2, "0")}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center border border-orange-200">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-mono tracking-wider text-stone-500 uppercase font-bold">Series Total</p>
            <p className="text-2xl font-mono tabular-nums font-extrabold text-stone-900 mt-1">100 Days</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
            <Film className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Phase Segment Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PHASES.map((ph) => (
          <button
            key={ph.key}
            onClick={() => setSelectedPhase(ph.key)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap border ${
              selectedPhase === ph.key
                ? "bg-stone-900 text-white font-bold border-stone-900 shadow-sm"
                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
            }`}
          >
            <span>{ph.label}</span>
            <span className="ml-1.5 opacity-60 text-[10px]">({ph.range})</span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-stone-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all 100 days (e.g. Midjourney, Copilot, Cline, Continue, Ollama, DeepSeek)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center p-1 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs font-mono">
            {["All", "Video Ready", "Scripting", "Planned"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  selectedStatus === st
                    ? "bg-white text-stone-900 font-bold shadow-xs border border-stone-200"
                    : "text-stone-600 hover:text-stone-900"
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
            className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-[10px] font-mono uppercase tracking-wider text-stone-900 focus:outline-none cursor-pointer"
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
      <div className="flex items-center justify-between text-xs font-mono text-stone-500 px-1">
        <span>Displaying {filteredEpisodes.length} of 100 series episodes</span>
        {selectedPhase !== "All" && (
          <button
            onClick={() => setSelectedPhase("All")}
            className="text-stone-700 hover:text-stone-900 underline underline-offset-2 font-semibold"
          >
            View all phases
          </button>
        )}
      </div>

      {/* 100 Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredEpisodes.map((ep) => {
          const matchedVideo = videos.find((v) => v.episode_number === ep.episode_number);
          const isReady = ep.status === "Video Ready" || ep.status === "Published" || Boolean(matchedVideo);

          return (
            <div
              key={ep.episode_number}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group bg-white shadow-xs hover:shadow-md ${
                isReady
                  ? "border-emerald-300 ring-1 ring-emerald-200/50"
                  : ep.status === "Scripting"
                  ? "border-amber-300 ring-1 ring-amber-200/50"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-mono tabular-nums font-bold text-orange-700 tracking-wider">
                    DAY {ep.episode_number.toString().padStart(2, "0")} / 100
                  </span>
                  <div className="flex items-center gap-1.5">
                    {ep.category && (
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        {ep.category}
                      </span>
                    )}
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                        ep.status === "Published"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : ep.status === "Video Ready"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : ep.status === "Scripting"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-stone-100 text-stone-500 border border-stone-200"
                      }`}
                    >
                      {ep.status}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug tracking-tight">
                  {ep.title}
                </h4>

                {ep.planned_topic && (
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed font-normal">
                    {ep.planned_topic}
                  </p>
                )}

                {ep.tool_name && (
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] text-stone-700 border border-stone-200">
                      {ep.tool_name}
                    </span>
                    {ep.target_date && (
                      <span className="text-[10px] font-mono text-stone-500">
                        • {ep.target_date}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action link */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
                {matchedVideo ? (
                  <button
                    onClick={() => setPreviewVideo(matchedVideo)}
                    className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-bold transition-colors"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Watch Master Reel</span>
                  </button>
                ) : (
                  <Link
                    href={`/upload?ep=${ep.episode_number}`}
                    className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors"
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
