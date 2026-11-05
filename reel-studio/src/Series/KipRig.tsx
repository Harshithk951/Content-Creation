import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Emotion } from "./types";

interface KipRigProps {
  emotion: Emotion;
  isSpeaking: boolean;
  scale?: number;
}

export const KipRig: React.FC<KipRigProps> = ({
  emotion,
  isSpeaking,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating hover sine wave
  const hoverY = Math.sin((frame / fps) * 2.5) * 12;
  const hoverTilt = Math.sin((frame / fps) * 1.5) * 2;

  // Speech mouth/energy bounce
  const speechPulse = isSpeaking ? Math.abs(Math.sin((frame / fps) * 18)) * 0.05 : 0;

  // Eye blink every ~90 frames (3 seconds)
  const isBlinking = frame % 90 > 84;

  // Antenna wobble
  const antennaWobble = isSpeaking
    ? Math.sin(frame * 0.8) * 8
    : Math.sin(frame * 0.1) * 2;

  return (
    <div
      style={{
        width: 320,
        height: 380,
        transform: `translateY(${hoverY}px) rotate(${hoverTilt}deg) scale(${scale + speechPulse})`,
        transformOrigin: "bottom center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
        filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.6))",
      }}
    >
      <svg
        viewBox="0 0 320 380"
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Chassis Cream Gradient */}
          <linearGradient id="kipChassis" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F5F5ED" />
            <stop offset="100%" stopColor="#D8D8CC" />
          </linearGradient>

          {/* Pastel Teal Trim Gradient */}
          <linearGradient id="kipTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#68D391" />
            <stop offset="50%" stopColor="#38B2AC" />
            <stop offset="100%" stopColor="#285E61" />
          </linearGradient>

          {/* OLED Screen Gradient */}
          <linearGradient id="kipScreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B131E" />
            <stop offset="100%" stopColor="#03070C" />
          </linearGradient>

          {/* Screen Glass Reflection */}
          <linearGradient id="glassGloss" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="35%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
          </linearGradient>

          {/* Cyan Eye Glow */}
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Antenna */}
        <g style={{ transform: `rotate(${antennaWobble}deg)`, transformOrigin: "160px 100px" }}>
          <line
            x1="160"
            y1="100"
            x2="160"
            y2="35"
            stroke="#4A5568"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Brass Tip */}
          <circle cx="160" cy="30" r="11" fill="#D69E2E" stroke="#B7791F" strokeWidth="2" />
          <circle cx="157" cy="27" r="3" fill="#FFF" opacity="0.6" />
        </g>

        {/* Left Stub Arm */}
        <ellipse
          cx={emotion === "annoyed" ? "55" : "48"}
          cy={emotion === "excited" ? "210" : "240"}
          rx="18"
          ry="32"
          fill="url(#kipChassis)"
          stroke="#CBD5E0"
          strokeWidth="2"
          transform={
            emotion === "excited"
              ? "rotate(-35 48 210)"
              : "rotate(15 48 240)"
          }
        />

        {/* Right Stub Arm */}
        <ellipse
          cx={emotion === "smug" ? "265" : "272"}
          cy={emotion === "excited" ? "210" : "240"}
          rx="18"
          ry="32"
          fill="url(#kipChassis)"
          stroke="#CBD5E0"
          strokeWidth="2"
          transform={
            emotion === "excited"
              ? "rotate(35 272 210)"
              : "rotate(-15 272 240)"
          }
        />

        {/* Main Body Chassis (Pebble-shaped capsule) */}
        <rect
          x="60"
          y="90"
          width="200"
          height="220"
          rx="95"
          fill="url(#kipChassis)"
          stroke="#E2E8F0"
          strokeWidth="3"
        />

        {/* Pastel Teal Joint Trim Rings */}
        <ellipse cx="160" cy="305" rx="75" ry="14" fill="url(#kipTeal)" />

        {/* Base Hover Thruster / Foot Ring */}
        <ellipse cx="160" cy="314" rx="55" ry="10" fill="#2D3748" />
        <ellipse
          cx="160"
          cy="316"
          rx="38"
          ry="6"
          fill="#38B2AC"
          filter="url(#cyanGlow)"
          opacity="0.8"
        />

        {/* OLED Face Bezel */}
        <rect
          x="80"
          y="125"
          width="160"
          height="120"
          rx="50"
          fill="url(#kipScreen)"
          stroke="#1A202C"
          strokeWidth="4"
        />

        {/* Face Screen Subtle Edge Highlight */}
        <rect
          x="83"
          y="128"
          width="154"
          height="114"
          rx="47"
          fill="none"
          stroke="rgba(56, 178, 172, 0.25)"
          strokeWidth="1.5"
        />

        {/* Digital Cyan Eyes */}
        <g filter="url(#cyanGlow)">
          {isBlinking ? (
            // Blinking Slit
            <>
              <line x1="108" y1="185" x2="136" y2="185" stroke="#00F0FF" strokeWidth="5" strokeLinecap="round" />
              <line x1="184" y1="185" x2="212" y2="185" stroke="#00F0FF" strokeWidth="5" strokeLinecap="round" />
            </>
          ) : emotion === "surprised" ? (
            // Surprised: Wide Rings + Exclamation
            <>
              <circle cx="122" cy="180" r="18" fill="none" stroke="#00F0FF" strokeWidth="5" />
              <circle cx="198" cy="180" r="18" fill="none" stroke="#00F0FF" strokeWidth="5" />
              {/* Exclamation Badge on Screen */}
              <text x="160" y="152" textAnchor="middle" fill="#00F0FF" fontSize="22" fontWeight="bold">!</text>
            </>
          ) : emotion === "annoyed" ? (
            // Annoyed: Flat-top slanted slit eyes
            <>
              <path d="M 106 182 Q 122 188 138 182" stroke="#00F0FF" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M 182 182 Q 198 188 214 182" stroke="#00F0FF" strokeWidth="6" strokeLinecap="round" fill="none" />
            </>
          ) : emotion === "smug" ? (
            // Smug: Diagonal witty smirk eyes
            <>
              <path d="M 108 178 L 136 184" stroke="#00F0FF" strokeWidth="6" strokeLinecap="round" />
              <path d="M 184 186 L 212 176" stroke="#00F0FF" strokeWidth="6" strokeLinecap="round" />
            </>
          ) : emotion === "sad" ? (
            // Sad: Droopy curved crescent eyes
            <>
              <path d="M 108 186 Q 122 176 136 186" stroke="#00F0FF" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M 184 186 Q 198 176 212 186" stroke="#00F0FF" strokeWidth="6" strokeLinecap="round" fill="none" />
            </>
          ) : emotion === "excited" ? (
            // Excited: Star / Sparkle Pupils
            <>
              <polygon points="122,168 126,177 135,180 126,183 122,192 118,183 109,180 118,177" fill="#00F0FF" />
              <polygon points="198,168 202,177 211,180 202,183 198,192 194,183 185,180 194,177" fill="#00F0FF" />
              <path d="M 148 198 Q 160 206 172 198" stroke="#00F0FF" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : (
            // Neutral: Friendly horizontal rounded capsules
            <>
              <rect x="108" y="172" width="28" height="18" rx="9" fill="#00F0FF" />
              <rect x="184" y="172" width="28" height="18" rx="9" fill="#00F0FF" />
            </>
          )}
        </g>

        {/* OLED Glass Specular Arc Reflection */}
        <path
          d="M 88 135 Q 160 115 232 135 A 48 48 0 0 1 234 165 Q 160 145 86 165 Z"
          fill="url(#glassGloss)"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
};
