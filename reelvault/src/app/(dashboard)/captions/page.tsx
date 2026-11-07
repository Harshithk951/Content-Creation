"use client";

import React, { useState, useEffect } from "react";
import {
  Hash,
  Copy,
  Check,
  Calendar,
  Clock,
  Pin,
  MessageSquare,
  ArrowRight,
  Save,
  Send,
} from "lucide-react";
import { VideoRecord } from "@/types/video";
import { fetchVideos, updateVideo } from "@/lib/video-service";
import { useToast } from "@/components/toast";

export default function CaptionsPage() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields for the selected episode
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [pinnedComment, setPinnedComment] = useState("");
  const [cta, setCta] = useState("");
  const [postingDate, setPostingDate] = useState("");
  const [postingTime, setPostingTime] = useState("18:30");

  // Copied button states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos().then((list) => {
      const sorted = [...list].sort((a, b) => b.episode_number - a.episode_number);
      setVideos(sorted);
      if (sorted.length > 0) {
        setSelectedVideoId(sorted[0].id);
      }
      setLoading(false);
    });
  }, []);

  const activeVideo = videos.find((v) => v.id === selectedVideoId) || videos[0];

  useEffect(() => {
    if (activeVideo) {
      setCaption(activeVideo.caption || "");
      setHashtags(activeVideo.hashtags || "");
      setPinnedComment(activeVideo.pinned_comment || "");
      setCta(activeVideo.cta || "");
      setPostingDate(activeVideo.scheduled_at ? activeVideo.scheduled_at.split("T")[0] : "2026-11-05");
    }
  }, [activeVideo]);

  const handleCopy = (text: string, key: string, label: string) => {
    if (!text) {
      toast.error(`No ${label} to copy`);
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`Copied ${label}`, "Ready to paste on Instagram");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyFullPackage = () => {
    const fullPackage = [
      caption,
      "",
      ".",
      ".",
      hashtags,
      "",
      "---",
      `PINNED COMMENT:\n${pinnedComment}`,
      "",
      `CALL TO ACTION:\n${cta}`,
    ].join("\n");

    handleCopy(fullPackage, "full-package", "Full Publishing Package");
  };

  const handleSave = async () => {
    if (!activeVideo) return;
    try {
      setSaving(true);
      await updateVideo(activeVideo.id, {
        caption,
        hashtags,
        pinned_comment: pinnedComment,
        cta,
        scheduled_at: postingDate ? `${postingDate}T${postingTime}:00Z` : null,
      });

      setVideos((prev) =>
        prev.map((v) =>
          v.id === activeVideo.id
            ? {
                ...v,
                caption,
                hashtags,
                pinned_comment: pinnedComment,
                cta,
                scheduled_at: postingDate ? `${postingDate}T${postingTime}:00Z` : null,
              }
            : v
        )
      );

      toast.success("Package saved", `Updated metadata for Day ${activeVideo.episode_number}`);
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-brand uppercase font-medium">
            <Hash className="w-3.5 h-3.5" />
            <span>Distribution Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-white mt-1">
            Captions & Publishing Package
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-normal">
            Optimized copy, pinned comments, and hashtag sets for Instagram reels.
          </p>
        </div>

        {/* Global Copy Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyFullPackage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium transition-colors"
          >
            {copiedKey === "full-package" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === "full-package" ? "Package Copied" : "Copy Full Package"}</span>
          </button>
        </div>
      </div>

      {/* Episode Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {videos.map((vid) => (
          <button
            key={vid.id}
            onClick={() => setSelectedVideoId(vid.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono tabular-nums whitespace-nowrap transition-colors border ${
              activeVideo?.id === vid.id
                ? "bg-white text-black font-semibold border-white"
                : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            Day {vid.episode_number.toString().padStart(2, "0")} • {vid.title.slice(0, 24)}...
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-96 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
      ) : !activeVideo ? (
        <div className="p-12 text-center rounded-2xl bg-[#090a0f] border border-white/[0.06] text-zinc-500 font-mono text-xs">
          No video records found. Ingest your first reel to generate publishing packages.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editing Column (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* 1. Instagram Caption */}
            <div className="p-6 rounded-2xl bg-[#090a0f] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono tracking-[0.18em] uppercase text-zinc-400 font-medium">
                    Primary Caption
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Hook, body value delivery, and engagement trigger</p>
                </div>

                <button
                  onClick={() => handleCopy(caption, "caption", "Caption")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-mono transition-colors border border-white/[0.06]"
                >
                  {copiedKey === "caption" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copiedKey === "caption" ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <textarea
                rows={6}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-brand transition-colors resize-none leading-relaxed font-sans"
                placeholder="Write your reel caption..."
              />
              <div className="flex items-center justify-between text-[10px] font-mono tabular-nums text-zinc-500">
                <span>{caption.length} characters</span>
                <span>Optimized length: 150 – 350 chars</span>
              </div>
            </div>

            {/* 2. Hashtags Set */}
            <div className="p-6 rounded-2xl bg-[#090a0f] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono tracking-[0.18em] uppercase text-zinc-400 font-medium">
                    Hashtag Set
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Categorization tags for algorithmic feed discovery</p>
                </div>

                <button
                  onClick={() => handleCopy(hashtags, "hashtags", "Hashtags")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-mono transition-colors border border-white/[0.06]"
                >
                  {copiedKey === "hashtags" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copiedKey === "hashtags" ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-zinc-300 text-xs focus:outline-none focus:border-brand transition-colors resize-none font-mono leading-relaxed"
                placeholder="#100DaysOfFreeAI #AI #OpenSource..."
              />
            </div>

            {/* 3. Pinned Comment & CTA Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#090a0f] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono tracking-[0.18em] uppercase text-zinc-400 font-medium flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5 text-brand" />
                    Pinned Comment
                  </label>
                  <button
                    onClick={() => handleCopy(pinnedComment, "pinned", "Pinned Comment")}
                    className="p-1 text-zinc-400 hover:text-white transition-colors"
                    title="Copy Pinned Comment"
                  >
                    {copiedKey === "pinned" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={pinnedComment}
                  onChange={(e) => setPinnedComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-brand transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#090a0f] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono tracking-[0.18em] uppercase text-zinc-400 font-medium flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-brand" />
                    Call to Action (CTA)
                  </label>
                  <button
                    onClick={() => handleCopy(cta, "cta", "CTA")}
                    className="p-1 text-zinc-400 hover:text-white transition-colors"
                    title="Copy CTA"
                  >
                    {copiedKey === "cta" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-brand transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save Package Changes"}</span>
              </button>
            </div>
          </div>

          {/* Publishing Schedule Column (1 col) */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#090a0f] border border-white/[0.06] space-y-4 shadow-subtle">
              <h3 className="text-xs font-mono tracking-[0.18em] uppercase text-zinc-400 font-medium flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand" />
                Publishing Schedule
              </h3>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Posting Date</label>
                <input
                  type="date"
                  value={postingDate}
                  onChange={(e) => setPostingDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Posting Time</label>
                <input
                  type="time"
                  value={postingTime}
                  onChange={(e) => setPostingTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-brand"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-wider text-brand font-medium">Slot Recommendation</p>
                <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                  Prime reel release window: <strong className="text-white font-medium">6:00 PM – 8:30 PM</strong> in your core viewer timezone.
                </p>
              </div>
            </div>

            {/* Feed Metadata Preview */}
            <div className="p-5 rounded-2xl bg-[#090a0f] border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-orange-500/30">
                  <img src="/avatars/harshith_official.jpg" alt="Harshith" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">@harshith.claude</p>
                  <p className="text-[10px] font-mono text-zinc-500">100 Days of Free AI</p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-4">
                {caption}
              </p>

              <p className="text-[11px] text-zinc-500 font-mono line-clamp-2">
                {hashtags}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
