import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { DialogueLine } from "./types";
import { PhonemeMouth, VisemeType } from "./PhonemeMouth";
import visemeTimeline from "./viseme_timeline.json";

interface CampfireSceneProps {
  lines?: DialogueLine[];
  audioSrc?: string;
  seriesTitle?: string;
}

export const CampfireScene: React.FC<CampfireSceneProps> = ({
  lines = [],
  audioSrc = "episode1_master.wav",
  seriesTitle = "HARSHITH & CLAUDE • EPISODE 1",
}) => {
  const frame = useCurrentFrame();

  // Find active dialogue line
  const activeLine =
    lines.find(
      (l) => frame >= l.startFrame && frame < l.startFrame + l.durationFrames
    ) || lines[lines.length - 1];

  const currentSpeaker = activeLine ? activeLine.speaker : null;
  const isBoyActive = currentSpeaker === "boy" || currentSpeaker === "leo";
  const isClaudeActive = currentSpeaker === "claude" || currentSpeaker === "kip";

  // Frame viseme data
  const frameVisemeData = (visemeTimeline as Array<{
    frame: number;
    speaker: string | null;
    viseme: string;
    jaw: number;
    blink: boolean;
    word: string;
  }>)[frame] || {
    viseme: "REST",
    jaw: 0,
    blink: false,
    word: "",
    speaker: null,
  };

  const boyViseme =
    isBoyActive && frameVisemeData.speaker === "boy"
      ? (frameVisemeData.viseme as VisemeType)
      : "REST";
  const claudeViseme =
    isClaudeActive && frameVisemeData.speaker === "claude"
      ? (frameVisemeData.viseme as VisemeType)
      : "REST";
  const jaw = frameVisemeData.jaw || 0;
  const isBlinking = frameVisemeData.blink;

  // Single continuous full-screen plates (Zero "half half" cut seams)
  let platePath = "canonical_plates/boy_typing_closed.png";

  if (activeLine) {
    if (activeLine.camera === "PUNCHLINE_SNAP") {
      platePath = "canonical_plates/claude_rock.png";
    } else if (isClaudeActive) {
      if (
        activeLine.text.includes("American, British") ||
        activeLine.text.includes("Now go comment")
      ) {
        platePath = "canonical_plates/claude_rock.png";
      } else {
        platePath = "canonical_plates/claude_fire_closed.png";
      }
    } else if (isBoyActive) {
      if (
        activeLine.text.includes("explain it to me") ||
        activeLine.text.includes("what does our voice setup cost")
      ) {
        platePath = "canonical_plates/boy_arms_crossed.png";
      } else {
        platePath = "canonical_plates/boy_typing_closed.png";
      }
    }
  }

  // Calm floating ambient embers (rising smoothly from campfire)
  const embers = Array.from({ length: 12 }).map((_, i) => {
    const seed = i * 53;
    const emberY = (frame * 1.5 + seed * 30) % 1920;
    const emberX = 540 + Math.sin(frame * 0.03 + seed) * (150 + (seed % 100));
    const emberOpacity = 0.25 + 0.45 * Math.sin(frame * 0.06 + seed);
    return {
      x: emberX,
      y: 1920 - emberY,
      opacity: emberOpacity,
      size: 4 + (seed % 5),
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#06090F", overflow: "hidden" }}>
      {/* Synchronized Master Audio Track (Locally saved ElevenLabs master — 0 credits burned) */}
      {audioSrc && <Audio src={staticFile(audioSrc)} />}

      {/* 100% LOCKED-OFF, CALM CAMERA (Single Continuous Plate — Zero Split Seam) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "none",
        }}
      >
        <Img
          src={staticFile(platePath)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Phoneme-Synchronized Lip-Sync: Harshith (Boy) */}
        {boyViseme !== "REST" && platePath.includes("boy_typing") && (
          <div
            style={{
              position: "absolute",
              top: 840,
              left: 540,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <PhonemeMouth
              character="boy"
              viseme={boyViseme}
              jaw={jaw}
              scale={1.15}
            />
          </div>
        )}

        {/* Natural Eyelid Blink for Harshith */}
        {isBlinking && platePath.includes("boy_typing") && (
          <div
            style={{
              position: "absolute",
              top: 712,
              left: 542,
              transform: "translate(-50%, -50%)",
              width: 74,
              height: 10,
              backgroundColor: "#B36F55",
              borderRadius: 6,
              zIndex: 11,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Phoneme-Synchronized Lip-Sync: Claude */}
        {claudeViseme !== "REST" && platePath.includes("claude_fire") && (
          <div
            style={{
              position: "absolute",
              top: 1560,
              left: 185,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <PhonemeMouth
              character="claude"
              viseme={claudeViseme}
              jaw={jaw}
              scale={1.2}
            />
          </div>
        )}

        {/* Soft edge vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 50%, transparent 70%, rgba(4, 7, 12, 0.35) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Ambient Floating Campfire Embers */}
      {embers.map((em, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: em.x,
            top: em.y,
            width: em.size,
            height: em.size,
            borderRadius: "50%",
            backgroundColor: "#F77F00",
            opacity: em.opacity,
            boxShadow: `0 0 ${em.size * 2}px #FCBF49`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Clean Premium Series Header */}
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          zIndex: 50,
        }}
      >
        <div
          style={{
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.92)",
            textShadow:
              "0 2px 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)",
            padding: "8px 24px",
            borderRadius: 30,
            backgroundColor: "rgba(10, 14, 22, 0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          {seriesTitle}
        </div>
      </div>

      {/* Clean Modern Glassmorphic Subtitles (Top-Third Placement) */}
      {activeLine && (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 50,
            right: 50,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 60,
          }}
        >
          <div
            style={{
              display: "inline-block",
              maxWidth: 960,
              padding: "16px 32px",
              borderRadius: 22,
              backgroundColor: "rgba(8, 12, 20, 0.72)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
            }}
          >
            <div
              style={{
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontWeight: 800,
                fontSize: 38,
                lineHeight: 1.25,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.7)",
              }}
            >
              {activeLine.text}
            </div>
          </div>
        </div>
      )}

      {/* ELI5 Glassmorphic Step Card for Kokoro (Lines 4 to 7 / Frames 346 to 810) */}
      {frame >= 346 && frame < 810 && (
        <div
          style={{
            position: "absolute",
            top: 360,
            left: 56,
            right: 56,
            backgroundColor: "rgba(12, 18, 30, 0.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: 26,
            padding: "30px 34px",
            border: "1.5px solid rgba(247, 127, 0, 0.4)",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.65), 0 0 30px rgba(247, 127, 0, 0.15)",
            zIndex: 80,
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Card Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  backgroundColor: "#F77F00",
                  color: "#000000",
                  fontWeight: 900,
                  fontSize: 16,
                  padding: "4px 12px",
                  borderRadius: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Zero Cost
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-0.01em",
                }}
              >
                Kokoro Voice Model
              </div>
            </div>
            <div
              style={{
                fontSize: 16,
                color: "#F77F00",
                fontWeight: 700,
                backgroundColor: "rgba(247, 127, 0, 0.15)",
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid rgba(247, 127, 0, 0.35)",
              }}
            >
              100% Free
            </div>
          </div>

          {/* Card Body — 4 Simple ELI5 Bullet Steps */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  backgroundColor: "#F77F00",
                  color: "#000000",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 18,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                1
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>
                  Open-Source Weights
                </div>
                <div
                  style={{
                    fontSize: 19,
                    color: "rgba(255, 255, 255, 0.72)",
                    fontWeight: 500,
                  }}
                >
                  Commercial-grade voice synthesis with zero monthly bill
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  backgroundColor: "#F77F00",
                  color: "#000000",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 18,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                2
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>
                  10-Second Download
                </div>
                <div
                  style={{
                    fontSize: 19,
                    color: "rgba(255, 255, 255, 0.72)",
                    fontWeight: 500,
                  }}
                >
                  Small file, zero complex terminal setup
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  backgroundColor: "#F77F00",
                  color: "#000000",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 18,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                3
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>
                  100% Offline & Private
                </div>
                <div
                  style={{
                    fontSize: 19,
                    color: "rgba(255, 255, 255, 0.72)",
                    fontWeight: 500,
                  }}
                >
                  Runs locally on your laptop CPU (0 GPU needed)
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  backgroundColor: "#F77F00",
                  color: "#000000",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 18,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                4
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>
                  $0 / Month Forever
                </div>
                <div
                  style={{
                    fontSize: 19,
                    color: "rgba(255, 255, 255, 0.72)",
                    fontWeight: 500,
                  }}
                >
                  Cancel expensive cloud voice subscriptions
                </div>
              </div>
            </div>
          </div>

          {/* Footer attribution */}
          <div
            style={{
              marginTop: 22,
              paddingTop: 16,
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              color: "rgba(255, 255, 255, 0.65)",
              fontWeight: 600,
            }}
          >
            <span>⚡ Zero Dollar Dev Series</span>
            <span style={{ color: "#F77F00" }}>Curated by Harshith</span>
          </div>
        </div>
      )}

      {/* Floating CTA Badge for "Comment FREE" Branded for Harshith (Frames 878 to 1160) */}
      {frame >= 878 && (
        <div
          style={{
            position: "absolute",
            bottom: 230,
            left: 50,
            right: 50,
            backgroundColor: "rgba(247, 127, 0, 0.95)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderRadius: 50,
            padding: "18px 24px",
            boxShadow:
              "0 14px 40px rgba(247, 127, 0, 0.5), 0 4px 15px rgba(0, 0, 0, 0.5)",
            border: "2px solid rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            zIndex: 90,
            transform: `scale(${1 + 0.03 * Math.sin((frame - 878) * 0.12)})`,
          }}
        >
          <span style={{ fontSize: 26 }}>👉</span>
          <span
            style={{
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: 800,
              fontSize: 26,
              color: "#FFFFFF",
              letterSpacing: "0.01em",
            }}
          >
            Comment{" "}
            <span
              style={{
                backgroundColor: "#FFFFFF",
                color: "#F77F00",
                padding: "2px 10px",
                borderRadius: 8,
                fontWeight: 900,
              }}
            >
              FREE
            </span>{" "}
            — Harshith sends the Guide
          </span>
          <span style={{ fontSize: 26 }}>👈</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
