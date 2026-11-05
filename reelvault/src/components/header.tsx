"use client";

import React from "react";
import Link from "next/link";
import { UploadCloud, Sparkles, Flame, Film, Bot } from "lucide-react";

export function Header() {
  return (
    <header className="px-6 lg:px-8 py-5 border-b border-[#161822] bg-[#08090d]/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            ReelVault Studio
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-semibold">
              Live Production
            </span>
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
          <span>Harshith & Claude</span>
          <span className="text-zinc-600">•</span>
          <span>100 Days of Free AI Instagram Series</span>
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Series Badge Indicator */}
        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0f1118] border border-[#212433] text-xs">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
          </div>
          <span className="text-zinc-400 font-semibold text-[11px] tracking-wider uppercase">Series:</span>
          <span className="text-white font-bold tracking-tight">100 DAYS OF FREE AI</span>
          <span className="h-3.5 w-px bg-[#212433]" />
          <span className="text-brand font-mono font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-brand" />
            DAY 01 / 100
          </span>
        </div>

        {/* Upload Action Button */}
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand via-[#ff6830] to-[#e04b15] hover:from-[#ff6830] hover:to-brand text-white text-xs font-bold transition-all duration-200 shadow-glow hover:scale-[1.02] active:scale-[0.98]"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Reel</span>
        </Link>
      </div>
    </header>
  );
}
