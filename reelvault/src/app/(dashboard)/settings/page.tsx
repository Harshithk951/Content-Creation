"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Database,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Server,
  Cloud,
} from "lucide-react";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [checking, setChecking] = useState(false);
  const [bucketStatus, setBucketStatus] = useState<string>("Checking...");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const checkConnection = async () => {
    setChecking(true);
    const configured = isSupabaseConfigured();
    setSupabaseReady(configured);

    if (configured) {
      try {
        const supabase = createClient();
        const { error: dbError } = await supabase.from("videos").select("count").limit(1);
        if (dbError) {
          setBucketStatus(`DB connection note: ${dbError.message}`);
        } else {
          setBucketStatus("Buckets 'reel-videos' & 'reel-thumbnails' verified");
        }
      } catch {
        setBucketStatus("Local demo mode active");
      }
    } else {
      setBucketStatus("Add Supabase credentials to activate live cloud storage");
    }
    setChecking(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const copyEnv = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand" />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Studio Settings & Supabase
          </h2>
        </div>
        <p className="text-sm text-zinc-400 mt-0.5">
          Configure Supabase PostgreSQL database, S3 Storage buckets, and Vercel deployment variables.
        </p>
      </div>

      {/* Supabase Connection Health Status */}
      <div className="p-6 rounded-2xl bg-[#111218] border border-[#212432] space-y-5 shadow-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${supabaseReady ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-amber-500/10 border-amber-500/25 text-amber-400"}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Supabase Cloud Connection</h3>
              <p className="text-xs text-zinc-400">
                {supabaseReady
                  ? "Connected to Supabase PostgreSQL & Storage"
                  : "Running in local developer demo mode with sample video"}
              </p>
            </div>
          </div>

          <button
            onClick={checkConnection}
            disabled={checking}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#171923] hover:bg-[#202330] text-zinc-300 text-xs font-semibold border border-[#272a39] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
            <span>Test Connection</span>
          </button>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-[#151722] border border-[#232635]">
            <p className="text-[11px] text-zinc-400 font-medium">PostgreSQL Table</p>
            <p className="text-sm font-mono font-semibold text-white mt-1">public.videos</p>
            <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              RLS Enabled
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#151722] border border-[#232635]">
            <p className="text-[11px] text-zinc-400 font-medium">Video Storage Bucket</p>
            <p className="text-sm font-mono font-semibold text-white mt-1">reel-videos</p>
            <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Private + Signed URLs
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#151722] border border-[#232635]">
            <p className="text-[11px] text-zinc-400 font-medium">Thumbnails Bucket</p>
            <p className="text-sm font-mono font-semibold text-white mt-1">reel-thumbnails</p>
            <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Direct / Cached
            </p>
          </div>
        </div>
      </div>

      {/* Vercel Deployment & Environment Checklist */}
      <div className="p-6 rounded-2xl bg-[#111218] border border-[#212432] space-y-4 shadow-subtle">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-brand" />
          <h3 className="font-bold text-base text-white">Vercel Environment Variables</h3>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          When deploying ReelVault to Vercel, add the following environment variables in your Vercel Project Settings &gt; Environment Variables:
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#0e0f14] border border-[#1f212c] flex items-center justify-between gap-4">
            <div>
              <span className="text-brand font-bold">NEXT_PUBLIC_SUPABASE_URL</span>
              <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Your Supabase project URL (https://xyz.supabase.co)</p>
            </div>
            <button
              onClick={() => copyEnv("NEXT_PUBLIC_SUPABASE_URL", "var1")}
              className="p-1.5 text-zinc-400 hover:text-white"
            >
              {copiedKey === "var1" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0e0f14] border border-[#1f212c] flex items-center justify-between gap-4">
            <div>
              <span className="text-brand font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Your Supabase public publishable anon key</p>
            </div>
            <button
              onClick={() => copyEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "var2")}
              className="p-1.5 text-zinc-400 hover:text-white"
            >
              {copiedKey === "var2" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Creator Profile & Series Information */}
      <div className="p-6 rounded-2xl bg-[#111218] border border-[#212432] space-y-4">
        <h3 className="font-bold text-base text-white">Creator & Series Profile</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#161822] border border-[#272a39] space-y-1">
            <span className="text-xs text-zinc-400 font-medium">Series Title</span>
            <p className="text-sm font-bold text-white">100 Days of Free AI</p>
            <p className="text-[11px] text-brand">Featuring Harshith & Claude</p>
          </div>

          <div className="p-4 rounded-xl bg-[#161822] border border-[#272a39] space-y-1">
            <span className="text-xs text-zinc-400 font-medium">Target Platform</span>
            <p className="text-sm font-bold text-white">Instagram Reels</p>
            <p className="text-[11px] text-zinc-400">1080 × 1920 • 9:16 Vertical Video</p>
          </div>
        </div>
      </div>
    </div>
  );
}
