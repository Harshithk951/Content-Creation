"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  UploadCloud,
  CalendarDays,
  Hash,
  Sliders,
  ExternalLink,
  Sparkles,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchVideos } from "@/lib/video-service";

const navItems = [
  { label: "Studio Overview", href: "/", icon: LayoutDashboard },
  { label: "Reel Library", href: "/library", icon: Film, hasCount: true },
  { label: "Ingest Video", href: "/upload", icon: UploadCloud },
  { label: "100-Day Timeline", href: "/calendar", icon: CalendarDays },
  { label: "Publishing Package", href: "/captions", icon: Hash },
  { label: "Master Presets", href: "/settings", icon: Sliders },
];

export function Sidebar() {
  const pathname = usePathname();
  const [videoCount, setVideoCount] = useState<number>(3);

  useEffect(() => {
    fetchVideos().then((v) => setVideoCount(v.length)).catch(() => {});
  }, []);

  return (
    <aside className="w-64 lg:w-72 h-screen sticky top-0 shrink-0 border-r border-white/[0.08] bg-[#07080c]/95 backdrop-blur-2xl flex flex-col justify-between select-none relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      {/* Top: Branding */}
      <div>
        <div className="p-6 border-b border-white/[0.08]">
          <Link href="/" className="block group">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/30 flex items-center justify-center text-brand shadow-[0_0_20px_rgba(255,90,31,0.2)] group-hover:scale-105 transition-transform duration-300">
                <Film className="w-5 h-5 text-brand" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-base tracking-tight text-white block group-hover:text-brand transition-colors">
                    ReelVault
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-brand/10 text-brand text-[9px] font-mono font-bold tracking-wider">
                    PRO
                  </span>
                </div>
                <span className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase block mt-0.5">
                  100 Days of Free AI
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-1.5 text-[10px] font-mono tracking-[0.22em] text-zinc-400 uppercase font-semibold">
            WORKSPACE
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 group relative",
                  isActive
                    ? "bg-white/[0.08] text-white font-medium border border-white/[0.12] shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03] font-normal"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand shadow-[0_0_8px_#ff5a1f]" />
                )}
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-brand"
                        : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.hasCount && (
                  <span className="font-mono tabular-nums text-[10px] text-zinc-400 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
                    {videoCount.toString().padStart(2, "0")}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Middle/Bottom: Notion Quick Access & Co-Hosts Card */}
      <div className="p-4 border-t border-white/[0.08] space-y-3">
        {/* Public Notion Link */}
        <a
          href="https://app.notion.com/p/40f7cd75d68b81bda8d6e3bf4a7e4866?pvs=204"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-brand/10 to-transparent border border-brand/20 text-xs text-white hover:border-brand/40 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-brand animate-pulse" />
            <div>
              <span className="font-medium text-xs block text-white">Notion Guide Hub</span>
              <span className="text-[10px] text-zinc-400 font-mono">Bio Link Active</span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
        </a>

        {/* Co-Hosts Card with Real Avatars & Voices */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img
                src="/avatars/harshith_official.jpg"
                alt="Harshith"
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-500 shadow-sm"
              />
              <img
                src="/avatars/claude_official.jpg"
                alt="Claude"
                className="w-8 h-8 rounded-full object-cover border-2 border-orange-500 shadow-sm"
              />
            </div>
            <div>
              <span className="font-medium text-xs text-white block">Harshith & Claude</span>
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider block">
                ElevenLabs Liam & George
              </span>
            </div>
          </div>

          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
        </div>
      </div>
    </aside>
  );
}
