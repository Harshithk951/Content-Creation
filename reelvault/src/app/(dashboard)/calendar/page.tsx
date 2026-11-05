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
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-brand uppercase font-bold">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Master Cadence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            100-Day Production Roadmap
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Day 01 through Day 100 schedule featuring Harshith & Claude.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
          <span className="text-zinc-500">STAGE PROGRESS:</span>
          <span className="text-white font-bold">{readyCount + publishedCount} / 100 REELS</span>
        </div>
      </div>

      {/* Progress Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#090a0f] border border-white/[0.06] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Masters Ready</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{readyCount.toString().padStart(2, "0")}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090a0f] border border-white/[0.06] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Live On Feed</p>
            <p className="text-2xl font-bold font-mono text-brand mt-1">{publishedCount.toString().padStart(2, "0")}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090a0f] border border-white/[0.06] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">In Pipeline</p>
            <p className="text-2xl font-bold font-mono text-zinc-300 mt-1">{plannedCount.toString().padStart(2, "0")}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-zinc-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-2xl bg-[#090a0f] border border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-subtle">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search timeline (e.g. Day 1, Kokoro, Whisper, Ollama)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#11131c] border border-white/[0.06] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#11131c] border border-white/[0.06] text-xs font-mono">
          {["All", "Video Ready", "Published", "Planned"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                selectedStatus === st
                  ? "bg-brand text-white shadow-subtle"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 100 Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredEpisodes.map((ep) => {
          const matchedVideo = videos.find((v) => v.episode_number === ep.episode_number);
          const isReady = ep.status === "Video Ready" || ep.status === "Published" || Boolean(matchedVideo);

          return (
            <div
              key={ep.episode_number}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                isReady
                  ? "bg-[#0b0d14] border-emerald-500/30 hover:border-emerald-500/50 shadow-subtle"
                  : "bg-[#090a0f] border-white/[0.05] hover:border-white/[0.12]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-brand">
                    DAY {ep.episode_number.toString().padStart(2, "0")} / 100
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      ep.status === "Published"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                        : ep.status === "Video Ready"
                        ? "bg-orange-500/15 text-orange-400 border border-orange-500/25"
                        : ep.status === "Scripting"
                        ? "bg-sky-500/15 text-sky-400 border border-sky-500/25"
                        : "bg-white/[0.04] text-zinc-400 border border-white/[0.06]"
                    }`}
                  >
                    {ep.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-brand-light transition-colors line-clamp-2 leading-snug">
                  {ep.title}
                </h4>

                {ep.planned_topic && (
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {ep.planned_topic}
                  </p>
                )}

                {ep.tool_name && (
                  <div className="mt-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-zinc-300 border border-white/[0.06]">
                      {ep.tool_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Card Action */}
              <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono">
                {matchedVideo ? (
                  <button
                    onClick={() => setPreviewVideo(matchedVideo)}
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Watch Master Reel</span>
                  </button>
                ) : (
                  <Link
                    href={`/upload`}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-brand transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Ingest Day {ep.episode_number}</span>
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
