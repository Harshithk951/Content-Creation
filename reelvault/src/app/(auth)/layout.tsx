import React from "react";
import Link from "next/link";
import { Film } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#06070a] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white">
            <Film className="w-5 h-5 text-brand" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-xl tracking-tight text-white block">
              ReelVault
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 block mt-0.5">
              100 Days of Free AI
            </span>
          </div>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="p-8 rounded-3xl bg-[#090a0f] border border-white/[0.08] shadow-2xl">
          {children}
        </div>
      </div>

      <p className="text-[11px] font-mono text-zinc-600 mt-8 text-center relative z-10">
        Personal Studio Dashboard for Harshith & Claude
      </p>
    </div>
  );
}
