"use client";

import React from "react";
import { VideoStats } from "@/types/video";
import { formatBytes } from "@/lib/utils";
import { Film, CheckCircle2, Clock, Sparkles } from "lucide-react";

interface StatsCardsProps {
  stats: VideoStats | null;
  loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 sm:h-28 rounded-2xl bg-white border border-stone-200/80 animate-pulse shadow-xs"
          />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Series Target",
      value: "100 Days",
      sub: "1 Episode Daily",
      icon: Film,
      accent: "text-orange-600",
      bgAccent: "bg-orange-50 border-orange-200/70",
    },
    {
      label: "Active Released",
      value: `${stats?.publishedReels || 3} Master Reels`,
      sub: "Days 01, 02 & 03 Live",
      icon: CheckCircle2,
      accent: "text-emerald-700",
      bgAccent: "bg-emerald-50 border-emerald-200/70",
    },
    {
      label: "Annual Cost",
      value: "$0.00 / yr",
      sub: "100% Free Forever",
      icon: Sparkles,
      accent: "text-blue-700",
      bgAccent: "bg-blue-50 border-blue-200/70",
    },
    {
      label: "Master Cache",
      value: stats ? formatBytes(stats.totalStorageBytes) : "21.6 MB",
      sub: "1080×1920 Pro Video",
      icon: Clock,
      accent: "text-purple-700",
      bgAccent: "bg-purple-50 border-purple-200/70",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((it, idx) => {
        const Icon = it.icon;
        return (
          <div
            key={idx}
            className="relative p-3.5 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                {it.label}
              </span>
              <div className={`p-1.5 sm:p-2 rounded-xl border ${it.bgAccent}`}>
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${it.accent}`} />
              </div>
            </div>

            <div className="mt-2 sm:mt-3">
              <div className="text-lg sm:text-2xl font-bold tracking-tight text-stone-900 font-sans">
                {it.value}
              </div>
              <div className="text-[11px] sm:text-xs text-stone-500 font-normal mt-0.5">
                {it.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
