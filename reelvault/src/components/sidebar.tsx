"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  UploadCloud,
  CalendarDays,
  Hash,
  Settings,
  LogOut,
  Sparkles,
  Database,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Video Library", href: "/library", icon: Film, badge: "Core" },
  { label: "Upload Video", href: "/upload", icon: UploadCloud },
  { label: "Series Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Captions & Hashtags", href: "/captions", icon: Hash },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [supabaseReady, setSupabaseReady] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("harshith@reelvault.studio");

  React.useEffect(() => {
    const configured = isSupabaseConfigured();
    setSupabaseReady(configured);
    if (configured) {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user?.email) {
          setUserEmail(data.user.email);
        }
      });
    }
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
  };

  return (
    <aside className="w-64 h-screen shrink-0 border-r border-[#22252e] bg-[#0c0d11] flex flex-col justify-between select-none">
      {/* Top: Logo & Brand */}
      <div>
        <div className="p-5 border-b border-[#1b1d24]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand via-[#ff6a33] to-[#d83f05] flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-brand-light transition-colors">
                  ReelVault
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand/15 text-brand border border-brand/25">
                  Pro
                </span>
              </div>
              <p className="text-[11px] font-medium text-zinc-400 tracking-tight flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-brand" />
                100 Days of Free AI
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            Studio Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-[#1d1f27] text-white border border-[#2b2e3a] shadow-subtle"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-[#15161c]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-brand"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand/15 text-brand border border-brand/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Series Progress Card */}
        <div className="px-3 pt-2">
          <div className="p-3.5 rounded-xl bg-[#13141a] border border-[#22242e] relative overflow-hidden">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400 font-medium">Series Progress</span>
              <span className="text-brand font-bold">1% Done</span>
            </div>
            <div className="w-full h-1.5 bg-[#232530] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-[#ff7a45] rounded-full"
                style={{ width: "1%" }}
              />
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between">
              <span>Day 01 / 100</span>
              <span className="text-emerald-400 font-medium">Active</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom: User Profile & Supabase State & Logout */}
      <div className="p-3 border-t border-[#1b1d24] space-y-2">
        {/* Supabase Status Pill */}
        <div className="px-3 py-1.5 rounded-lg bg-[#121318] border border-[#1f2129] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            <span>Supabase DB</span>
          </div>
          <span
            className={cn(
              "flex items-center gap-1 font-medium",
              supabaseReady ? "text-emerald-400" : "text-amber-400"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                supabaseReady ? "bg-emerald-400" : "bg-amber-400"
              )}
            />
            {supabaseReady ? "Connected" : "Local Mode"}
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#15161c] transition-colors group">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2b2e3a] to-[#3a3f4f] border border-[#444959] flex items-center justify-center text-xs font-bold text-white shrink-0">
              H
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Harshith</p>
              <p className="text-[11px] text-zinc-400 truncate">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
