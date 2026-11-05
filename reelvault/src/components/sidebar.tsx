"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  UploadCloud,
  CalendarDays,
  Hash,
  Settings,
  Sparkles,
  Database,
  Flame,
  Radio,
  ExternalLink,
  Bot,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Video Library", href: "/library", icon: Film, badge: "Live" },
  { label: "Upload Studio", href: "/upload", icon: UploadCloud },
  { label: "Series Roadmap", href: "/calendar", icon: CalendarDays, badge: "100d" },
  { label: "Captions & Tags", href: "/captions", icon: Hash },
  { label: "Cloud & Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [supabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    setSupabaseReady(isSupabaseConfigured());
  }, []);

  return (
    <aside className="w-64 h-screen shrink-0 border-r border-[#191b24] bg-[#08090d]/95 backdrop-blur-2xl flex flex-col justify-between select-none relative z-30">
      {/* Top: Logo & Brand */}
      <div>
        <div className="p-5 border-b border-[#161822]">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5a1f] via-[#ff783e] to-[#d83f05] flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#08090d]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-brand-light transition-colors">
                  ReelVault
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-brand/15 text-brand border border-brand/30">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] font-medium text-zinc-400 tracking-tight flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-brand" />
                100 Days of Free AI
              </p>
            </div>
          </Link>
        </div>

        {/* Live Audio Visualizer Pill */}
        <div className="px-3 pt-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#10121a] border border-[#1d202e] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Studio Engine</span>
            </div>
            {/* Animated sound wave bars */}
            <div className="flex items-center gap-0.5 h-4">
              <span className="w-0.5 bg-brand rounded-full animate-wave-1" />
              <span className="w-0.5 bg-brand-light rounded-full animate-wave-2" />
              <span className="w-0.5 bg-emerald-400 rounded-full animate-wave-3" />
              <span className="w-0.5 bg-brand rounded-full animate-wave-4" />
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-1">
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Workspace
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative",
                  isActive
                    ? "bg-gradient-to-r from-[#171924] to-[#13151f] text-white border border-[#2c3042] shadow-subtle"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-[#12131b]"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand" />
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

                {item.badge && (
                  <span
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                      isActive
                        ? "bg-brand/20 text-brand border-brand/30"
                        : "bg-zinc-800/80 text-zinc-400 border-zinc-700/60"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Series Roadmap Progress Card */}
        <div className="px-3 pt-1">
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#10121a] to-[#0c0d14] border border-[#1f2231] relative overflow-hidden">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400 font-medium">Series Cadence</span>
              <span className="text-brand font-mono font-bold">Day 01 / 100</span>
            </div>
            <div className="w-full h-1.5 bg-[#1a1d29] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand via-[#ff7a45] to-emerald-400 rounded-full"
                style={{ width: "1%" }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2 font-mono">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Ep 01 Ready
              </span>
              <span>99 to render</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Co-Hosts Identity (Harshith & Claude) & Cloud Sync */}
      <div className="p-3 border-t border-[#161822] space-y-2.5">
        {/* Supabase Status Pill */}
        <div className="px-3 py-1.5 rounded-lg bg-[#0e1017] border border-[#1b1e29] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Database className="w-3.5 h-3.5 text-zinc-500" />
            <span>Supabase Cloud</span>
          </div>
          <span
            className={cn(
              "flex items-center gap-1 font-semibold text-[10px]",
              supabaseReady ? "text-emerald-400" : "text-amber-400"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                supabaseReady ? "bg-emerald-400" : "bg-amber-400"
              )}
            />
            {supabaseReady ? "Connected" : "Live Standby"}
          </span>
        </div>

        {/* Dual Co-Host Pill: Harshith & Claude */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#11131c] to-[#0e1017] border border-[#1d202d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Harshith avatar */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand to-amber-500 flex items-center justify-center text-[11px] font-bold text-white shadow-subtle">
              H
            </div>
            {/* Claude avatar */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#134e4a] to-[#14b8a6] flex items-center justify-center text-white border border-[#2dd4bf]/30 shadow-subtle">
              <Bot className="w-4 h-4 text-[#5eead4]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Harshith & Claude</p>
              <p className="text-[10px] text-zinc-400 truncate">100 Days of Free AI</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
