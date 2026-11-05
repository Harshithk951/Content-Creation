import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { Captions, WhisperWord } from "./Captions";

export interface ReelCompositionProps {
  videoFile: string;
  transcript: WhisperWord[];
}

export const ReelComposition: React.FC<ReelCompositionProps> = ({
  videoFile,
  transcript,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Background 9:16 Video */}
      <OffthreadVideo
        src={staticFile(videoFile)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Subtle bottom vignette to ensure caption readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Animated Word-by-Word Subtitle Overlay */}
      <Captions words={transcript} />
    </AbsoluteFill>
  );
};
