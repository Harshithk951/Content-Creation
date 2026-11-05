import React from "react";
import Link from "next/link";
import { Film, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090a0d] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand via-[#ff6a33] to-[#d83f05] flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-2xl tracking-tight text-white">
              ReelVault
            </span>
            <p className="text-xs font-medium text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand" />
              100 Days of Free AI
            </p>
          </div>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="p-8 rounded-2xl bg-[#111218] border border-[#212432] shadow-2xl backdrop-blur-xl">
          {children}
        </div>
      </div>

      {/* Footer text */}
      <p className="text-xs text-zinc-500 mt-8 text-center relative z-10">
        Personal Studio Dashboard for Harshith & Claude • Protected by Supabase Auth
      </p>
    </div>
  );
}
