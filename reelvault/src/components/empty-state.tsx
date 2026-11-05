"use client";

import React from "react";
import Link from "next/link";
import { Film, UploadCloud } from "lucide-react";

interface EmptyStateProps {
  onResetFilters?: () => void;
  isFiltered?: boolean;
}

export function EmptyState({ onResetFilters, isFiltered }: EmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-[#090a0f] border border-white/[0.06] my-6">
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-400 mb-3">
          <Film className="w-5 h-5" />
        </div>
        <h3 className="text-base font-medium text-white tracking-tight">No matching reels found</h3>
        <p className="text-xs text-zinc-400 max-w-sm mt-1">
          No records match your active search filter criteria.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="mt-4 px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 text-xs font-mono transition-colors border border-white/[0.08]"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-[#090a0f] border border-white/[0.06] my-6 relative overflow-hidden">
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 mb-4">
        <Film className="w-5 h-5" />
      </div>

      <h3 className="text-xl font-medium text-white tracking-tight">
        Master Video Library Empty
      </h3>

      <p className="text-xs text-zinc-400 max-w-sm mt-1.5 leading-relaxed">
        Ingest your first 9:16 vertical video reel to start building the 100 Days of Free AI archive.
      </p>

      <div className="mt-5 flex items-center gap-3">
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Ingest First Reel</span>
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
        <span>Episode 01 Master • Ready for Ingest</span>
      </div>
    </div>
  );
}
