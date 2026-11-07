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
  Save,
  Send,
  Sparkles,
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-orange-700 uppercase font-bold">
            <Hash className="w-3.5 h-3.5" />
            <span>Publishing Copy Station</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 mt-1">
            Instagram Copy & Pinned Comments
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
            Ready-to-post captions, algorithmic hashtags, and DM triggers for each reel.
          </p>
        </div>

        {/* Global Copy Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyFullPackage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-colors shadow-sm"
          >
            {copiedKey === "full-package" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === "full-package" ? "Package Copied!" : "Copy Full Package"}</span>
          </button>
        </div>
      </div>

      {/* Episode Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {videos.map((vid) => (
          <button
            key={vid.id}
            onClick={() => setSelectedVideoId(vid.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono tabular-nums whitespace-nowrap transition-colors border ${
              activeVideo?.id === vid.id
                ? "bg-white text-stone-900 font-bold border-stone-300 shadow-sm"
                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            Day {vid.episode_number.toString().padStart(2, "0")} • {vid.title.slice(0, 24)}...
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-96 rounded-2xl bg-white border border-stone-200 animate-pulse" />
      ) : !activeVideo ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-stone-200 text-stone-500 font-mono text-xs">
          No video records found. Ingest your first reel to generate publishing packages.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editing Column (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* 1. Instagram Caption */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono tracking-[0.18em] uppercase text-stone-700 font-bold">
                    Primary Instagram Caption
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Hook, value delivery, and DM comment trigger</p>
                </div>

                <button
                  onClick={() => handleCopy(caption, "caption", "Caption")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-stone-200 text-stone-800 text-xs font-mono font-semibold transition-colors border border-stone-200"
                >
                  {copiedKey === "caption" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                  <span>{copiedKey === "caption" ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <textarea
                rows={7}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-orange-500 transition-colors resize-none leading-relaxed font-sans"
                placeholder="Write your reel caption..."
              />
              <div className="flex items-center justify-between text-[10px] font-mono tabular-nums text-stone-500">
                <span>{caption.length} characters</span>
                <span>Optimal: 150 – 350 chars</span>
              </div>
            </div>

            {/* 2. Hashtags Set */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono tracking-[0.18em] uppercase text-stone-700 font-bold">
                    Hashtags Set
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Categorization tags for algorithmic discovery</p>
                </div>

                <button
                  onClick={() => handleCopy(hashtags, "hashtags", "Hashtags")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-stone-200 text-stone-800 text-xs font-mono font-semibold transition-colors border border-stone-200"
                >
                  {copiedKey === "hashtags" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                  <span>{copiedKey === "hashtags" ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-800 text-xs focus:outline-none focus:border-orange-500 transition-colors resize-none font-mono leading-relaxed"
                placeholder="#100DaysOfFreeAI #AI #OpenSource..."
              />
            </div>

            {/* 3. Pinned Comment & CTA Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono tracking-[0.18em] uppercase text-stone-700 font-bold flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5 text-orange-600" />
                    Pinned Comment
                  </label>
                  <button
                    onClick={() => handleCopy(pinnedComment, "pinned", "Pinned Comment")}
                    className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
                    title="Copy Pinned Comment"
                  >
                    {copiedKey === "pinned" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={pinnedComment}
                  onChange={(e) => setPinnedComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-orange-500 transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono tracking-[0.18em] uppercase text-stone-700 font-bold flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-orange-600" />
                    Call to Action (CTA)
                  </label>
                  <button
                    onClick={() => handleCopy(cta, "cta", "CTA")}
                    className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
                    title="Copy CTA"
                  >
                    {copiedKey === "cta" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-orange-500 transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-colors disabled:opacity-50 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Copy Changes"}</span>
              </button>
            </div>
          </div>

          {/* Feed Preview Column (1 col) */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-xs">
              <h3 className="text-xs font-mono tracking-[0.18em] uppercase text-stone-700 font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                Posting Time Slot
              </h3>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500">Posting Date</label>
                <input
                  type="date"
                  value={postingDate}
                  onChange={(e) => setPostingDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-900 text-xs font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500">Posting Time</label>
                <input
                  type="time"
                  value={postingTime}
                  onChange={(e) => setPostingTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-900 text-xs font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200/80 space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-wider text-orange-800 font-bold">Prime Release Slot</p>
                <p className="text-xs text-orange-900 font-normal leading-relaxed">
                  Instagram release window: <strong>6:00 PM – 8:30 PM</strong> in your viewer timezone.
                </p>
              </div>
            </div>

            {/* Instagram Feed Mock Card */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-500/40">
                  <img src="/avatars/harshith_official.jpg" alt="Harshith" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">@harshith.claude</p>
                  <p className="text-[10px] font-mono text-stone-500">100 Days of Free AI</p>
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-sans line-clamp-5 whitespace-pre-line">
                {caption}
              </p>

              <p className="text-[11px] text-stone-500 font-mono line-clamp-2">
                {hashtags}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
