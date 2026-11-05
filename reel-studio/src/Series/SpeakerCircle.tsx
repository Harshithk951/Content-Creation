import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";

interface SpeakerCircleProps {
  speaker: "boy" | "claude";
  size?: number;
}

export const SpeakerCircle: React.FC<SpeakerCircleProps> = ({
  speaker,
  size = 230,
}) => {
  const frame = useCurrentFrame();
  const isClaude = speaker === "claude";
  const themeColor = isClaude ? "#F97316" : "#2563EB";
  
  // Display only the clean first names as strictly mandated
  const speakerName = isClaude ? "Claude" : "Harshith";

  // Official character images
  const avatarPath = isClaude
    ? "avatars/claude_official.jpg"
    : "avatars/harshith_official.jpg";

  // Subtle breathing / speech pulse (1-2% scale modulation)
  const pulse = 1 + 0.02 * Math.sin(frame * 0.18);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 100,
        transform: `scale(${pulse})`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {/* Circular Character Frame */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#161D2B",
          border: `4px solid ${themeColor}`,
          boxShadow: `0 14px 36px rgba(0, 0, 0, 0.35), 0 0 20px ${
            isClaude ? "rgba(249, 115, 22, 0.35)" : "rgba(37, 99, 235, 0.35)"
          }`,
        }}
      >
        {/* Exact Character Image */}
        <Img
          src={staticFile(avatarPath)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: isClaude ? "center center" : "center 18%",
          }}
        />

        {/* Subtle glass rim highlight */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            boxShadow:
              "inset 0 2px 6px rgba(255, 255, 255, 0.45), inset 0 -3px 8px rgba(0, 0, 0, 0.3)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Clean Character Name Tag — STRICTLY 'Harshith' or 'Claude' ONLY */}
      <div
        style={{
          marginTop: 8,
          backgroundColor: "rgba(31, 36, 45, 0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "5px 16px",
          borderRadius: 20,
          border: `1.5px solid ${themeColor}`,
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: themeColor,
            boxShadow: `0 0 6px ${themeColor}`,
          }}
        />
        <span
          style={{
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Montserrat", "Inter", sans-serif',
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "0.04em",
            color: "#FFFFFF",
          }}
        >
          {speakerName}
        </span>
      </div>
    </div>
  );
};
