"use client";

import React from "react";
import Link from "next/link";
import { UploadCloud, Circle } from "lucide-react";

export function Header() {
  return (
    <header className="px-8 py-5 border-b border-white/[0.06] bg-[#050609]/90 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 select-none">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-brand uppercase font-medium">
              Episode 01 Active
            </span>
            <span className="text-zinc-600">•</span>
            <span className="font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase">
              1080×1920 @ 30FPS
            </span>
          </div>
          <h1 className="text-lg font-medium tracking-[-0.02em] text-white mt-0.5">
            100 Days of Free AI
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Day Ticker */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono tabular-nums">
          <Circle className="w-1.5 h-1.5 fill-emerald-400 text-emerald-400" />
          <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Cadence:</span>
          <span className="text-white font-medium">Day 01 / 100</span>
        </div>

        {/* Action Button */}
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium transition-colors"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Ingest Reel</span>
        </Link>
      </div>
    </header>
  );
}
