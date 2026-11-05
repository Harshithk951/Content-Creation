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
      label: "TOTAL REELS",
      value: stats ? stats.totalVideos.toString().padStart(2, "0") : "00",
      sub: "In Master Archive",
      icon: Film,
    },
    {
      label: "PUBLISHED",
      value: stats ? stats.publishedReels.toString().padStart(2, "0") : "00",
      sub: "Live on Instagram",
      icon: CheckCircle2,
    },
    {
      label: "STAGED",
      value: stats ? stats.readyVideos.toString().padStart(2, "0") : "01",
      sub: "Ready for Posting",
      icon: FileEdit,
    },
    {
      label: "STORAGE FOOTPRINT",
      value: stats ? formatBytes(stats.totalStorageBytes) : "0 B",
      sub: "Original MP4 Masters",
      icon: HardDrive,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 select-none">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#090a0f] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
          >
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-medium">
                {card.label}
              </span>
              <Icon className="w-3.5 h-3.5 text-zinc-500" />
            </div>

            <div className="mt-3">
              {loading ? (
                <div className="h-8 w-16 bg-white/[0.04] rounded-md animate-pulse" />
              ) : (
                <div className="text-2xl sm:text-3xl font-medium font-mono tabular-nums tracking-[-0.02em] text-white">
                  {card.value}
                </div>
              )}
              <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
