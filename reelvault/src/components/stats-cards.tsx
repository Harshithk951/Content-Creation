"use client";

import React from "react";
import { Film, CheckCircle2, FileEdit, HardDrive, TrendingUp } from "lucide-react";
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
      value: stats ? stats.totalVideos.toString().padStart(2, "0") : "03",
      sub: "In Master Archive",
      icon: Film,
      color: "from-orange-500/10 to-transparent",
      borderColor: "border-orange-500/20",
      accentText: "text-brand",
    },
    {
      label: "PUBLISHED",
      value: stats ? stats.publishedReels.toString().padStart(2, "0") : "00",
      sub: "Live on Instagram",
      icon: CheckCircle2,
      color: "from-emerald-500/10 to-transparent",
      borderColor: "border-emerald-500/20",
      accentText: "text-emerald-400",
    },
    {
      label: "STAGED",
      value: stats ? stats.readyVideos.toString().padStart(2, "0") : "03",
      sub: "Ready for Posting",
      icon: FileEdit,
      color: "from-blue-500/10 to-transparent",
      borderColor: "border-blue-500/20",
      accentText: "text-blue-400",
    },
    {
      label: "STORAGE FOOTPRINT",
      value: stats ? formatBytes(stats.totalStorageBytes) : "17.9 MB",
      sub: "Original MP4 Masters",
      icon: HardDrive,
      color: "from-purple-500/10 to-transparent",
      borderColor: "border-purple-500/20",
      accentText: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 select-none">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          /* Double-Bezel Container */
          <div
            key={i}
            className="p-1 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.4)] group hover:border-white/[0.16] transition-all duration-300"
          >
            <div className={`p-4 sm:p-5 rounded-[calc(1rem-2px)] sm:rounded-[calc(1.5rem-4px)] bg-gradient-to-b ${card.color} bg-[#0b0d14] flex flex-col justify-between h-full relative overflow-hidden`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold text-zinc-400 truncate">
                  {card.label}
                </span>
                <div className={`w-7 h-7 rounded-xl bg-white/[0.04] border ${card.borderColor} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${card.accentText}`} />
                </div>
              </div>

              <div className="mt-3 sm:mt-4">
                {loading ? (
                  <div className="h-8 w-16 bg-white/[0.06] rounded-md animate-pulse" />
                ) : (
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono tabular-nums tracking-tight text-white">
                    {card.value}
                  </div>
                )}
                <p className="text-[10px] text-zinc-400 mt-1 font-mono uppercase tracking-wider truncate">
                  {card.sub}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
