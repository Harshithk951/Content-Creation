"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Film,
  FileVideo,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  Monitor,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { formatBytes, formatDuration } from "@/lib/utils";
import { uploadVideoFile } from "@/lib/video-service";
import { useToast } from "@/components/toast";
import { VideoStatus } from "@/types/video";

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  // Extracted metadata
  const [detectedDuration, setDetectedDuration] = useState<number | null>(null);
  const [detectedResolution, setDetectedResolution] = useState<string>("1080 × 1920");

  // Form Fields
  const [title, setTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState<number>(2);
  const [seriesName, setSeriesName] = useState("100 Days of Free AI");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState(
    "Stop paying $40/mo for tools you can run completely free! Here is how Harshith and Claude set it up in 2 minutes. Comment below for the GitHub repo & setup code!"
  );
  const [hashtags, setHashtags] = useState(
    "#100DaysOfFreeAI #AI #OpenSource #DevTools #CodingLife #WebDev #FreeAI #TechReels #Python"
  );
  const [pinnedComment, setPinnedComment] = useState(
    "🔗 GitHub repo & local setup script in bio! Comment 'SETUP' for the link."
  );
  const [cta, setCta] = useState(
    "Comment below and I will DM you the free code + tutorial!"
  );
  const [status, setStatus] = useState<VideoStatus>("Ready");

  // Uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Handle Video Selection
  const handleFileChange = (selectedFile: File) => {
    // Validate file type
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    const isExtensionValid = ext === "mp4" || ext === "mov" || ext === "webm";

    if (!validTypes.includes(selectedFile.type) && !isExtensionValid) {
      toast.error("Invalid file format", "Please upload an MP4, MOV, or WebM video.");
      return;
    }

    // Validate size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error("File too large", "Maximum allowed video size is 500 MB.");
      return;
    }

    setFile(selectedFile);

    // Auto-fill Title from filename if empty
    if (!title) {
      const cleanName = selectedFile.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]+/g, " ")
        .trim();
      setTitle(cleanName);
    }

    // Extract metadata using a temporary blob video element
    const objectUrl = URL.createObjectURL(selectedFile);
    setVideoPreviewUrl(objectUrl);

    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = objectUrl;
    tempVideo.onloadedmetadata = () => {
      setDetectedDuration(tempVideo.duration);
      if (tempVideo.videoWidth && tempVideo.videoHeight) {
        setDetectedResolution(`${tempVideo.videoWidth} × ${tempVideo.videoHeight}`);
      }
    };
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const tFile = e.target.files[0];
      setThumbnailFile(tFile);
      setThumbnailPreviewUrl(URL.createObjectURL(tFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Video file required", "Please select or drop an MP4 video file.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      await uploadVideoFile(
        file,
        {
          title,
          episode_number: Number(episodeNumber),
          series_name: seriesName,
          description,
          caption,
          hashtags,
          pinned_comment: pinnedComment,
          cta,
          status,
          duration_seconds: detectedDuration || 38.67,
          resolution: detectedResolution,
        },
        thumbnailFile,
        (percent) => {
          setUploadProgress(percent);
        }
      );

      toast.success("Upload Successful", `Episode ${episodeNumber} is now permanently stored!`);
      setTimeout(() => {
        router.push("/library");
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error("Upload Failed", msg);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-brand" />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Upload Video Reel
          </h2>
        </div>
        <p className="text-sm text-zinc-400 mt-0.5">
          Permanently store 9:16 vertical reels in Supabase Storage with full Instagram metadata.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Drag & Drop Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
            dragActive
              ? "border-brand bg-brand/10 scale-[1.01]"
              : file
              ? "border-emerald-500/40 bg-[#12141a]"
              : "border-[#2b2e3d] hover:border-brand/50 bg-[#101117] hover:bg-[#13151e]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="hidden"
          />

          {file ? (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileVideo className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base truncate max-w-sm">
                      {file.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Ready
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <HardDrive className="w-3.5 h-3.5 text-brand" />
                      {formatBytes(file.size)}
                    </span>
                    {detectedDuration && (
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-brand" />
                        {formatDuration(detectedDuration)}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono">
                      <Monitor className="w-3.5 h-3.5 text-brand" />
                      {detectedResolution}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setVideoPreviewUrl(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Replace Video</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              <div className="w-16 h-16 rounded-2xl bg-[#181923] border border-[#2b2e3e] flex items-center justify-center text-brand mx-auto shadow-glow">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-bold text-white">
                  Drag and drop your Reel video here, or{" "}
                  <span className="text-brand underline underline-offset-2">browse files</span>
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Supports MP4, MOV, WebM • 1080×1920 (9:16 vertical) • Max 500 MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Progress Bar (when active) */}
        {isUploading && (
          <div className="p-4 rounded-xl bg-[#14161f] border border-brand/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-brand font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                Ingesting and optimizing master reel...
              </span>
              <span className="font-mono font-bold text-white">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-[#222533] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-[#ff7a45] rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 2. Episode & Series Metadata */}
        <div className="p-6 rounded-2xl bg-[#111218] border border-[#212431] space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand" />
            Episode Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Video Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kokoro 82M — Free AI Voice Stack"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#161822] border border-[#282b3c] text-white text-sm focus:outline-none focus:border-brand transition-colors"
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#161822] border border-[#282b3c] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-300">Series Name</label>
              <input
                type="text"
                value={seriesName}
                onChange={(e) => setSeriesName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#161822] border border-[#282b3c] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VideoStatus)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#161822] border border-[#282b3c] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              >
                <option value="Ready">Ready</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Video Description</label>
            <textarea
              rows={2}
              placeholder="Summary of tools, libraries, and key takeaways for this episode..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#161822] border border-[#282b3c] text-white text-sm focus:outline-none focus:border-brand transition-colors resize-none"
            />
          </div>
        </div>

        {/* 3. Instagram Publishing Kit */}
        <div className="p-6 rounded-2xl bg-[#111218] border border-[#212431] space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Instagram Publishing Package
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Instagram Caption</label>
            <textarea
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#161822] border border-[#282b3c] text-white text-sm focus:outline-none focus:border-brand transition-colors font-sans leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Hashtags</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#161822] border border-[#282b3c] text-white text-sm font-mono focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Pinned Comment</label>
              <input
                type="text"
                value={pinnedComment}
                onChange={(e) => setPinnedComment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#161822] border border-[#282b3c] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Call to Action (CTA)</label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#161822] border border-[#282b3c] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>

          {/* Optional Thumbnail Upload */}
          <div className="pt-2">
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleThumbnailChange}
              className="hidden"
            />
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#161822] border border-[#272a3b]">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-brand" />
                <div>
                  <p className="text-xs font-semibold text-white">Custom Thumbnail (Optional)</p>
                  <p className="text-[11px] text-zinc-400">
                    {thumbnailFile ? thumbnailFile.name : "Will use automatic poster frame if omitted"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => thumbInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-[#222533] hover:bg-[#2b2e40] text-xs font-medium text-white transition-colors"
              >
                {thumbnailFile ? "Change" : "Browse Image"}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.push("/library")}
            className="px-5 py-3 rounded-xl bg-[#14161f] hover:bg-[#1c1e2b] text-zinc-300 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isUploading || !file}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-bold transition-all shadow-glow hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isUploading ? "Uploading..." : "Save to ReelVault Library"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
