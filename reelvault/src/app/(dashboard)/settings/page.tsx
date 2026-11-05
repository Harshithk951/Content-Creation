"use client";

import React, { useState } from "react";
import {
  Sliders,
  Film,
  Volume2,
  Share2,
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
        <div className="flex items-center gap-2 text-brand font-mono text-[10px] tracking-[0.2em] uppercase font-medium">
          <Sliders className="w-3.5 h-3.5" />
          <span>Master Studio Presets</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-white mt-1">
          Production Specifications
        </h2>
        <p className="text-xs text-zinc-400 mt-1 font-normal">
          Format standards and audio-video mastering targets for the 100 Days of Free AI reel pipeline.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Video Render Preset */}
        <div className="p-6 rounded-2xl bg-[#090a0f] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white">
                <Film className="w-4 h-4 text-brand" />
              </div>
              <div>
                <h3 className="text-xs font-mono tracking-[0.18em] uppercase text-zinc-400 font-medium">Video Encoding Profile</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Instagram vertical reel master render target</p>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.06]">
              Master Quality
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Resolution</label>
              <input
                type="text"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Frame Rate</label>
              <input
                type="text"
                value={frameRate}
                onChange={(e) => setFrameRate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs font-mono tabular-nums">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Codec</span>
              <span className="font-medium text-white mt-0.5 block">H.264 / AVC</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Color Space</span>
              <span className="font-medium text-white mt-0.5 block">BT.709 Rec.</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Profile</span>
              <span className="font-medium text-white mt-0.5 block">High@L4.2</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Pixel Format</span>
              <span className="font-medium text-white mt-0.5 block">yuv420p</span>
            </div>
          </div>
        </div>

        {/* Audio Mastering Preset */}
        <div className="p-6 rounded-2xl bg-[#090a0f] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white">
                <Volume2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xs font-mono tracking-[0.18em] uppercase text-zinc-400 font-medium">Audio Mastering & Normalization</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">EBU R128 speech loudnorm target</p>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Integrated Loudness (I)</label>
              <input
                type="text"
                value={loudnessTarget}
                onChange={(e) => setLoudnessTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">True Peak (TP)</label>
              <input
                type="text"
                disabled
                value="-1.0 dBFS Maximum"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.01] border border-white/[0.04] text-zinc-500 text-xs font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs font-mono tabular-nums">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Sample Rate</span>
              <span className="font-medium text-white mt-0.5 block">48.0 kHz</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Channels</span>
              <span className="font-medium text-white mt-0.5 block">2 (Stereo)</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Bitrate</span>
              <span className="font-medium text-white mt-0.5 block">192 kbps AAC</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">LRA</span>
              <span className="font-medium text-white mt-0.5 block">7.0 LU Target</span>
            </div>
          </div>
        </div>

        {/* Default Call-to-Action Template */}
        <div className="p-6 rounded-2xl bg-[#090a0f] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-brand" />
              <h3 className="text-xs font-mono tracking-[0.18em] uppercase text-zinc-400 font-medium">Default Call-To-Action (CTA)</h3>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(defaultCta, "cta")}
              className="text-xs text-zinc-400 hover:text-white font-mono flex items-center gap-1 transition-colors"
            >
              {copiedKey === "cta" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === "cta" ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <textarea
            rows={2}
            value={defaultCta}
            onChange={(e) => setDefaultCta(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs leading-relaxed focus:outline-none focus:border-brand resize-none font-sans"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium transition-colors"
          >
            Save Presets
          </button>
        </div>
      </form>
    </div>
  );
}
