"use client";

import React, { useState } from "react";
import {
  Sliders,
  Film,
  Volume2,
  Share2,
  Sparkles,
  Check,
  Copy,
  Monitor,
  Cpu,
  Layers,
} from "lucide-react";
import { useToast } from "@/components/toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [aspectRatio, setAspectRatio] = useState("1080 × 1920 (9:16 Vertical)");
  const [frameRate, setFrameRate] = useState("30.00 fps Constant");
  const [loudnessTarget, setLoudnessTarget] = useState("-14.0 LUFS (EBU R128)");
  const [defaultCta, setDefaultCta] = useState(
    "Comment VOICE below and I will DM you the complete GitHub repo + local setup script!"
  );

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Preset copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Studio presets saved", "Active configuration updated.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-6">
        <div className="flex items-center gap-2 text-brand font-mono text-[11px] tracking-[0.2em] uppercase">
          <Sliders className="w-3.5 h-3.5" />
          <span>Master Studio Presets</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
          Production Specifications
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Format standards and audio-video mastering targets for the 100 Days of Free AI reel pipeline.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Video Render Preset */}
        <div className="p-6 rounded-2xl bg-[#0c0d13] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand/10 border border-brand/20 text-brand">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Video Encoding Profile</h3>
                <p className="text-xs text-zinc-400">Instagram vertical reel render target</p>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.06]">
              Master Quality
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Resolution</label>
              <input
                type="text"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#13151f] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Frame Rate</label>
              <input
                type="text"
                value={frameRate}
                onChange={(e) => setFrameRate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#13151f] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#11121a] border border-white/[0.05]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Codec</span>
              <span className="font-mono font-bold text-zinc-200 mt-0.5 block">H.264 / AVC</span>
            </div>
            <div className="p-3 rounded-xl bg-[#11121a] border border-white/[0.05]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Color Space</span>
              <span className="font-mono font-bold text-zinc-200 mt-0.5 block">BT.709 Rec.</span>
            </div>
            <div className="p-3 rounded-xl bg-[#11121a] border border-white/[0.05]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Profile</span>
              <span className="font-mono font-bold text-zinc-200 mt-0.5 block">High@L4.2</span>
            </div>
            <div className="p-3 rounded-xl bg-[#11121a] border border-white/[0.05]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Pixel Format</span>
              <span className="font-mono font-bold text-zinc-200 mt-0.5 block">yuv420p</span>
            </div>
          </div>
        </div>

        {/* Audio Mastering Preset */}
        <div className="p-6 rounded-2xl bg-[#0c0d13] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Audio Mastering & Normalization</h3>
                <p className="text-xs text-zinc-400">EBU R128 speech loudnorm target</p>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Integrated Loudness (I)</label>
              <input
                type="text"
                value={loudnessTarget}
                onChange={(e) => setLoudnessTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#13151f] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">True Peak (TP)</label>
              <input
                type="text"
                disabled
                value="-1.0 dBFS Maximum"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#13151f]/50 border border-white/[0.04] text-zinc-400 text-xs font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#11121a] border border-white/[0.05]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Sample Rate</span>
              <span className="font-mono font-bold text-zinc-200 mt-0.5 block">48.0 kHz</span>
            </div>
            <div className="p-3 rounded-xl bg-[#11121a] border border-white/[0.05]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Channels</span>
              <span className="font-mono font-bold text-zinc-200 mt-0.5 block">2 (Stereo)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#11121a] border border-white/[0.05]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Bitrate</span>
              <span className="font-mono font-bold text-zinc-200 mt-0.5 block">192 kbps AAC</span>
            </div>
            <div className="p-3 rounded-xl bg-[#11121a] border border-white/[0.05]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">LRA</span>
              <span className="font-mono font-bold text-zinc-200 mt-0.5 block">7.0 LU Target</span>
            </div>
          </div>
        </div>

        {/* Default Call-to-Action Template */}
        <div className="p-6 rounded-2xl bg-[#0c0d13] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-brand" />
              <h3 className="text-sm font-bold text-white tracking-wide">Default Call-To-Action (CTA)</h3>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(defaultCta, "cta")}
              className="text-xs text-brand hover:text-brand-light font-semibold flex items-center gap-1"
            >
              {copiedKey === "cta" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === "cta" ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <textarea
            rows={2}
            value={defaultCta}
            onChange={(e) => setDefaultCta(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#13151f] border border-white/[0.08] text-white text-xs leading-relaxed focus:outline-none focus:border-brand resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-glow hover:scale-[1.01] active:scale-[0.99]"
          >
            Save Presets
          </button>
        </div>
      </form>
    </div>
  );
}
