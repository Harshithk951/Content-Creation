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

interface WhiteboardSceneDay3Props {
  lines?: DialogueLine[];
  audioSrc?: string;
  seriesTitle?: string;
}

const INK_CHARCOAL = "#1F242D";
const INK_BLUE = "#2563EB";
const INK_ORANGE = "#F97316";

export const WhiteboardSceneDay3: React.FC<WhiteboardSceneDay3Props> = ({
  lines = [],
  audioSrc = "episode3_master.wav",
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
      {/* Master Audio Track (37.89s / 1137 frames) */}
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
      {/* 2. TOP: OFFICIAL SERIES BRANDING (Mobile Safe: Y = 90px)   */}
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
            DAY 03 / 100
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
          GitHub Copilot vs Cline + DeepSeek
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 3. OPENING HOOK BADGE (Frames 0 - 65)                     */}
      {/* ───────────────────────────────────────────────────────── */}
      {frame < 65 && (
        <div
          style={{
            position: "absolute",
            top: 175,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 60,
            opacity: fadeOut(55, 10),
            transform: `scale(${interpolate(frame, [0, 12], [0.85, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <div
            style={{
              backgroundColor: "#DC2626",
              color: "#FFFFFF",
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "8px 22px",
              borderRadius: 20,
              boxShadow: "0 8px 24px rgba(220, 38, 38, 0.35)",
              border: "2px solid #FFFFFF",
            }}
          >
            ⚡ GitHub Copilot $120/yr VS Cline $0
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 4. UPPER-MIDDLE: DYNAMIC EDUCATIONAL CONCEPT CARD         */}
      {/* ───────────────────────────────────────────────────────── */}
      {/* Placement: Top = 245px, Height = 480px                   */}

      {/* ── SCENE 1: THE COPILOT SUBSCRIPTION TRAP (Frames 0 - 257) ── */}
      {frame < 257 && (
        <div
          style={{
            position: "absolute",
            top: 245,
            left: 60,
            right: 60,
            height: 480,
            backgroundColor: "#FFFFFF",
            borderRadius: 28,
            border: `3px solid ${INK_CHARCOAL}`,
            boxShadow: "0 18px 48px rgba(0, 0, 0, 0.12)",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            zIndex: 40,
            opacity: frame < 245 ? fadeIn(0, 6) : fadeOut(245, 12),
          }}
        >
          {/* Section Heading */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: INK_CHARCOAL,
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              The <span style={{ color: "#EF4444" }}>GitHub Copilot</span> Trap
            </div>
            <div style={{ fontSize: 20, color: "#6B7280", fontWeight: 700 }}>
              $10/mo = $120/year just for inline autocompletes
            </div>
          </div>

          <svg width="960" height="360" viewBox="0 0 960 360" fill="none">
            {/* 1. GitHub Copilot Subscription Card */}
            <rect
              x="40"
              y="20"
              width="390"
              height="220"
              rx="20"
              fill="#FFFFFF"
              stroke={INK_CHARCOAL}
              strokeWidth="3.5"
              style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.06))" }}
            />
            <text x="75" y="75" fill={INK_CHARCOAL} fontSize="28" fontWeight="800">
              🤖 GitHub Copilot Individual
            </text>
            <text x="75" y="120" fill="#4B5563" fontSize="22" fontWeight="700">
              $10.00 / month ($120/yr)
            </text>
            <text x="75" y="160" fill="#EF4444" fontSize="20" fontWeight="800">
              ❌ Tab Autocomplete Only
            </text>
            <text x="75" y="200" fill="#6B7280" fontSize="16" fontWeight="600">
              Cannot edit multiple files or run tests
            </text>

            {/* Connecting Arrow */}
            <path
              d="M 440 130 L 515 130 M 500 115 L 515 130 L 500 145"
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
                y="20"
                width="390"
                height="220"
                rx="20"
                fill="#FFFFFF"
                stroke={INK_CHARCOAL}
                strokeWidth="3.5"
                style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.06))" }}
              />
              <text x="565" y="85" fill={INK_CHARCOAL} fontSize="46" fontWeight="900">
                $10.00 / mo
              </text>
              <text x="568" y="135" fill="#DC2626" fontSize="26" fontWeight="900">
                = $120.00 / year
              </text>
              <text x="568" y="175" fill="#6B7280" fontSize="19" fontWeight="600">
                Recurring fee for basic suggestions
              </text>

              {/* Progressive Orange Strike-Through Lines Across Cost */}
              <path
                d="M 520 235 L 930 25"
                stroke={INK_ORANGE}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="520"
                strokeDashoffset={520 * drawProgress(55, 22)}
              />
              <path
                d="M 520 25 L 930 235"
                stroke={INK_ORANGE}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="520"
                strokeDashoffset={520 * drawProgress(75, 22)}
              />
            </g>

            {/* Bottom Alert Pill */}
            <g opacity={fadeIn(100, 12)}>
              <rect
                x="140"
                y="265"
                width="680"
                height="56"
                rx="16"
                fill="#FEF2F2"
                stroke="#EF4444"
                strokeWidth="2.5"
              />
              <text
                x="480"
                y="302"
                fill="#DC2626"
                fontSize="22"
                fontWeight="800"
                textAnchor="middle"
              >
                ⚠️ Why pay $120/yr for suggestions when you can get an autonomous agent?
              </text>
            </g>
          </svg>
        </div>
      )}

      {/* ── SCENE 2: STEP CARD 1 — CLINE + DEEPSEEK (Frames 257 - 569) ── */}
      {frame >= 257 && frame < 569 && (
        <div
          style={{
            position: "absolute",
            top: 245,
            left: 60,
            right: 60,
            height: 480,
            backgroundColor: "#FFFFFF",
            borderRadius: 28,
            border: `3px solid ${INK_CHARCOAL}`,
            boxShadow: "0 18px 48px rgba(0, 0, 0, 0.12)",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            zIndex: 40,
            opacity: frame < 555 ? fadeIn(257, 8) : fadeOut(555, 14),
          }}
        >
          {/* Section Heading */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: INK_CHARCOAL,
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Step 1: <span style={{ color: INK_ORANGE }}>Cline + DeepSeek</span>
            </div>
            <div style={{ fontSize: 20, color: "#4B5563", fontWeight: 700 }}>
              Autonomous AI Software Engineer inside VS Code — 100% Free
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginTop: 10,
            }}
          >
            {/* Feature Box 1 */}
            <div
              style={{
                border: "2.5px solid #E5E7EB",
                borderRadius: 20,
                padding: "20px 22px",
                backgroundColor: "#F9FAFB",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: INK_CHARCOAL,
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span>⚡</span> Autonomous Agent
              </div>
              <div style={{ fontSize: 18, color: "#4B5563", lineHeight: 1.45, fontWeight: 600 }}>
                Doesn't just predict the next word. It plans, writes code, tests in terminal, and fixes its own mistakes.
              </div>
            </div>

            {/* Feature Box 2 */}
            <div
              style={{
                border: `2.5px solid ${INK_ORANGE}`,
                borderRadius: 20,
                padding: "20px 22px",
                backgroundColor: "#FFF7ED",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: INK_ORANGE,
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span>💰</span> Zero Subscriptions
              </div>
              <div style={{ fontSize: 18, color: "#4B5563", lineHeight: 1.45, fontWeight: 600 }}>
                Open-source extension in VS Code. Connect free DeepSeek API tokens or run fully local with Ollama.
              </div>
            </div>
          </div>

          {/* Quick Comparison Bar */}
          <div
            style={{
              marginTop: 20,
              backgroundColor: "#EFF6FF",
              border: `2px solid ${INK_BLUE}`,
              borderRadius: 18,
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#6B7280" }}>
                GitHub Copilot
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#EF4444" }}>
                $10/mo • Autocomplete Only
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: INK_CHARCOAL }}>VS</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#6B7280" }}>
                Cline + DeepSeek
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#16A34A" }}>
                $0 • Autonomous Coding Agent
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SCENE 3: STEP CARD 2 — 4 AGENT SUPERPOWERS (Frames 569 - 842) ── */}
      {frame >= 569 && frame < 842 && (
        <div
          style={{
            position: "absolute",
            top: 245,
            left: 60,
            right: 60,
            height: 480,
            backgroundColor: "#FFFFFF",
            borderRadius: 28,
            border: `3px solid ${INK_CHARCOAL}`,
            boxShadow: "0 18px 48px rgba(0, 0, 0, 0.12)",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            zIndex: 40,
            opacity: frame < 828 ? fadeIn(569, 8) : fadeOut(828, 14),
          }}
        >
          {/* Section Heading */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: INK_CHARCOAL,
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Step 2: <span style={{ color: INK_BLUE }}>Full Agent Autonomy</span>
            </div>
            <div style={{ fontSize: 20, color: "#4B5563", fontWeight: 700 }}>
              What Cline does inside your VS Code workspace
            </div>
          </div>

          {/* 4 Superpower Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 6,
            }}
          >
            {/* Card 1: Reads Entire Repo */}
            <div
              style={{
                backgroundColor: "#F3F4F6",
                border: "2px solid #E5E7EB",
                borderRadius: 18,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{ fontSize: 36 }}>📂</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: INK_CHARCOAL }}>
                  Reads Full Repo
                </div>
                <div style={{ fontSize: 16, color: "#6B7280", fontWeight: 600 }}>
                  Understands your entire project context
                </div>
              </div>
            </div>

            {/* Card 2: Multi-File Edits */}
            <div
              style={{
                backgroundColor: "#F3F4F6",
                border: "2px solid #E5E7EB",
                borderRadius: 18,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{ fontSize: 36 }}>✍️</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: INK_CHARCOAL }}>
                  Creates & Edits Files
                </div>
                <div style={{ fontSize: 16, color: "#6B7280", fontWeight: 600 }}>
                  Builds full multi-file features directly
                </div>
              </div>
            </div>

            {/* Card 3: Runs Terminal Commands */}
            <div
              style={{
                backgroundColor: "#F3F4F6",
                border: "2px solid #E5E7EB",
                borderRadius: 18,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{ fontSize: 36 }}>💻</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: INK_CHARCOAL }}>
                  Runs Terminal
                </div>
                <div style={{ fontSize: 16, color: "#6B7280", fontWeight: 600 }}>
                  Executes npm run, tests, and builds
                </div>
              </div>
            </div>

            {/* Card 4: Auto-Debugs Errors */}
            <div
              style={{
                backgroundColor: "#F3F4F6",
                border: "2px solid #E5E7EB",
                borderRadius: 18,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{ fontSize: 36 }}>🐛</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: INK_CHARCOAL }}>
                  Auto-Fixes Errors
                </div>
                <div style={{ fontSize: 16, color: "#6B7280", fontWeight: 600 }}>
                  Catches test failures & repairs bugs
                </div>
              </div>
            </div>
          </div>

          {/* Bottom badge */}
          <div
            style={{
              marginTop: 18,
              textAlign: "center",
              fontSize: 19,
              fontWeight: 800,
              color: INK_BLUE,
              backgroundColor: "#EFF6FF",
              padding: "10px 18px",
              borderRadius: 14,
            }}
          >
            ⚡ Open Source Extension in VS Code Marketplace • No Credit Card Required
          </div>
        </div>
      )}

      {/* ── SCENE 4: SUMMARY & SAVINGS BREAKDOWN (Frames 842 - 1137) ── */}
      {frame >= 842 && (
        <div
          style={{
            position: "absolute",
            top: 245,
            left: 60,
            right: 60,
            height: 480,
            backgroundColor: "#FFFFFF",
            borderRadius: 28,
            border: `3px solid ${INK_CHARCOAL}`,
            boxShadow: "0 18px 48px rgba(0, 0, 0, 0.12)",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            zIndex: 40,
            opacity: fadeIn(842, 10),
          }}
        >
          {/* Section Heading */}
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: INK_CHARCOAL,
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Annual Savings: <span style={{ color: "#16A34A" }}>$120 / Year</span>
            </div>
            <div style={{ fontSize: 20, color: "#4B5563", fontWeight: 700 }}>
              Better AI coding assistant with zero monthly bills
            </div>
          </div>

          {/* Breakdown List */}
          <div
            style={{
              backgroundColor: "#F8FAFC",
              borderRadius: 20,
              border: "2px solid #E2E8F0",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontSize: 20,
              fontWeight: 700,
              color: INK_CHARCOAL,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>GitHub Copilot Subscription:</span>
              <span style={{ color: "#EF4444", textDecoration: "line-through" }}>
                $120.00 / year
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Cline Open Source Extension:</span>
              <span style={{ color: "#16A34A" }}>$0.00 (Free)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>DeepSeek / Ollama Engine:</span>
              <span style={{ color: "#16A34A" }}>$0.00 (Open Weights)</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 10,
                borderTop: "1px dashed #CBD5E1",
                fontWeight: 900,
                color: INK_ORANGE,
                fontSize: 22,
              }}
            >
              <span>Total 1-Year Cash Kept in Pocket:</span>
              <span>$120.00</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 800,
              color: "#16A34A",
              backgroundColor: "#DCFCE7",
              padding: "10px 18px",
              borderRadius: 14,
            }}
          >
            ✅ Runs 100% locally on your computer or with free cloud API tokens
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 5. MIDDLE-LOWER: SPEAKING CHARACTER                       */}
      {/* ───────────────────────────────────────────────────────── */}
      {/* Compact ~55px gap from concept card bottom                */}
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
      {/* 7. PROMINENT COMMENT CTA (Frames 925 - 1137)               */}
      {/* ───────────────────────────────────────────────────────── */}
      {frame >= 925 && (
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
            opacity: fadeIn(925, 10),
            transform: `scale(${interpolate(frame, [925, 940], [0.92, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 820,
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              border: `3.5px solid ${INK_ORANGE}`,
              boxShadow: "0 16px 40px rgba(249, 115, 22, 0.25)",
              padding: "20px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 900,
                color: INK_CHARCOAL,
                letterSpacing: "0.04em",
                marginBottom: 6,
              }}
            >
              COMMENT <span style={{ color: INK_ORANGE }}>"FREE"</span>
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#4B5563",
                letterSpacing: "-0.01em",
              }}
            >
              GET THE 1-CLICK VS CODE SETUP GUIDE
            </div>
          </div>

          {/* Animated Bouncing Pointer Arrow */}
          <div
            style={{
              marginTop: 12,
              transform: `translateY(${arrowBounce}px)`,
              fontSize: 36,
            }}
          >
            👇
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
