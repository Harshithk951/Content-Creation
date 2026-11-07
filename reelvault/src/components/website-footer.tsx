"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Instagram, ExternalLink, Heart, Film } from "lucide-react";

export function WebsiteFooter() {
  return (
    <footer className="w-full border-t border-stone-200/80 bg-[#FAF8F5] pt-12 pb-16 text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-orange-500/80 shadow-xs">
                <img
                  src="/avatars/harshith_official.jpg"
                  alt="Harshith Kumar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">100 Days of Free AI</h3>
                <p className="text-xs text-stone-500 font-mono">Created by Harshith Kumar & Claude</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md">
              Democratizing state-of-the-art artificial intelligence for students, developers, and creators worldwide.
              Every tool and workflow in this series is verified to be 100% free with zero required subscriptions.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://instagram.com/harshith.claude"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-800 hover:text-pink-600 hover:border-pink-200 transition-colors shadow-xs"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>@harshith.claude</span>
              </a>

              <a
                href="https://app.notion.com/p/40f7cd75d68b81bda8d6e3bf4a7e4866"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Notion Guide Library</span>
              </a>
            </div>
          </div>

          {/* Col 2: Series Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900">
              Series Exploration
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-stone-900 transition-colors">
                  Featured Episode
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-stone-900 transition-colors">
                  Master Reel Library
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-stone-900 transition-colors">
                  100-Day Roadmap & Phases
                </Link>
              </li>
              <li>
                <Link href="/captions" className="hover:text-stone-900 transition-colors">
                  Instagram Social Package
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Co-Hosts Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900">
              Co-Hosts & Voices
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-blue-500/40 shrink-0">
                  <img src="/avatars/harshith_official.jpg" alt="Harshith" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-900 leading-tight">Harshith Kumar</div>
                  <div className="text-[10px] text-stone-500 font-mono">Lead Creator • Liam Voice</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-orange-500/40 shrink-0">
                  <img src="/avatars/claude_official.jpg" alt="Claude" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-900 leading-tight">Claude (AI Co-Host)</div>
                  <div className="text-[10px] text-stone-500 font-mono">Deadpan Genius • George Voice</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-mono">
          <div>
            © {new Date().getFullYear()} 100 Days of Free AI. Open educational series.
          </div>
          <div className="flex items-center gap-1 text-stone-600">
            <span>Built with zero subscription fees forever.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
