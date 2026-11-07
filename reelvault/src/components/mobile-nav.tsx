"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  UploadCloud,
  CalendarDays,
  Hash,
  Sliders,
  Menu,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Library", href: "/library", icon: Film },
  { label: "Ingest", href: "/upload", icon: UploadCloud },
  { label: "Timeline", href: "/calendar", icon: CalendarDays },
  { label: "Captions", href: "/captions", icon: Hash },
];

export function MobileNav({
  videoCount = 3,
}: {
  videoCount?: number;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ── Fixed Floating Bottom Navigation Dock (Mobile Only) ── */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-3 inset-x-3 z-40 md:hidden pb-[env(safe-area-inset-bottom)]"
      >
        <div className="bg-[#0b0d14]/90 backdrop-blur-2xl border border-white/[0.12] rounded-2xl px-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 relative min-h-[44px]",
                  isActive
                    ? "text-brand font-medium"
                    : "text-zinc-400 hover:text-zinc-200 active:scale-95"
                )}
              >
                {isActive && (
                  <span className="absolute -top-1 w-1 h-1 rounded-full bg-brand shadow-[0_0_8px_#ff5a1f]" />
                )}
                <Icon className={cn("w-5 h-5", isActive ? "text-brand" : "text-zinc-400")} />
                <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              </Link>
            );
          })}

          {/* More Drawer Trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl text-zinc-400 hover:text-zinc-200 active:scale-95 min-h-[44px]"
            aria-label="Open More Menu"
          >
            <Menu className="w-5 h-5 text-zinc-400" />
            <span className="text-[10px] tracking-tight mt-0.5">More</span>
          </button>
        </div>
      </nav>

      {/* ── Fullscreen Fluid Glass Drawer (Mobile Menu) ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/70 backdrop-blur-xl animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative bg-[#0b0d14] border-t border-white/[0.12] rounded-t-3xl p-6 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto pb-[calc(24px+env(safe-area-inset-bottom))]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">ReelVault Studio</h3>
                  <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                    100 Days of Free AI
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links list */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 px-2 block mb-2">
                All Studio Sections
              </span>

              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl text-sm transition-all min-h-[48px]",
                      isActive
                        ? "bg-brand/10 border border-brand/30 text-white font-medium"
                        : "text-zinc-300 hover:bg-white/[0.05]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-4 h-4", isActive ? "text-brand" : "text-zinc-400")} />
                      <span>{item.label}</span>
                    </div>
                    {item.href === "/library" && (
                      <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400">
                        {videoCount.toString().padStart(2, "0")}
                      </span>
                    )}
                  </Link>
                );
              })}

              <Link
                href="/settings"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-sm text-zinc-300 hover:bg-white/[0.05] min-h-[48px]"
              >
                <Sliders className="w-4 h-4 text-zinc-400" />
                <span>Master Presets & Audio</span>
              </Link>
            </div>

            {/* Quick Links Card */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block font-medium">
                Public Creator Links
              </span>
              <a
                href="https://app.notion.com/p/40f7cd75d68b81bda8d6e3bf4a7e4866?pvs=204"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-xs text-brand hover:underline"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Notion Guide Library
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com/harshith.claude"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-xs text-zinc-400 hover:text-white"
              >
                <span>Instagram: @harshith.claude</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Host info */}
            <div className="flex items-center gap-3 pt-2">
              <img
                src="/avatars/harshith_official.jpg"
                alt="Harshith"
                className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shadow-md"
              />
              <img
                src="/avatars/claude_official.jpg"
                alt="Claude"
                className="w-9 h-9 rounded-full object-cover border-2 border-orange-500 shadow-md"
              />
              <div className="text-xs">
                <span className="text-white font-medium block">Harshith & Claude</span>
                <span className="text-zinc-500 text-[10px] font-mono">Series Co-Hosts • 100 Days</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
