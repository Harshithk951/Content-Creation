import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Emotion } from "./types";

interface LeoRigProps {
  emotion: Emotion;
  isSpeaking: boolean;
  scale?: number;
}

export const LeoRig: React.FC<LeoRigProps> = ({
  emotion,
  isSpeaking,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle natural breathing / idle posture
  const breathY = Math.sin((frame / fps) * 2) * 4;
  const headBob = isSpeaking ? Math.sin((frame / fps) * 16) * 5 : 0;
  const mouthOpen = isSpeaking ? Math.abs(Math.sin((frame / fps) * 20)) * 14 : 0;

  // Eyebrow and eye positioning based on emotion
  const browOffset =
    emotion === "surprised" ? -10 :
    emotion === "annoyed" ? 4 :
    emotion === "smug" ? -4 :
    emotion === "sad" ? 6 :
    emotion === "excited" ? -6 : 0;

  return (
    <div
      style={{
        width: 480,
        height: 600,
        transform: `translateY(${breathY + headBob}px) scale(${scale})`,
        transformOrigin: "bottom center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
        filter: "drop-shadow(0 25px 35px rgba(0, 0, 0, 0.7))",
      }}
    >
      <svg
        viewBox="0 0 480 600"
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Deep Pine Green Hoodie Gradient */}
          <linearGradient id="hoodieGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D6A4F" />
            <stop offset="50%" stopColor="#1B4332" />
            <stop offset="100%" stopColor="#081C15" />
          </linearGradient>

          {/* Skin Tone Gradient (Soft Warm Stylized 3D) */}
          <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F9D7B7" />
            <stop offset="100%" stopColor="#E0B690" />
          </linearGradient>

          {/* Dark Textured Hair Gradient */}
          <linearGradient id="hairDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D2A32" />
            <stop offset="60%" stopColor="#1F1D24" />
            <stop offset="100%" stopColor="#121116" />
          </linearGradient>

          {/* Lanyard Teal Circuit Accent */}
          <linearGradient id="circuitTeal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38B2AC" />
            <stop offset="100%" stopColor="#4FD1C5" />
          </linearGradient>

          {/* Soft Cheek Blush */}
          <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(235, 115, 115, 0.35)" />
            <stop offset="100%" stopColor="rgba(235, 115, 115, 0.0)" />
          </radialGradient>
        </defs>

        {/* --- BODY & HOODIE --- */}
        <g id="torso">
          {/* Broad Shoulders / Deep Pine-Green Hoodie */}
          <path
            d="M 120 400 Q 240 370 360 400 L 440 600 L 40 600 Z"
            fill="url(#hoodieGreen)"
          />

          {/* Hoodie Neck Opening & Collar */}
          <path
            d="M 190 380 Q 240 430 290 380 Q 240 405 190 380 Z"
            fill="#121116"
          />

          {/* Hoodie Drawstrings */}
          <path d="M 215 395 L 210 490" stroke="#081C15" strokeWidth="5" strokeLinecap="round" />
          <path d="M 265 395 L 270 480" stroke="#081C15" strokeWidth="5" strokeLinecap="round" />
          <circle cx="210" cy="493" r="5" fill="#4FD1C5" />
          <circle cx="270" cy="483" r="5" fill="#4FD1C5" />

          {/* Signature Silhouette Item: Matte-Black Badge Lanyard with Teal Circuit Motif */}
          <g id="signature-lanyard" transform="translate(130, 430)">
            {/* Dark Webbing Ribbon */}
            <path
              d="M 0 0 Q 8 60 12 120"
              stroke="#1A202C"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            {/* Teal Circuit Trace Stripe */}
            <path
              d="M 0 0 Q 8 60 12 120"
              stroke="url(#circuitTeal)"
              strokeWidth="3"
              strokeDasharray="8 4"
              fill="none"
            />
            {/* Metal Swivel Hook & Pocket Badge */}
            <rect x="2" y="118" width="18" height="12" rx="3" fill="#718096" />
            <rect x="-10" y="130" width="42" height="32" rx="4" fill="#0D1117" stroke="#2D3748" strokeWidth="2" />
            <line x1="-2" y1="140" x2="22" y2="140" stroke="#38B2AC" strokeWidth="2.5" />
            <line x1="-2" y1="146" x2="14" y2="146" stroke="#4A5568" strokeWidth="2" />
          </g>
        </g>

        {/* --- NECK --- */}
        <rect x="215" y="330" width="50" height="60" rx="10" fill="url(#skinTone)" />

        {/* --- HEAD --- */}
        <g id="head" transform={`translate(0, ${emotion === "annoyed" ? 2 : 0})`}>
          {/* Ears */}
          <ellipse cx="148" cy="275" rx="14" ry="20" fill="url(#skinTone)" />
          <ellipse cx="332" cy="275" rx="14" ry="20" fill="url(#skinTone)" />

          {/* Face Base */}
          <path
            d="M 160 220 C 160 160 320 160 320 220 C 320 310 270 350 240 350 C 210 350 160 310 160 220 Z"
            fill="url(#skinTone)"
          />

          {/* Cheeks blush */}
          <ellipse cx="185" cy="285" rx="20" ry="12" fill="url(#cheekBlush)" />
          <ellipse cx="295" cy="285" rx="20" ry="12" fill="url(#cheekBlush)" />

          {/* Coder Bags Under Eyes (Relatable subtle tired lines) */}
          <path d="M 182 270 Q 200 278 218 270" stroke="rgba(110, 80, 60, 0.25)" strokeWidth="3" fill="none" />
          <path d="M 262 270 Q 280 278 298 270" stroke="rgba(110, 80, 60, 0.25)" strokeWidth="3" fill="none" />

          {/* Eyes */}
          {emotion === "annoyed" ? (
            // Half-lidded dry skepticism
            <>
              <ellipse cx="200" cy="256" rx="15" ry="8" fill="#FFF" />
              <circle cx="200" cy="258" r="6" fill="#3D2B1F" />
              <path d="M 183 252 L 217 254" stroke="#D09F75" strokeWidth="6" />

              <ellipse cx="280" cy="256" rx="15" ry="8" fill="#FFF" />
              <circle cx="280" cy="258" r="6" fill="#3D2B1F" />
              <path d="M 263 254 L 297 252" stroke="#D09F75" strokeWidth="6" />
            </>
          ) : emotion === "surprised" ? (
            // Wide open eyes
            <>
              <circle cx="200" cy="252" r="17" fill="#FFF" />
              <circle cx="200" cy="252" r="8" fill="#3D2B1F" />
              <circle cx="197" cy="249" r="3" fill="#FFF" />

              <circle cx="280" cy="252" r="17" fill="#FFF" />
              <circle cx="280" cy="252" r="8" fill="#3D2B1F" />
              <circle cx="277" cy="249" r="3" fill="#FFF" />
            </>
          ) : emotion === "excited" ? (
            // Sparkle bright eyes
            <>
              <ellipse cx="200" cy="254" rx="16" ry="14" fill="#FFF" />
              <circle cx="200" cy="253" r="9" fill="#3D2B1F" />
              <circle cx="196" cy="249" r="4" fill="#FFF" />
              <circle cx="204" cy="257" r="2" fill="#FFF" />

              <ellipse cx="280" cy="254" rx="16" ry="14" fill="#FFF" />
              <circle cx="280" cy="253" r="9" fill="#3D2B1F" />
              <circle cx="276" cy="249" r="4" fill="#FFF" />
              <circle cx="284" cy="257" r="2" fill="#FFF" />
            </>
          ) : (
            // Neutral / Smug / Sad standard friendly eyes
            <>
              <ellipse cx="200" cy="256" rx="14" ry="12" fill="#FFF" />
              <circle cx="200" cy="256" r="7" fill="#3D2B1F" />
              <circle cx="198" cy="253" r="2.5" fill="#FFF" />

              <ellipse cx="280" cy="256" rx="14" ry="12" fill="#FFF" />
              <circle cx="280" cy="256" r="7" fill="#3D2B1F" />
              <circle cx="278" cy="253" r="2.5" fill="#FFF" />
            </>
          )}

          {/* Eyebrows */}
          <g id="eyebrows" transform={`translate(0, ${browOffset})`}>
            {emotion === "smug" ? (
              // One raised eyebrow
              <>
                <path d="M 180 236 Q 200 234 218 238" stroke="#1F1D24" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                <path d="M 262 226 Q 280 220 300 228" stroke="#1F1D24" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              </>
            ) : emotion === "sad" ? (
              // Drooping sad brows
              <>
                <path d="M 182 232 Q 200 238 218 244" stroke="#1F1D24" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M 262 244 Q 280 238 298 232" stroke="#1F1D24" strokeWidth="5" strokeLinecap="round" fill="none" />
              </>
            ) : (
              // Expressive standard brows
              <>
                <path d="M 180 236 Q 200 230 218 236" stroke="#1F1D24" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                <path d="M 262 236 Q 280 230 300 236" stroke="#1F1D24" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              </>
            )}
          </g>

          {/* Nose */}
          <path d="M 240 262 L 235 285 L 246 285" stroke="#C8976C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Mouth (reacts to speech + emotion) */}
          <g id="mouth">
            {isSpeaking ? (
              // Animated open speech mouth
              <ellipse cx="240" cy="312" rx="14" ry={7 + mouthOpen} fill="#63171B" stroke="#A83232" strokeWidth="2" />
            ) : emotion === "surprised" ? (
              <circle cx="240" cy="315" r="14" fill="#63171B" stroke="#4A1515" strokeWidth="2" />
            ) : emotion === "smug" ? (
              <path d="M 230 312 Q 248 316 262 305" stroke="#68382A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            ) : emotion === "sad" ? (
              <path d="M 224 316 Q 240 306 256 316" stroke="#68382A" strokeWidth="4" strokeLinecap="round" fill="none" />
            ) : emotion === "excited" ? (
              <path d="M 220 306 Q 240 332 260 306 Z" fill="#8B263E" stroke="#5A1525" strokeWidth="2" />
            ) : (
              <path d="M 226 312 Q 240 320 254 312" stroke="#68382A" strokeWidth="4" strokeLinecap="round" fill="none" />
            )}
          </g>

          {/* Messy Textured Dark Hair & Signature Cowlick */}
          <g id="hair">
            <path
              d="M 150 220 
                 C 140 160 170 120 230 110 
                 C 260 105 310 115 330 160 
                 C 345 190 340 230 332 245
                 C 325 210 310 180 295 185
                 C 275 160 240 165 220 180
                 C 200 170 170 185 160 215 Z"
              fill="url(#hairDark)"
            />
            {/* Signature Spiky Cowlick on top left */}
            <path
              d="M 215 118 Q 200 80 230 92 Q 240 108 235 120 Z"
              fill="url(#hairDark)"
            />
            <path
              d="M 180 135 Q 165 105 190 120 Z"
              fill="url(#hairDark)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
