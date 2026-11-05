"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  UploadCloud,
  CalendarDays,
  Hash,
  Sliders,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Studio Overview", href: "/", icon: LayoutDashboard },
  { label: "Reel Library", href: "/library", icon: Film, count: "01" },
  { label: "Ingest Video", href: "/upload", icon: UploadCloud },
  { label: "100-Day Timeline", href: "/calendar", icon: CalendarDays },
  { label: "Publishing Package", href: "/captions", icon: Hash },
  { label: "Master Presets", href: "/settings", icon: Sliders },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen shrink-0 border-r border-white/[0.06] bg-[#050609] flex flex-col justify-between select-none relative z-30">
      {/* Top: Branding */}
      <div>
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/" className="block group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white">
                <Film className="w-4 h-4 text-brand" />
              </div>
              <div>
                <span className="font-semibold text-sm tracking-tight text-white block group-hover:text-brand transition-colors">
                  ReelVault
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase block mt-0.5">
                  100 Days of Free AI
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase font-medium">
            Navigation
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors group",
                  isActive
                    ? "bg-white/[0.06] text-white border border-white/[0.08] font-medium"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03] font-normal"
                )}
              >
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

                {item.count && (
                  <span className="font-mono tabular-nums text-[10px] text-zinc-500 px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.05]">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Co-Hosts Card */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-3">
          <div className="flex -space-x-1.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-medium text-white border border-black">
              H
            </div>
            <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 border border-black">
              <Bot className="w-3.5 h-3.5 text-brand" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">Harshith & Claude</p>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider truncate">100-Day Reel Production</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
