"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Film } from "lucide-react";
import { VideoRecord, VideoStatus } from "@/types/video";
import { updateVideo } from "@/lib/video-service";
import { useToast } from "./toast";

interface VideoEditModalProps {
  video: VideoRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: VideoRecord) => void;
}

export function VideoEditModal({ video, isOpen, onClose, onSuccess }: VideoEditModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [seriesName, setSeriesName] = useState("100 Days of Free AI");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [pinnedComment, setPinnedComment] = useState("");
  const [cta, setCta] = useState("");
  const [status, setStatus] = useState<VideoStatus>("Ready");

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setEpisodeNumber(video.episode_number);
      setSeriesName(video.series_name || "100 Days of Free AI");
      setDescription(video.description || "");
      setCaption(video.caption || "");
      setHashtags(video.hashtags || "");
      setPinnedComment(video.pinned_comment || "");
      setCta(video.cta || "");
      setStatus(video.status);
    }
  }, [video]);

  if (!isOpen || !video) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await updateVideo(video.id, {
        title,
        episode_number: Number(episodeNumber),
        series_name: seriesName,
        description,
        caption,
        hashtags,
        pinned_comment: pinnedComment,
        cta,
        status,
        published_at: status === "Published" && !video.published_at ? new Date().toISOString() : video.published_at,
      });

      toast.success("Video updated", `Saved changes for Day ${episodeNumber}`);
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed";
      toast.error("Failed to update video", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#111218] border border-[#232634] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f222e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-brand" />
            <h3 className="font-bold text-lg text-white">Edit Video Metadata</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Video Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Episode Number *</label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Series Name</label>
              <input
                type="text"
                value={seriesName}
                onChange={(e) => setSeriesName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VideoStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              >
                <option value="Draft">Draft</option>
                <option value="Ready">Ready</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Short Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-sm focus:outline-none focus:border-brand transition-colors resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Instagram Caption</label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-sm focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Hashtags</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-sm font-mono focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Pinned Comment</label>
              <input
                type="text"
                value={pinnedComment}
                onChange={(e) => setPinnedComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Call to Action (CTA)</label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1f222e] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#161822] hover:bg-[#1e202e] text-zinc-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-semibold transition-all shadow-glow disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
