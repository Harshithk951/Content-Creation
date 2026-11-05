"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Film,
  FileVideo,
  X,
  CheckCircle2,
  Clock,
  HardDrive,
  Monitor,
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
    "GitHub repository and local setup instructions in bio. Comment 'SETUP' for the direct link."
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
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    const isExtensionValid = ext === "mp4" || ext === "mov" || ext === "webm";

    if (!validTypes.includes(selectedFile.type) && !isExtensionValid) {
      toast.error("Invalid file format", "Please upload an MP4, MOV, or WebM video.");
      return;
    }

    const maxSize = 500 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error("File too large", "Maximum allowed video size is 500 MB.");
      return;
    }

    setFile(selectedFile);

    if (!title) {
      const cleanName = selectedFile.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]+/g, " ")
        .trim();
      setTitle(cleanName);
    }

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
      toast.error("No video file selected", "Please choose a vertical 9:16 Reel video to upload.");
      return;
    }

    if (!title.trim()) {
      toast.error("Video title required", "Please enter a descriptive title for this episode.");
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

      setUploadProgress(100);

      toast.success(
        "Reel Ingested Successfully",
        `Day ${episodeNumber} "${title}" is ready in your library.`
      );

      setTimeout(() => {
        router.push("/library");
      }, 600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error("Upload error", msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Top Header */}
      <div className="border-b border-white/[0.06] pb-5">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-brand uppercase font-medium">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Master Reel Ingestion</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-white mt-1">
          Upload Reel Master
        </h2>
        <p className="text-xs text-zinc-400 mt-1 font-normal">
          Upload completed 9:16 vertical video renders to permanent cloud storage.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. File Upload Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer select-none ${
            dragActive
              ? "border-brand bg-brand/5"
              : file
              ? "border-emerald-500/40 bg-emerald-500/5 cursor-default"
              : "border-white/[0.1] bg-[#090a0f] hover:border-white/[0.2]"
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileVideo className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-white truncate max-w-sm sm:max-w-md">
                      {file.name}
                    </p>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Validated
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 font-mono tabular-nums">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
                      {formatBytes(file.size)}
                    </span>
                    {detectedDuration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        {formatDuration(detectedDuration)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5 text-zinc-400" />
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
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Replace Video</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Drag and drop your Reel video here, or{" "}
                  <span className="text-brand underline underline-offset-2">browse files</span>
                </p>
                <p className="text-xs text-zinc-500 mt-1 font-mono">
                  Supports MP4, MOV, WebM • 1080×1920 (9:16 vertical) • Max 500 MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Progress Bar (when active) */}
        {isUploading && (
          <div className="p-4 rounded-xl bg-[#090a0f] border border-brand/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-brand font-medium">Ingesting and validating master reel...</span>
              <span className="tabular-nums text-white font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 2. Episode & Series Metadata */}
        <div className="p-6 rounded-2xl bg-[#090a0f] border border-white/[0.06] space-y-5">
          <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-400 font-medium">
            Episode Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3 space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Video Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kokoro 82M — Free AI Voice Stack"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-brand transition-colors font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Episode Number *</label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs font-mono tabular-nums focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Series Name</label>
              <input
                type="text"
                value={seriesName}
                onChange={(e) => setSeriesName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-brand transition-colors font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VideoStatus)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-brand transition-colors"
              >
                <option value="Ready">Ready</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Video Description</label>
            <textarea
              rows={2}
              placeholder="Summary of tools, libraries, and key takeaways for this episode..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-brand transition-colors resize-none font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* 3. Instagram Publishing Kit */}
        <div className="p-6 rounded-2xl bg-[#090a0f] border border-white/[0.06] space-y-5">
          <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-400 font-medium">
            Instagram Publishing Package
          </h3>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Instagram Caption</label>
            <textarea
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-brand transition-colors font-sans leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Hashtags</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-zinc-300 text-xs font-mono focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Pinned Comment</label>
              <input
                type="text"
                value={pinnedComment}
                onChange={(e) => setPinnedComment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-brand transition-colors font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Call to Action (CTA)</label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-brand transition-colors font-sans"
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
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-xs font-medium text-white">Custom Thumbnail (Optional)</p>
                  <p className="text-[10px] font-mono text-zinc-500">
                    {thumbnailFile ? thumbnailFile.name : "Uses automatic poster frame if omitted"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => thumbInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-white transition-colors border border-white/[0.08]"
              >
                {thumbnailFile ? "Change" : "Browse Image"}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/library")}
            className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-medium transition-colors border border-white/[0.06]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isUploading || !file}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isUploading ? "Uploading..." : "Save to ReelVault Library"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
