"use client";

import React from "react";
import Link from "next/link";
import { Film, UploadCloud, Sparkles } from "lucide-react";

interface EmptyStateProps {
  onResetFilters?: () => void;
  isFiltered?: boolean;
}

export function EmptyState({ onResetFilters, isFiltered }: EmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-[#111218] border border-[#20232f] my-6">
        <div className="w-14 h-14 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-400 mb-4">
          <Film className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white">No matching videos</h3>
        <p className="text-sm text-zinc-400 max-w-sm mt-1">
          No videos match your search query or selected filter criteria.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] text-brand text-xs font-semibold border border-brand/20 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-2xl bg-[#111218] border border-[#212432] my-6 relative overflow-hidden group">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1b1d28] to-[#252837] border border-[#32364a] flex items-center justify-center text-brand mb-5 shadow-glow">
        <Film className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-bold text-white tracking-tight">
        Your Reel Library is Empty
      </h3>

      <p className="text-sm text-zinc-400 max-w-md mt-2 leading-relaxed">
        Upload your first video and start building your 100 Days of Free AI collection.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-semibold transition-all duration-150 shadow-glow hover:scale-[1.02] active:scale-[0.98]"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload First Video</span>
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500 font-mono">
        <Sparkles className="w-3.5 h-3.5 text-brand" />
        <span>Day 01 / 100 • Kokoro 82M ready for import</span>
      </div>
    </div>
  );
}
