"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  Sparkles,
  ExternalLink,
  Instagram,
  UploadCloud,
  Menu,
  X,
  Calendar,
  Hash,
  Library,
  ChevronRight,
} from "lucide-react";

export function WebsiteNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Episodes", href: "/library" },
    { label: "100-Day Roadmap", href: "/calendar" },
    { label: "Social Copy", href: "/captions" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#FAF8F5]/85 border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Creator Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-orange-500/80 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src="/avatars/harshith_official.jpg"
                  alt="Harshith Kumar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#FAF8F5]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors">
                  100 Days of Free AI
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase bg-orange-100 text-orange-700 border border-orange-200">
                  Free
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                by <span className="font-semibold text-stone-700">@harshith.claude</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white text-stone-900 shadow-sm border border-stone-200/90 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Links & Bio External Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href="https://app.notion.com/p/40f7cd75d68b81bda8d6e3bf4a7e4866"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 text-xs font-semibold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Notion Guide Library</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href="https://instagram.com/harshith.claude"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/90 flex items-center justify-center transition-colors shadow-xs"
              title="Follow @harshith.claude on Instagram"
            >
              <Instagram className="w-4 h-4 text-pink-600" />
            </a>

            <Link
              href="/upload"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Ingest Reel</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href="https://app.notion.com/p/40f7cd75d68b81bda8d6e3bf4a7e4866"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-orange-100 text-orange-700 text-[11px] font-bold font-mono"
            >
              Notion Hub
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-stone-200 bg-[#FAF8F5] px-4 pt-2 pb-5 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                  isActive
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200 font-semibold"
                    : "text-stone-700 hover:bg-stone-200/50"
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
            );
          })}

          <div className="pt-2 border-t border-stone-200/80 flex flex-col gap-2">
            <a
              href="https://app.notion.com/p/40f7cd75d68b81bda8d6e3bf4a7e4866"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 font-semibold text-xs"
            >
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Public Notion Guide Library</span>
            </a>

            <a
              href="https://instagram.com/harshith.claude"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-semibold text-xs"
            >
              <Instagram className="w-4 h-4 text-pink-600" />
              <span>Follow @harshith.claude on Instagram</span>
            </a>

            <Link
              href="/upload"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Ingest Master Reel</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
