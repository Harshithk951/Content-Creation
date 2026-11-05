import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { LocationType } from "./types";

interface Background3DProps {
  location: LocationType;
  cameraScale: number;
}

export const Background3D: React.FC<Background3DProps> = ({
  location,
  cameraScale,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating ambient dust particles
  const particles = Array.from({ length: 18 }).map((_, i) => {
    const baseX = (i * 107) % 1080;
    const baseY = (i * 143) % 1920;
    const speed = 0.4 + (i % 5) * 0.2;
    const floatY = (baseY - (frame * speed)) % 1920;
    const swayX = Math.sin((frame / fps) + i) * 15;
    const opacity = 0.15 + (Math.sin((frame / 20) + i) + 1) * 0.15;
    const size = 3 + (i % 4) * 2;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: baseX + swayX,
          top: floatY < 0 ? floatY + 1920 : floatY,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "#A0AEC0",
          opacity,
          filter: "blur(1px)",
          pointerEvents: "none",
        }}
      />
    );
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "#0A0D14",
      }}
    >
      {/* --- LOCATION-SPECIFIC ATMOSPHERE --- */}
      {location === "MidnightLoft" && (
        <AbsoluteFill>
          {/* Deep Navy/Slate Wall Base */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 50% 30%, #1A202C 0%, #0F172A 70%, #07090E 100%)",
            }}
          />

          {/* Warm Amber Desk Lamp Rim Glow on Top Left */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              left: "-80px",
              width: "550px",
              height: "550px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(217, 119, 6, 0.28) 0%, rgba(217, 119, 6, 0) 70%)",
              filter: "blur(50px)",
            }}
          />

          {/* Cool Cyan Terminal Screen Reflection on Bottom Right */}
          <div
            style={{
              position: "absolute",
              bottom: "100px",
              right: "-100px",
              width: "700px",
              height: "700px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(56, 178, 172, 0.2) 0%, rgba(56, 178, 172, 0) 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Subtle Parallax Background Desk & Shelf Silhouette */}
          <svg
            viewBox="0 0 1080 1920"
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              opacity: 0.35,
              transform: `scale(${1 + (cameraScale - 1) * 0.4})`,
            }}
          >
            {/* Shelf */}
            <rect x="180" y="320" width="720" height="14" rx="4" fill="#2D3748" />
            <rect x="240" y="260" width="35" height="60" rx="3" fill="#4A5568" />
            <rect x="280" y="250" width="45" height="70" rx="3" fill="#319795" />
            <rect x="330" y="270" width="30" height="50" rx="3" fill="#4A5568" />

            {/* Succulent Plant Pot */}
            <rect x="760" y="285" width="40" height="35" rx="4" fill="#718096" />
            <circle cx="780" cy="275" r="18" fill="#2E8540" opacity="0.8" />

            {/* Ultra-wide Monitor Frame Silhouette */}
            <rect x="140" y="550" width="800" height="420" rx="24" fill="#131B2E" stroke="#23324E" strokeWidth="6" />
            {/* Mock Code Lines */}
            <line x1="180" y1="620" x2="380" y2="620" stroke="#319795" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
            <line x1="180" y1="655" x2="520" y2="655" stroke="#4FD1C5" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
            <line x1="220" y1="690" x2="440" y2="690" stroke="#CBD5E0" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
            <line x1="220" y1="725" x2="620" y2="725" stroke="#CBD5E0" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
          </svg>
        </AbsoluteFill>
      )}

      {location === "ServerLounge" && (
        <AbsoluteFill>
          {/* Cobalt Base */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, #091324 0%, #030712 100%)",
            }}
          />

          {/* Glowing Vertical Ice-Cyan Server Rack Strips */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "15%",
              width: "12px",
              height: "75%",
              backgroundColor: "#38B2AC",
              boxShadow: "0 0 35px #38B2AC",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: "15%",
              width: "12px",
              height: "75%",
              backgroundColor: "#4FD1C5",
              boxShadow: "0 0 35px #4FD1C5",
              opacity: 0.6,
            }}
          />
        </AbsoluteFill>
      )}

      {location === "HostelRoom" && (
        <AbsoluteFill>
          {/* Moody Purple Twilight Base */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 60% 40%, #1E1B4B 0%, #0F0E26 70%, #050510 100%)",
            }}
          />

          {/* Warm Battery Fairy Lights Arc */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 140 + Math.sin(i * 0.5) * 35,
                left: 120 + i * 115,
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: "#FBBF24",
                boxShadow: "0 0 20px #F59E0B",
                opacity: 0.75 + Math.sin((frame / 15) + i) * 0.25,
              }}
            />
          ))}
        </AbsoluteFill>
      )}

      {/* Floating Particles */}
      {particles}

      {/* Cinematic Depth-of-Field Soft Vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
