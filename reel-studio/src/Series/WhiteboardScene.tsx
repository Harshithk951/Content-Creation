import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { DialogueLine } from "./types";
import { SpeakerCircle } from "./SpeakerCircle";

interface WhiteboardSceneProps {
  lines?: DialogueLine[];
  audioSrc?: string;
  seriesTitle?: string;
}

const INK_CHARCOAL = "#1F242D";
const INK_BLUE = "#2563EB";
const INK_ORANGE = "#F97316";

export const WhiteboardScene: React.FC<WhiteboardSceneProps> = ({
  lines = [],
  audioSrc = "episode1_master.wav",
}) => {
  const frame = useCurrentFrame();

  // Find active dialogue line
  const activeLine =
    lines.find(
      (l) => frame >= l.startFrame && frame < l.startFrame + l.durationFrames
    ) || lines[lines.length - 1];

  const currentSpeaker = activeLine ? activeLine.speaker : "boy";
  const isClaudeSpeaking = currentSpeaker === "claude" || currentSpeaker === "kip";

  // Helper for stroke draw-in progress (0 = fully drawn, 1 = hidden)
  const drawProgress = (start: number, duration: number) => {
    return interpolate(frame, [start, start + duration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  // Helper for opacity fade-in
  const fadeIn = (start: number, duration: number = 8) => {
    return interpolate(frame, [start, start + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  // Helper for crossfade out
  const fadeOut = (start: number, duration: number = 8) => {
    return interpolate(frame, [start, start + duration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  // Subtle bounce for CTA arrow
  const arrowBounce = Math.sin(frame * 0.22) * 5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FAF9F6",
        overflow: "hidden",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Montserrat", "Inter", sans-serif',
      }}
    >
      {/* Master Audio Track (38.67s / 1160 frames) */}
      {audioSrc && <Audio src={staticFile(audioSrc)} />}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. LIGHT GRID WHITEBOARD BACKGROUND                      */}
      {/* ───────────────────────────────────────────────────────── */}
      {/* Subtle 50px grid lines (8-10% opacity) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(31, 36, 45, 0.08) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(31, 36, 45, 0.08) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Soft radial dry-erase lighting */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(255, 255, 255, 0.75) 0%, rgba(245, 244, 238, 0.45) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top subtle brand accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: INK_ORANGE,
        }}
      />

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. TOP: OFFICIAL SERIES BRANDING (Compact & Mobile-Safe)   */}
      {/* ───────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 95,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            backgroundColor: "#FFFFFF",
            padding: "8px 24px",
            borderRadius: 30,
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
            border: `2px solid ${INK_ORANGE}`,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: INK_CHARCOAL,
            }}
          >
            100 DAYS OF FREE AI
          </span>
          <span
            style={{
              backgroundColor: INK_ORANGE,
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: 900,
              padding: "3px 12px",
              borderRadius: 12,
              letterSpacing: "0.06em",
            }}
          >
            DAY 01 / 100
          </span>
        </div>

        <div
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "#4B5563",
            letterSpacing: "-0.01em",
          }}
        >
          Kokoro 82M — The Free AI Voice Stack
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 3. UPPER-MIDDLE: SEQUENTIAL EDUCATIONAL CONCEPT CARDS     */}
      {/* ───────────────────────────────────────────────────────── */}
      {/* Positioned between Y = 250px and Y = 780px.                 */}
      {/* Moved DOWNWARD slightly from top to balance the screen.    */}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* SCENE 1: CLOUD VOICE APPS & $50/MO TRAP (Frames 0 - 135)   */}
      {/* ═════════════════════════════════════════════════════════ */}
      {frame < 135 && (
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 60,
            right: 60,
            opacity: frame < 125 ? fadeIn(5, 10) : fadeOut(125, 10),
            zIndex: 20,
          }}
        >
          {/* Section Heading */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: INK_CHARCOAL,
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              What is <span style={{ color: INK_ORANGE }}>Kokoro</span>? Free AI Voice Stack
            </div>
            <div style={{ fontSize: 20, color: "#6B7280", fontWeight: 700 }}>
              The Problem with Commercial Voice Subscriptions
            </div>
          </div>

          <svg width="960" height="380" viewBox="0 0 960 380" fill="none">
            {/* 1. Cloud Voice Apps Card */}
            <rect
              x="40"
              y="30"
              width="360"
              height="200"
              rx="20"
              fill="#FFFFFF"
              stroke={INK_CHARCOAL}
              strokeWidth="3.5"
              style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.06))" }}
            />
            <text x="75" y="85" fill={INK_CHARCOAL} fontSize="28" fontWeight="800">
              ☁️ Cloud Voice Apps
            </text>
            <text x="75" y="130" fill="#4B5563" fontSize="22" fontWeight="700">
              ElevenLabs / PlayHT
            </text>
            <text x="75" y="175" fill="#EF4444" fontSize="20" fontWeight="800">
              Monthly Credit Caps
            </text>

            {/* Connecting Arrow */}
            <path
              d="M 410 130 L 500 130 M 485 115 L 500 130 L 485 145"
              stroke={INK_BLUE}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray="120"
              strokeDashoffset={120 * drawProgress(25, 20)}
            />

            {/* 2. Subscription Cost Card */}
            <g opacity={fadeIn(35, 12)}>
              <rect
                x="520"
                y="30"
                width="400"
                height="200"
                rx="20"
                fill="#FFFFFF"
                stroke={INK_CHARCOAL}
                strokeWidth="3.5"
                style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.06))" }}
              />
              <text x="555" y="95" fill={INK_CHARCOAL} fontSize="46" fontWeight="900">
                $50.00 / mo
              </text>
              <text x="558" y="145" fill="#DC2626" fontSize="24" fontWeight="800">
                = $600.00 / year
              </text>
              <text x="558" y="185" fill="#6B7280" fontSize="19" fontWeight="600">
                Subscription recurring cost
              </text>

              {/* Progressive Orange Strike-Through Lines Across Cost */}
              <path
                d="M 505 240 L 935 20"
                stroke={INK_ORANGE}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="520"
                strokeDashoffset={520 * drawProgress(70, 25)}
              />
              <path
                d="M 505 20 L 935 240"
                stroke={INK_ORANGE}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="520"
                strokeDashoffset={520 * drawProgress(85, 25)}
              />
            </g>
          </svg>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* SCENE 2: KOKORO 82M MODEL (Frames 135 - 255)               */}
      {/* ═════════════════════════════════════════════════════════ */}
      {frame >= 135 && frame < 255 && (
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 60,
            right: 60,
            opacity: frame < 245 ? fadeIn(135, 10) : fadeOut(245, 10),
            zIndex: 20,
          }}
        >
          {/* Main Kokoro Hero Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 26,
              padding: "36px 42px",
              boxShadow: "0 14px 45px rgba(249, 115, 22, 0.12)",
              border: `3px solid ${INK_ORANGE}`,
              position: "relative",
            }}
          >
            {/* Header Badges */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  backgroundColor: INK_ORANGE,
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: 900,
                  padding: "6px 18px",
                  borderRadius: 16,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Open Source TTS
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#16A34A",
                  backgroundColor: "rgba(22, 163, 74, 0.12)",
                  padding: "6px 20px",
                  borderRadius: 20,
                  border: "1.5px solid rgba(22, 163, 74, 0.3)",
                }}
              >
                100% Free ($0)
              </div>
            </div>

            {/* Heading */}
            <div
              style={{
                fontSize: 46,
                fontWeight: 900,
                color: INK_CHARCOAL,
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}
            >
              Kokoro 82M Model
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 25,
                color: "#374151",
                lineHeight: 1.5,
                fontWeight: 600,
              }}
            >
              Kokoro is an open-source text-to-speech model that converts written text into studio-grade, human-sounding audio completely offline.
            </div>

            {/* Starburst accents */}
            <div
              style={{
                marginTop: 24,
                paddingTop: 18,
                borderTop: "1.5px solid #F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 18,
                fontWeight: 800,
                color: INK_BLUE,
              }}
            >
              <span>⚡ Apache 2.0 Open License</span>
              <span>💾 82 Megabytes</span>
              <span>💻 Runs on CPU</span>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* SCENE 3: HOW IT WORKS — TTS WORKFLOW (Frames 255 - 578)   */}
      {/* ═════════════════════════════════════════════════════════ */}
      {frame >= 255 && frame < 578 && (
        <div
          style={{
            position: "absolute",
            top: 240,
            left: 60,
            right: 60,
            opacity: frame < 565 ? fadeIn(255, 10) : fadeOut(565, 10),
            zIndex: 20,
          }}
        >
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: INK_CHARCOAL,
                letterSpacing: "-0.02em",
                marginBottom: 4,
              }}
            >
              How Kokoro Works <span style={{ color: INK_BLUE }}>(TTS Pipeline)</span>
            </div>
            <div style={{ fontSize: 18, color: "#6B7280", fontWeight: 700 }}>
              From written script to high-fidelity audio
            </div>
          </div>

          {/* 3-Stage Pipeline Diagram */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 22,
              padding: "20px 24px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)",
              border: "2px solid rgba(37, 99, 235, 0.3)",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              {/* Stage 1 */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#F8FAFC",
                  padding: "14px 8px",
                  borderRadius: 16,
                  border: "1.5px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 2 }}>📝</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: INK_CHARCOAL }}>
                  1. Written Text
                </div>
                <div style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>
                  Script / Prompts
                </div>
              </div>

              <div style={{ fontSize: 22, color: INK_BLUE, fontWeight: 900 }}>➔</div>

              {/* Stage 2 */}
              <div
                style={{
                  flex: 1.25,
                  backgroundColor: "rgba(249, 115, 22, 0.08)",
                  padding: "14px 8px",
                  borderRadius: 16,
                  border: `2.5px solid ${INK_ORANGE}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 2 }}>🧠</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: INK_ORANGE }}>
                  2. Kokoro (82M)
                </div>
                <div style={{ fontSize: 13, color: "#9A3412", fontWeight: 700 }}>
                  Local Neural TTS
                </div>
              </div>

              <div style={{ fontSize: 22, color: INK_BLUE, fontWeight: 900 }}>➔</div>

              {/* Stage 3 */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#F8FAFC",
                  padding: "14px 8px",
                  borderRadius: 16,
                  border: "1.5px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 2 }}>🔊</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: INK_CHARCOAL }}>
                  3. Natural Voice
                </div>
                <div style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>
                  Studio Audio
                </div>
              </div>
            </div>
          </div>

          {/* 4-Item Benefits Checklist */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 22,
              padding: "18px 24px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)",
              border: "1.5px solid #E2E8F0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#16A34A", fontSize: 20, fontWeight: 900 }}>✓</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: INK_CHARCOAL }}>
                  <strong>10-Second Download:</strong> Tiny 82MB model file (runs instantly).
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#16A34A", fontSize: 20, fontWeight: 900 }}>✓</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: INK_CHARCOAL }}>
                  <strong>100% Offline & Private:</strong> Zero cloud API requests or tracking.
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#16A34A", fontSize: 20, fontWeight: 900 }}>✓</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: INK_CHARCOAL }}>
                  <strong>Zero GPU Required:</strong> Runs smoothly on any standard laptop CPU.
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#16A34A", fontSize: 20, fontWeight: 900 }}>✓</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: INK_CHARCOAL }}>
                  <strong>$0 / Month Forever:</strong> Completely eliminates voice subscriptions.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* SCENE 4: VOICE VARIETIES & STYLES (Frames 578 - 808)      */}
      {/* ═════════════════════════════════════════════════════════ */}
      {frame >= 578 && frame < 808 && (
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 60,
            right: 60,
            opacity: frame < 795 ? fadeIn(578, 10) : fadeOut(795, 10),
            zIndex: 20,
          }}
        >
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: INK_CHARCOAL,
                letterSpacing: "-0.02em",
                marginBottom: 4,
              }}
            >
              Studio-Grade Voice Varieties
            </div>
            <div style={{ fontSize: 18, color: "#6B7280", fontWeight: 700 }}>
              Natural human intonation across accents and genders
            </div>
          </div>

          {/* Voice Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "18px 14px",
                borderRadius: 20,
                border: "2px solid #E2E8F0",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>🇺🇸</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: INK_CHARCOAL }}>
                American Accent
              </div>
              <div style={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>
                Natural Pace & Rhythm
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "18px 14px",
                borderRadius: 20,
                border: "2px solid #E2E8F0",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>🇬🇧</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: INK_CHARCOAL }}>
                British Accent
              </div>
              <div style={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>
                Clear Enunciation
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "18px 14px",
                borderRadius: 20,
                border: "2px solid #E2E8F0",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>👨</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: INK_CHARCOAL }}>
                Male Voices
              </div>
              <div style={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>
                Warm & Authoritative
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "18px 14px",
                borderRadius: 20,
                border: "2px solid #E2E8F0",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>👩</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: INK_CHARCOAL }}>
                Female Voices
              </div>
              <div style={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>
                Expressive & Clear
              </div>
            </div>
          </div>

          {/* Sarcastic Companion Badge */}
          <div
            style={{
              backgroundColor: "rgba(249, 115, 22, 0.08)",
              borderRadius: 18,
              padding: "14px 20px",
              border: `2px solid ${INK_ORANGE}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 28 }}>🤖</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: INK_ORANGE }}>
                Even a Sarcastic Genius like Claude
              </div>
              <div style={{ fontSize: 14, color: "#6B7280", fontWeight: 600 }}>
                Custom cadence, humor, and perfect deadpan comedic timing
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* SCENE 5: SUMMARY & TOTAL COST (Frames 808 - 1160)          */}
      {/* ═════════════════════════════════════════════════════════ */}
      {frame >= 808 && (
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 60,
            right: 60,
            opacity: fadeIn(808, 10),
            zIndex: 20,
          }}
        >
          {/* Main Summary Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 26,
              padding: "28px 34px",
              boxShadow: "0 14px 45px rgba(0, 0, 0, 0.08)",
              border: "2.5px solid #E2E8F0",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: INK_BLUE,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Summary: The Free AI Voice Stack
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 14,
                paddingBottom: 14,
                borderBottom: "1.5px solid #F3F4F6",
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 800, color: INK_CHARCOAL }}>
                Total Setup Cost:
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: "#16A34A",
                  letterSpacing: "-0.02em",
                }}
              >
                $0.00
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 18,
                fontWeight: 700,
                color: INK_CHARCOAL,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Hardware Requirement:</span>
                <span style={{ color: "#16A34A" }}>Any Laptop ($0)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Model License:</span>
                <span style={{ color: "#16A34A" }}>Apache 2.0 ($0)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Cloud API Fees:</span>
                <span style={{ color: "#16A34A" }}>None ($0)</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 8,
                  borderTop: "1px dashed #E2E8F0",
                  fontWeight: 900,
                  color: INK_ORANGE,
                }}
              >
                <span>Annual Savings vs Commercial TTS:</span>
                <span>$600.00 / year</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 4. MIDDLE-LOWER: SPEAKING CHARACTER (MOVED UPWARD)        */}
      {/* ───────────────────────────────────────────────────────── */}
      {/* Positioned directly beneath the educational concept card  */}
      {/* Top: 780px — compact, tight 40px gap from card bottom!   */}
      <div
        style={{
          position: "absolute",
          top: 780,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 80,
        }}
      >
        <SpeakerCircle
          speaker={isClaudeSpeaking ? "claude" : "boy"}
          size={240}
        />
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 5. DIALOGUE SUBTITLES BAR (MOVED UPWARD: Top = 1090px)     */}
      {/* ───────────────────────────────────────────────────────── */}
      {activeLine && (
        <div
          style={{
            position: "absolute",
            top: 1090,
            left: 60,
            right: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 90,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 960,
              padding: "16px 24px",
              borderRadius: 20,
              backgroundColor: "rgba(31, 36, 45, 0.95)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
              border: "1.5px solid rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 6,
                height: 40,
                borderRadius: 4,
                backgroundColor: isClaudeSpeaking ? INK_ORANGE : INK_BLUE,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
                textAlign: "left",
              }}
            >
              {activeLine.text}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 6. PROMINENT COMMENT CTA (Frames 878 - 1160)               */}
      {/* ───────────────────────────────────────────────────────── */}
      {/* Appears during Claude's final spoken CTA dialogue         */}
      {/* Positioned cleanly below Subtitles (Top: 1260px)          */}
      {frame >= 878 && (
        <div
          style={{
            position: "absolute",
            top: 1260,
            left: 60,
            right: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 95,
            opacity: fadeIn(878, 12),
            transform: `scale(${interpolate(frame, [878, 895], [0.92, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          {/* Main CTA Card with Drawing Reveal */}
          <div
            style={{
              width: "100%",
              maxWidth: 820,
              backgroundColor: "#161D2B",
              borderRadius: 24,
              border: `3px solid ${INK_ORANGE}`,
              boxShadow: "0 14px 40px rgba(249, 115, 22, 0.35), 0 0 20px rgba(249, 115, 22, 0.2)",
              padding: "20px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Primary Action Button Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                }}
              >
                COMMENT <span style={{ color: INK_ORANGE }}>FREE</span>
              </span>
              <span
                style={{
                  fontSize: 32,
                  transform: `translateY(${arrowBounce}px)`,
                  display: "inline-block",
                }}
              >
                👇
              </span>
            </div>

            {/* Supporting Text */}
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#CBD5E1",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              GET THE FREE SETUP GUIDE
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
