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

interface StudioSceneProps {
  lines?: DialogueLine[];
  audioSrc?: string;
  seriesTitle?: string;
}

export const StudioScene: React.FC<StudioSceneProps> = ({
  lines = [],
  audioSrc = "episode1_master.wav",
  seriesTitle = "HARSHITH & CLAUDE • EPISODE 1",
}) => {
  const frame = useCurrentFrame();

  const activeLine =
    lines.find(
      (l) => frame >= l.startFrame && frame < l.startFrame + l.durationFrames
    ) || lines[lines.length - 1];

  const currentSpeaker = activeLine ? activeLine.speaker : null;
  const isBoyActive = currentSpeaker === "boy" || currentSpeaker === "leo";
  const isClaudeActive = currentSpeaker === "claude" || currentSpeaker === "kip";

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

  // Scene flow using the 7 newly generated 3D plates
  let platePath = "studio_plates/01_boy_typing.jpg";
  let showBoyMouth = false;
  let showClaudeMouth = false;
  let boyMouthPos = { top: 810, left: 540, scale: 1.15 };
  let claudeMouthPos = { top: 1240, left: 540, scale: 1.25 };

  if (activeLine) {
    if (activeLine.camera === "PUNCHLINE_SNAP") {
      platePath = "studio_plates/05_claude_smug.jpg";
      claudeMouthPos = { top: 1200, left: 540, scale: 1.25 };
      showClaudeMouth = true;
    } else if (isClaudeActive) {
      if (activeLine.stepCard) {
        platePath = "studio_plates/06_claude_card_focus.jpg";
        claudeMouthPos = { top: 1560, left: 450, scale: 1.15 };
        showClaudeMouth = true;
      } else if (activeLine.text.includes("American, British")) {
        platePath = "studio_plates/05_claude_smug.jpg";
        claudeMouthPos = { top: 1200, left: 540, scale: 1.25 };
        showClaudeMouth = true;
      } else {
        platePath = "studio_plates/04_claude_closeup.jpg";
        claudeMouthPos = { top: 1240, left: 540, scale: 1.25 };
        showClaudeMouth = true;
      }
    } else if (isBoyActive) {
      if (activeLine.text.includes("explain it to me") || activeLine.text.includes("Wait, you know")) {
        platePath = "studio_plates/03_boy_listening.jpg";
        boyMouthPos = { top: 800, left: 540, scale: 1.15 };
        showBoyMouth = true;
      } else if (activeLine.text.includes("what does our voice setup cost")) {
        platePath = "studio_plates/01_boy_typing.jpg";
        boyMouthPos = { top: 810, left: 540, scale: 1.15 };
        showBoyMouth = true;
      } else {
        platePath = "studio_plates/02_boy_talking.jpg";
        boyMouthPos = { top: 810, left: 540, scale: 1.15 };
        showBoyMouth = true;
      }
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#06090F", overflow: "hidden" }}>
      {audioSrc && <Audio src={staticFile(audioSrc)} />}

      {/* Plate Background (Single unified 1080x1920 plate — zero cut lines) */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Img
          src={staticFile(platePath)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Phoneme Lip-Sync: Harshith */}
        {showBoyMouth && boyViseme !== "REST" && (
          <div
            style={{
              position: "absolute",
              top: boyMouthPos.top,
              left: boyMouthPos.left,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <PhonemeMouth
              character="boy"
              viseme={boyViseme}
              jaw={jaw}
              scale={boyMouthPos.scale}
            />
          </div>
        )}

        {/* Natural Eyelid Blink for Harshith */}
        {isBlinking && platePath.includes("boy") && (
          <div
            style={{
              position: "absolute",
              top: boyMouthPos.top - 98,
              left: boyMouthPos.left,
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

        {/* Phoneme Lip-Sync: Claude */}
        {showClaudeMouth && claudeViseme !== "REST" && (
          <div
            style={{
              position: "absolute",
              top: claudeMouthPos.top,
              left: claudeMouthPos.left,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <PhonemeMouth
              character="claude"
              viseme={claudeViseme}
              jaw={jaw}
              scale={claudeMouthPos.scale}
            />
          </div>
        )}

        {/* Warm Studio Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 50%, transparent 68%, rgba(5, 8, 14, 0.45) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Series Title Header */}
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
            color: "rgba(255, 255, 255, 0.95)",
            padding: "8px 24px",
            borderRadius: 30,
            backgroundColor: "rgba(12, 16, 26, 0.65)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
          }}
        >
          {seriesTitle}
        </div>
      </div>

      {/* Clean Subtitles (Top-Third) */}
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
              backgroundColor: "rgba(10, 15, 24, 0.78)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
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

      {/* ELI5 Glassmorphic Step Card for Kokoro */}
      {frame >= 346 && frame < 810 && (
        <div
          style={{
            position: "absolute",
            top: 360,
            left: 56,
            right: 56,
            backgroundColor: "rgba(14, 20, 32, 0.90)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: 26,
            padding: "30px 34px",
            border: "1.5px solid rgba(247, 127, 0, 0.45)",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(247, 127, 0, 0.2)",
            zIndex: 80,
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
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

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                <div style={{ fontSize: 19, color: "rgba(255, 255, 255, 0.72)", fontWeight: 500 }}>
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
                <div style={{ fontSize: 19, color: "rgba(255, 255, 255, 0.72)", fontWeight: 500 }}>
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
                <div style={{ fontSize: 19, color: "rgba(255, 255, 255, 0.72)", fontWeight: 500 }}>
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
                <div style={{ fontSize: 19, color: "rgba(255, 255, 255, 0.72)", fontWeight: 500 }}>
                  Cancel expensive cloud voice subscriptions
                </div>
              </div>
            </div>
          </div>

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

      {/* Floating CTA Badge */}
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
