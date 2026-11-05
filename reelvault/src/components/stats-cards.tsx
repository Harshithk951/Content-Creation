"use client";

import React from "react";
import { Film, CheckCircle2, FileEdit, HardDrive } from "lucide-react";
import { VideoStats } from "@/types/video";
import { formatBytes } from "@/lib/utils";

interface StatsCardsProps {
  stats: VideoStats | null;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Videos",
      value: stats ? stats.totalVideos.toString() : "0",
      description: "Stored in library",
      icon: Film,
      color: "text-brand",
      bg: "bg-brand/10 border-brand/20",
    },
    {
      title: "Published Reels",
      value: stats ? stats.publishedReels.toString() : "0",
      description: "Live on Instagram",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Draft Videos",
      value: stats ? stats.draftVideos.toString() : "0",
      description: "In review or editing",
      icon: FileEdit,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Total Storage Used",
      value: stats ? formatBytes(stats.totalStorageBytes) : "0 B",
      description: "In Supabase Storage",
      icon: HardDrive,
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#121319] border border-[#21242e] hover:border-[#2f3342] transition-all duration-200 shadow-subtle group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">{card.title}</span>
              <div className={`p-2 rounded-xl border ${card.bg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>

            <div className="mt-3">
              {loading ? (
                <div className="h-8 w-20 bg-zinc-800/60 rounded-md animate-pulse" />
              ) : (
                <div className="text-2xl font-bold tracking-tight text-white group-hover:scale-[1.01] transition-transform">
                  {card.value}
                </div>
              )}
              <p className="text-xs text-zinc-400 mt-1">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
