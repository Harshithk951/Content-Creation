"use client";

import React from "react";
import Link from "next/link";
import { UploadCloud, Sparkles, Instagram, Flame } from "lucide-react";

export function Header() {
  return (
    <header className="px-8 py-6 border-b border-[#1f222b] bg-[#0c0d12]/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Welcome back, Harshith
            <span className="text-xl">👋</span>
          </h1>
        </div>
        <p className="text-sm text-zinc-400 mt-0.5">
          Your AI Reel production library featuring Harshith & Claude.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Series Badge Indicator */}
        <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#14161e] border border-[#262936] text-xs">
          <div className="w-2 h-2 rounded-full bg-brand animate-ping" />
          <span className="text-zinc-400 font-medium">CURRENT SERIES:</span>
          <span className="text-white font-bold tracking-wide">100 DAYS OF FREE AI</span>
          <span className="h-3.5 w-px bg-[#262936]" />
          <span className="text-brand font-mono font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-brand" />
            DAY 01 / 100
          </span>
        </div>

        {/* Upload Action Button */}
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-semibold transition-all duration-150 shadow-glow hover:scale-[1.02] active:scale-[0.98]"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Reel</span>
        </Link>
      </div>
    </header>
  );
}
