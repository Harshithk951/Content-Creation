"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { VideoRecord } from "@/types/video";
import { deleteVideo } from "@/lib/video-service";
import { useToast } from "./toast";

interface DeleteConfirmModalProps {
  video: VideoRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deletedId: string) => void;
}

export function DeleteConfirmModal({ video, isOpen, onClose, onSuccess }: DeleteConfirmModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !video) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteVideo(video.id, video.storage_path, video.thumbnail_path);
      toast.success("Video deleted", `Removed "${video.title}" from library and storage`);
      onSuccess(video.id);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Deletion failed";
      toast.error("Failed to delete video", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#090a0f] border border-red-500/20 rounded-3xl shadow-2xl p-6 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-base text-white tracking-tight">Delete Reel Master</h3>
            <p className="text-[11px] text-zinc-500 font-mono">This action is permanent and cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-normal">
          Are you sure you want to permanently delete{" "}
          <strong className="text-white font-medium">"{video.title}"</strong> (Day {video.episode_number})?
          This will purge both the database metadata and the original MP4 file from Supabase Storage.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 text-xs font-mono transition-colors border border-white/[0.06]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{loading ? "Deleting..." : "Delete Master MP4"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
