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

interface WhiteboardSceneDay2Props {
  lines?: DialogueLine[];
  audioSrc?: string;
  seriesTitle?: string;
}

const INK_CHARCOAL = "#1F242D";
const INK_BLUE = "#2563EB";
const INK_ORANGE = "#F97316";

export const WhiteboardSceneDay2: React.FC<WhiteboardSceneDay2Props> = ({
  lines = [],
  audioSrc = "episode2_master.wav",
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
      {/* Master Audio Track (38.00s / 1140 frames) */}
      {audioSrc && <Audio src={staticFile(audioSrc)} />}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. LIGHT GRID WHITEBOARD BACKGROUND                      */}
      {/* ───────────────────────────────────────────────────────── */}
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
      {/* 2. TOP: OFFICIAL SERIES BRANDING (Mobile Safe: Y = 95px)   */}
      {/* ───────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 90,
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
            DAY 02 / 100
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
          Midjourney vs Flux.1 Schnell
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 3. HOOK POPUP BANNER (Frames 0 - 65 / 0-2s)               */}
      {/* ───────────────────────────────────────────────────────── */}
      {frame < 75 && (
        <div
          style={{
            position: "absolute",
            top: 170,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "center",
            zIndex: 60,
            opacity: frame < 60 ? fadeIn(0, 8) : fadeOut(60, 10),
            transform: `scale(${interpolate(frame, [0, 15], [0.85, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <div
            style={{
              backgroundColor: INK_CHARCOAL,
              color: "#FFFFFF",
              padding: "8px 28px",
              borderRadius: 24,
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: "0.04em",
              border: `2px solid ${INK_ORANGE}`,
              boxShadow: "0 8px 25px rgba(249, 115, 22, 0.35)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ color: "#EF4444" }}>Midjourney $120/yr</span>
            <span style={{ color: INK_ORANGE }}>VS</span>
            <span style={{ color: "#22C55E" }}>Flux $0</span>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 4. UPPER-MIDDLE: SEQUENTIAL EDUCATIONAL CONCEPT CARDS     */}
      {/* ───────────────────────────────────────────────────────── */}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* SCENE 1: MIDJOURNEY $120/YR TRAP (Frames 0 - 138)         */}
      {/* ═════════════════════════════════════════════════════════ */}
      {frame < 138 && (
        <div
          style={{
            position: "absolute",
            top: 245,
            left: 60,
            right: 60,
            opacity: frame < 128 ? fadeIn(0, 8) : fadeOut(128, 10),
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
              The <span style={{ color: "#EF4444" }}>Midjourney</span> Trap
            </div>
            <div style={{ fontSize: 20, color: "#6B7280", fontWeight: 700 }}>
              $10/mo = $120/year for AI thumbnails
            </div>
          </div>

          <svg width="960" height="380" viewBox="0 0 960 380" fill="none">
            {/* 1. Midjourney Subscription Card */}
            <rect
              x="40"
              y="30"
              width="380"
              height="210"
              rx="20"
              fill="#FFFFFF"
              stroke={INK_CHARCOAL}
              strokeWidth="3.5"
              style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.06))" }}
            />
            <text x="75" y="85" fill={INK_CHARCOAL} fontSize="28" fontWeight="800">
              🎨 Midjourney Basic Plan
            </text>
            <text x="75" y="130" fill="#4B5563" fontSize="22" fontWeight="700">
              $10.00 / month
            </text>
            <text x="75" y="170" fill="#EF4444" fontSize="20" fontWeight="800">
              Strict 3.3 GPU hrs/mo Limit
            </text>
            <text x="75" y="210" fill="#6B7280" fontSize="16" fontWeight="600">
              Can't write text properly
            </text>

            {/* Connecting Arrow */}
            <path
              d="M 430 135 L 510 135 M 495 120 L 510 135 L 495 150"
              stroke={INK_BLUE}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray="120"
              strokeDashoffset={120 * drawProgress(15, 18)}
            />

            {/* 2. Subscription Cost Card */}
            <g opacity={fadeIn(25, 10)}>
              <rect
                x="530"
                y="30"
                width="390"
                height="210"
                rx="20"
                fill="#FFFFFF"
                stroke={INK_CHARCOAL}
                strokeWidth="3.5"
                style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.06))" }}
              />
              <text x="565" y="95" fill={INK_CHARCOAL} fontSize="46" fontWeight="900">
                $10.00 / mo
              </text>
              <text x="568" y="145" fill="#DC2626" fontSize="26" fontWeight="900">
                = $120.00 / year
              </text>
              <text x="568" y="185" fill="#6B7280" fontSize="19" fontWeight="600">
                Wasted recurring cost
              </text>

              {/* Progressive Orange Strike-Through Lines Across Cost */}
              <path
                d="M 520 245 L 930 25"
                stroke={INK_ORANGE}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="520"
                strokeDashoffset={520 * drawProgress(55, 22)}
              />
              <path
                d="M 520 25 L 930 245"
                stroke={INK_ORANGE}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="520"
                strokeDashoffset={520 * drawProgress(70, 22)}
              />
            </g>
          </svg>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* SCENE 2: STEP CARD 1 — FLUX.1 SCHNELL (Frames 138 - 338)   */}
      {/* ═════════════════════════════════════════════════════════ */}
      {frame >= 138 && frame < 338 && (
        <div
          style={{
            position: "absolute",
            top: 245,
            left: 60,
            right: 60,
            opacity: frame < 328 ? fadeIn(138, 10) : fadeOut(328, 10),
            zIndex: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 26,
              padding: "34px 40px",
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
                marginBottom: 18,
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
                Open Source Image AI
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
                fontSize: 44,
                fontWeight: 900,
                color: INK_CHARCOAL,
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}
            >
              Flux.1 Schnell Model
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 24,
                color: "#374151",
                lineHeight: 1.5,
                fontWeight: 600,
              }}
            >
              Created by Black Forest Labs (original Stable Diffusion researchers). A 12-billion parameter model producing studio-grade images in 4 steps for zero dollars.
            </div>

            {/* Feature Highlights */}
            <div
              style={{
                marginTop: 22,
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
              <span>⚡ 4-Step Schnell</span>
              <span>💾 12B Open Weights</span>
              <span>💻 Browser or Local</span>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* SCENE 3: STEP CARD 2 — 4 STYLES ALL FREE (338 - 544)       */}
      {/* ═════════════════════════════════════════════════════════ */}
      {frame >= 338 && frame < 544 && (
        <div
          style={{
            position: "absolute",
            top: 240,
            left: 60,
            right: 60,
            opacity: frame < 534 ? fadeIn(338, 10) : fadeOut(534, 10),
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
              Step Card 2: <span style={{ color: INK_ORANGE }}>4 Styles — All Free</span>
            </div>
            <div style={{ fontSize: 18, color: "#6B7280", fontWeight: 700 }}>
              Photoreal, Anime, 3D, and perfect in-image typography
            </div>
          </div>

          {/* 4 Styles Grid */}
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
                padding: "16px 14px",
                borderRadius: 20,
                border: "2px solid #E2E8F0",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>📸</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: INK_CHARCOAL }}>
                Photorealism
              </div>
              <div style={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>
                Natural skin, hands & lens lighting
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "16px 14px",
                borderRadius: 20,
                border: "2px solid #E2E8F0",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>🎨</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: INK_CHARCOAL }}>
                Anime & Manga
              </div>
              <div style={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>
                Crisp linework & dynamic cel shades
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "16px 14px",
                borderRadius: 20,
                border: "2px solid #E2E8F0",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>🧊</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: INK_CHARCOAL }}>
                3D Isometric
              </div>
              <div style={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>
                Stylized Pixar-grade game art
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "16px 14px",
                borderRadius: 20,
                border: "2px solid #E2E8F0",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>🔤</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: INK_CHARCOAL }}>
                Text in Image
              </div>
              <div style={{ fontSize: 14, color: "#16A34A", fontWeight: 700 }}>
                Flawless spelling (Beats Midjourney)
              </div>
            </div>
          </div>

          {/* In-Browser Badge */}
          <div
            style={{
              backgroundColor: "rgba(37, 99, 235, 0.08)",
              borderRadius: 18,
              padding: "14px 20px",
              border: `2px solid ${INK_BLUE}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 28 }}>🌐</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: INK_BLUE }}>
                Runs 100% Free In Your Browser
              </div>
              <div style={{ fontSize: 14, color: "#4B5563", fontWeight: 600 }}>
                Hugging Face Spaces & Fal.ai — zero install or GPU needed
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* SCENE 4: SUMMARY & $120/YR SAVINGS (Frames 544 - 800)      */}
      {/* ═════════════════════════════════════════════════════════ */}
      {frame >= 544 && (
        <div
          style={{
            position: "absolute",
            top: 245,
            left: 60,
            right: 60,
            opacity: fadeIn(544, 10),
            zIndex: 20,
          }}
        >
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
              Summary: Midjourney Cancelled
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
                Annual Savings:
              </div>
              <div
                style={{
                  fontSize: 50,
                  fontWeight: 900,
                  color: "#16A34A",
                  letterSpacing: "-0.02em",
                }}
              >
                +$120.00 / yr
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
                <span>Flux.1 Schnell Setup:</span>
                <span style={{ color: "#16A34A" }}>$0.00 (Hugging Face)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Midjourney Subscription:</span>
                <span style={{ color: "#EF4444", textDecoration: "line-through" }}>
                  $120.00 / year
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Model Quality:</span>
                <span style={{ color: "#16A34A" }}>Same as Midjourney v6</span>
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
                <span>Total 1-Year Cash Kept in Pocket:</span>
                <span>$120.00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 5. MIDDLE-LOWER: SPEAKING CHARACTER                       */}
      {/* ───────────────────────────────────────────────────────── */}
      {/* Compact ~40px gap from concept card bottom                */}
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
      {/* 6. DIALOGUE SUBTITLES BAR (Top = 1090px)                   */}
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
      {/* 7. PROMINENT COMMENT CTA (Frames 611 - 800)                */}
      {/* ───────────────────────────────────────────────────────── */}
      {frame >= 611 && (
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
            opacity: fadeIn(611, 10),
            transform: `scale(${interpolate(frame, [611, 626], [0.92, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        >
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
            {/* Action Bar */}
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
