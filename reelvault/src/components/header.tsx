"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UploadCloud, Circle, Sparkles, ExternalLink, ShieldCheck } from "lucide-react";
import { fetchVideos } from "@/lib/video-service";

export function Header() {
  const [episodeCount, setEpisodeCount] = useState<number>(3);

  useEffect(() => {
    fetchVideos().then((v) => setEpisodeCount(v.length)).catch(() => {});
  }, []);

  return (
    <header className="px-4 sm:px-6 lg:px-8 py-4 border-b border-white/[0.08] bg-[#07080c]/90 backdrop-blur-2xl flex items-center justify-between gap-3 sticky top-0 z-30 select-none">
      {/* Left: Series Title & Live Ticker */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono tracking-wider text-emerald-400 uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Day {episodeCount.toString().padStart(2, "0")} Active
            </span>
            <span className="hidden sm:inline text-zinc-600 text-xs">•</span>
            <span className="hidden sm:inline font-mono text-[10px] tracking-[0.16em] text-zinc-400 uppercase">
              1080×1920 @ 30FPS Mastered
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white truncate mt-0.5">
            100 Days of Free AI
          </h1>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notion Guide Link */}
        <a
          href="https://app.notion.com/p/40f7cd75d68b81bda8d6e3bf4a7e4866?pvs=204"
          target="_blank"
          rel="noreferrer"
          className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span>Notion Hub</span>
          <ExternalLink className="w-3 h-3 text-zinc-500" />
        </a>

        {/* Primary Action Button (Ingest Reel) */}
        <Link
          href="/upload"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand to-brand-light text-white font-medium text-xs shadow-[0_4px_16px_rgba(255,90,31,0.3)] hover:brightness-110 active:scale-95 transition-all min-h-[40px]"
        >
          <UploadCloud className="w-4 h-4" />
          <span className="hidden xs:inline">Ingest Reel</span>
          <span className="xs:hidden">Upload</span>
        </Link>
      </div>
    </header>
  );
}
