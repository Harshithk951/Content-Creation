"use client";

import React, { useState, useEffect } from "react";
import {
  Hash,
  Copy,
  Check,
  Sparkles,
  Calendar,
  Clock,
  Pin,
  MessageSquare,
  Flame,
  ArrowRight,
  Save,
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
  const [postingTime, setPostingTime] = useState("18:30"); // Prime 6:30 PM slot for reels

  // Copied button states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos().then((list) => {
      setVideos(list);
      if (list.length > 0) {
        setSelectedVideoId(list[0].id);
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
    toast.success(`Copied ${label}`, "Ready to paste on Instagram!");
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
      const updated = await updateVideo(activeVideo.id, {
        caption,
        hashtags,
        pinned_comment: pinnedComment,
        cta,
        scheduled_at: postingDate ? `${postingDate}T${postingTime}:00Z` : null,
      });

      setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      toast.success("Saved", "Instagram package updated successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error("Failed to save", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-brand uppercase font-bold">
            <Hash className="w-3.5 h-3.5" />
            <span>Distribution Kit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            Captions & Publishing Package
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Instagram Reel caption, verified hashtags, and pinned comment for each episode.
          </p>
        </div>

        {/* 1-Click Copy Full Package CTA */}
        <button
          onClick={handleCopyFullPackage}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {copiedKey === "full-package" ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{copiedKey === "full-package" ? "Package Copied!" : "Copy Full Publishing Suite"}</span>
        </button>
      </div>

      {/* Episode Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {videos.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedVideoId(v.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeVideo?.id === v.id
                ? "bg-brand/15 text-brand border-brand/40 shadow-subtle"
                : "bg-[#121319] text-zinc-400 hover:text-white border-[#212431]"
            }`}
          >
            Day {v.episode_number.toString().padStart(2, "0")} • {v.title.slice(0, 24)}...
          </button>
        ))}
      </div>

      {activeVideo ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editing Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Caption Block */}
            <div className="p-6 rounded-2xl bg-[#111218] border border-[#212432] space-y-3 shadow-subtle">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-brand" />
                  Instagram Caption
                </label>
                <button
                  onClick={() => handleCopy(caption, "caption", "Caption")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191b26] hover:bg-[#222535] text-brand text-xs font-semibold border border-brand/20 transition-colors"
                >
                  {copiedKey === "caption" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "caption" ? "Copied" : "Copy Caption"}</span>
                </button>
              </div>

              <textarea
                rows={6}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your hook, core breakdown with Harshith and Claude, and explanation here..."
                className="w-full px-4 py-3 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-sm focus:outline-none focus:border-brand transition-colors font-sans leading-relaxed"
              />
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>Recommended: 125-250 characters before "More"</span>
                <span className="font-mono">{caption.length} characters</span>
              </div>
            </div>

            {/* Hashtags Block */}
            <div className="p-6 rounded-2xl bg-[#111218] border border-[#212432] space-y-3 shadow-subtle">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-brand" />
                  Hashtags
                </label>
                <button
                  onClick={() => handleCopy(hashtags, "hashtags", "Hashtags")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191b26] hover:bg-[#222535] text-brand text-xs font-semibold border border-brand/20 transition-colors"
                >
                  {copiedKey === "hashtags" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "hashtags" ? "Copied" : "Copy Hashtags"}</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#100DaysOfFreeAI #AI #OpenSource #DevTools..."
                className="w-full px-4 py-3 rounded-xl bg-[#161822] border border-[#272a3b] text-brand/90 font-mono text-xs focus:outline-none focus:border-brand transition-colors leading-relaxed"
              />
              <p className="text-[11px] text-zinc-500">
                3-5 broad tags, 3-5 niche developer tags, and #100DaysOfFreeAI
              </p>
            </div>

            {/* Pinned Comment & CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#111218] border border-[#212432] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5 text-amber-400" />
                    Pinned Comment
                  </label>
                  <button
                    onClick={() => handleCopy(pinnedComment, "pinned", "Pinned Comment")}
                    className="p-1 text-zinc-400 hover:text-brand transition-colors"
                    title="Copy Pinned Comment"
                  >
                    {copiedKey === "pinned" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={pinnedComment}
                  onChange={(e) => setPinnedComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-xs focus:outline-none focus:border-brand transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#111218] border border-[#212432] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-brand" />
                    Call to Action (CTA)
                  </label>
                  <button
                    onClick={() => handleCopy(cta, "cta", "CTA")}
                    className="p-1 text-zinc-400 hover:text-brand transition-colors"
                    title="Copy CTA"
                  >
                    {copiedKey === "cta" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-xs focus:outline-none focus:border-brand transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1a1c27] hover:bg-[#232636] text-white text-sm font-semibold border border-[#2e3146] transition-colors"
              >
                <Save className="w-4 h-4 text-brand" />
                <span>{saving ? "Saving..." : "Save Package Changes"}</span>
              </button>
            </div>
          </div>

          {/* Publishing Schedule & Preview Column (1 col) */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#111218] border border-[#212432] space-y-4 shadow-subtle">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand" />
                Publishing Schedule
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Target Posting Date</label>
                <input
                  type="date"
                  value={postingDate}
                  onChange={(e) => setPostingDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-xs focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Target Posting Time</label>
                <input
                  type="time"
                  value={postingTime}
                  onChange={(e) => setPostingTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-xs focus:outline-none focus:border-brand"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#161822] border border-[#252837] space-y-1">
                <p className="text-[11px] font-semibold text-brand">Peak Engagement Window</p>
                <p className="text-xs text-zinc-300">
                  Best performing reel posting time: <strong className="text-white">6:00 PM – 8:30 PM</strong> in your primary viewer timezone.
                </p>
              </div>
            </div>

            {/* Instagram Feed Preview Card */}
            <div className="p-5 rounded-2xl bg-[#111218] border border-[#212432] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                  H
                </div>
                <div>
                  <p className="text-xs font-bold text-white">harshith.dev</p>
                  <p className="text-[10px] text-zinc-400">100 Days of Free AI</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0b0c10] border border-[#1f222d] text-xs space-y-2">
                <p className="font-semibold text-white">
                  Day {activeVideo.episode_number}: {activeVideo.title}
                </p>
                <p className="text-zinc-300 line-clamp-4 leading-relaxed font-sans">
                  {caption}
                </p>
                <p className="text-brand/90 font-mono text-[11px] line-clamp-2">
                  {hashtags}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-zinc-400 rounded-2xl bg-[#111218] border border-[#212432]">
          Upload a video to manage captions and hashtags.
        </div>
      )}
    </div>
  );
}
