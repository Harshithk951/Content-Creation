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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121319] border border-red-500/25 rounded-2xl shadow-2xl p-6 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Delete Video</h3>
            <p className="text-xs text-zinc-400">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          Are you sure you want to permanently delete{" "}
          <strong className="text-white font-semibold">"{video.title}"</strong> (Day {video.episode_number})?
          This will remove both the database record and the original MP4 file from Supabase Storage.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#1a1c26] hover:bg-[#222533] text-zinc-300 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all shadow-subtle disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? "Deleting..." : "Delete Permanently"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
