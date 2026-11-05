import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface WhisperWord {
  timestamps: {
    from: string;
    to: string;
  };
  offsets: {
    from: number; // ms
    to: number;   // ms
  };
  text: string;
}

interface CaptionsProps {
  words: WhisperWord[];
}

export const Captions: React.FC<CaptionsProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Current playback time in milliseconds
  const currentMs = (frame / fps) * 1000;

  // Filter out empty tokens and clean whitespace
  const validWords = words
    .map((w) => ({
      text: w.text.trim(),
      startMs: w.offsets.from,
      endMs: w.offsets.to,
    }))
    .filter((w) => w.text.length > 0);

  // Group into short display segments (e.g., 3-4 words per phrase window)
  const chunkSize = 3;
  const chunks: Array<typeof validWords> = [];
  for (let i = 0; i < validWords.length; i += chunkSize) {
    chunks.push(validWords.slice(i, i + chunkSize));
  }

  // Find the active chunk based on current time
  const activeChunk = chunks.find((chunk) => {
    const chunkStart = chunk[0].startMs;
    const chunkEnd = chunk[chunk.length - 1].endMs + 350; // brief hold after phrase ends
    return currentMs >= chunkStart && currentMs <= chunkEnd;
  });

  if (!activeChunk) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: "320px", // Safe zone for Instagram Reels UI
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "18px",
          background: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(8px)",
          padding: "24px 38px",
          borderRadius: "28px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        }}
      >
        {activeChunk.map((item, idx) => {
          const isActive = currentMs >= item.startMs && currentMs <= item.endMs;
          return (
            <span
              key={`${item.text}-${idx}`}
              style={{
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                fontSize: "64px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                color: isActive ? "#FFE600" : "#FFFFFF",
                transform: isActive ? "scale(1.15)" : "scale(1.0)",
                transition: "transform 0.08s ease, color 0.08s ease",
                textShadow: isActive
                  ? "0 4px 20px rgba(255, 230, 0, 0.8), 0 2px 8px rgba(0,0,0,0.9)"
                  : "0 4px 16px rgba(0,0,0,0.8)",
              }}
            >
              {item.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
