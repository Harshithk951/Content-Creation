"use client";

import React from "react";
import { Film, CheckCircle2, FileEdit, HardDrive, Sparkles } from "lucide-react";
import { VideoStats } from "@/types/video";
import { formatBytes } from "@/lib/utils";

interface StatsCardsProps {
  stats: VideoStats | null;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Reels Stored",
      value: stats ? stats.totalVideos.toString() : "0",
      description: "Archived in Supabase",
      icon: Film,
      color: "text-brand",
      bg: "bg-brand/10 border-brand/20",
      pill: "Permanent",
    },
    {
      title: "Published on Instagram",
      value: stats ? stats.publishedReels.toString() : "0",
      description: "Live on @harshith.dev",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      pill: "Active",
    },
    {
      title: "Drafts & Scripting",
      value: stats ? stats.draftVideos.toString() : "0",
      description: "In review / queue",
      icon: FileEdit,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      pill: "Pipeline",
    },
    {
      title: "Original Storage Size",
      value: stats ? formatBytes(stats.totalStorageBytes) : "0 B",
      description: "Lossless MP4 master files",
      icon: HardDrive,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
      pill: "1080×1920",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#11131c] to-[#0c0e15] border border-[#1f2231] hover:border-[#2f354c] transition-all duration-300 shadow-subtle group relative overflow-hidden"
          >
            {/* Ambient hover top highlight line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-brand/40 transition-colors" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.bg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="h-8 w-24 bg-zinc-800/50 rounded-lg animate-pulse" />
              ) : (
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:translate-x-0.5 transition-transform">
                  {card.value}
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-zinc-500 mt-1.5">
                <span>{card.description}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#161824] text-zinc-400 border border-[#232638]">
                  {card.pill}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
