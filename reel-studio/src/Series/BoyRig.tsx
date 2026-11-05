import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Emotion } from './types';

interface BoyRigProps {
  emotion: Emotion;
  isSpeaking: boolean;
  scale?: number;
  x?: number;
  y?: number;
  tilt?: number;
}

/**
 * BoyRig — The young developer/creator character,
 * styled with Impasto Oil Painting aesthetic (layered palette-knife planes,
 * canvas texture, raking light highlights, messy dark hair, signature hoodie).
 */
export const BoyRig: React.FC<BoyRigProps> = ({
  emotion,
  isSpeaking,
  scale = 1,
  x = 0,
  y = 0,
  tilt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Natural idle breathing physics
  const breatheY = Math.sin(frame * 0.07) * 4;
  const breatheScale = 1 + Math.sin(frame * 0.05) * 0.015;

  // Mouth animation during speech
  const speechOpen = isSpeaking ? Math.abs(Math.sin(frame * 0.55)) * 16 : 0;

  // Natural blinking (every 95 frames)
  const isBlinking = frame % 95 >= 90;

  // Emotion-driven facial parameters
  const emotionConfig = {
    neutral: { browTilt: 0, browY: 0, mouthCurve: 0, eyeOpen: 1, headTilt: 0 },
    surprised: { browTilt: -8, browY: -10, mouthCurve: -6, eyeOpen: 1.3, headTilt: -2 },
    annoyed: { browTilt: 12, browY: 4, mouthCurve: 8, eyeOpen: 0.85, headTilt: 3 },
    smug: { browTilt: -4, browY: -2, mouthCurve: -8, eyeOpen: 0.9, headTilt: -4 },
    sad: { browTilt: -10, browY: 6, mouthCurve: 10, eyeOpen: 0.9, headTilt: 2 },
    excited: { browTilt: -6, browY: -8, mouthCurve: -10, eyeOpen: 1.25, headTilt: -3 },
  }[emotion];

  const currentTilt = tilt + emotionConfig.headTilt + Math.sin(frame * 0.05) * 1.2;

  return (
    <div
      style={{
        transform: `translate(${x}px, ${y + breatheY}px) scale(${scale * breatheScale}) rotate(${currentTilt}deg)`,
        transformOrigin: 'bottom center',
        width: 440,
        height: 620,
        position: 'relative',
        filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.6))',
      }}
    >
      <svg viewBox="0 0 440 620" width="440" height="620">
        <defs>
          {/* Impasto Oil Texture Filter */}
          <filter id="boyImpastoOil" x="-10%" y="-10%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="textured" />
            <feDiffuseLighting in="textured" lightingColor="#ffffff" surfaceScale="2" diffuseConstant="1.1" result="light">
              <feDistantLight azimuth="215" elevation="50" />
            </feDiffuseLighting>
            <feComposite in="light" in2="textured" operator="in" result="lit" />
            <feBlend mode="multiply" in="SourceGraphic" in2="lit" />
          </filter>

          {/* Skin Palette-knife tones */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9D4BC" />
            <stop offset="60%" stopColor="#EABCA0" />
            <stop offset="100%" stopColor="#D49E82" />
          </linearGradient>

          {/* Hoodie Pine Green Palette */}
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E4A3E" />
            <stop offset="50%" stopColor="#1E352B" />
            <stop offset="100%" stopColor="#13231C" />
          </linearGradient>

          {/* Knife highlight for hoodie plane */}
          <linearGradient id="hoodieHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#436B5A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1E352B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient base shadow */}
        <ellipse cx="220" cy="610" rx="140" ry="20" fill="rgba(0,0,0,0.4)" filter="blur(10px)" />

        {/* --- BODY & HOODIE --- */}
        {/* Shoulders / Torso */}
        <path
          d="M 60,450 C 70,370 140,340 220,340 C 300,340 370,370 380,450 L 410,620 L 30,620 Z"
          fill="url(#hoodieGrad)"
          filter="url(#boyImpastoOil)"
        />

        {/* Hoodie Palette-Knife Planes */}
        <path d="M 80,400 L 170,360 L 190,440 L 95,470 Z" fill="url(#hoodieHighlight)" opacity="0.6" />
        <path d="M 250,360 L 340,400 L 325,470 L 235,440 Z" fill="#13231C" opacity="0.5" />

        {/* Hoodie Collar / Drawstrings */}
        <path
          d="M 160,340 Q 220,375 280,340 Q 250,420 220,430 Q 190,420 160,340 Z"
          fill="#1A2D24"
        />

        {/* Signature Silhouette: Matte-black lanyard with circuit teal motif */}
        <g id="lanyard">
          <path d="M 180,390 L 165,540 L 182,540 L 195,395 Z" fill="#1A1A1E" />
          {/* Teal Circuit Traces */}
          <path d="M 170,430 L 178,445 L 174,480" stroke="#00E5C9" strokeWidth="2.5" fill="none" opacity="0.85" />
          {/* Badge holder */}
          <rect x="150" y="535" width="45" height="58" rx="4" fill="#24242A" stroke="#33333E" strokeWidth="2" />
          <rect x="156" y="542" width="33" height="24" rx="2" fill="#00E5C9" opacity="0.9" />
          <circle cx="172.5" cy="554" r="5" fill="#1A1A1E" />
        </g>

        {/* --- NECK --- */}
        <path d="M 195,320 L 195,355 Q 220,365 245,355 L 245,320 Z" fill="#D49E82" />

        {/* --- HEAD & FACE --- */}
        <g id="boyHead">
          {/* Ears */}
          <ellipse cx="140" cy="245" rx="14" ry="20" fill="#EABCA0" />
          <ellipse cx="300" cy="245" rx="14" ry="20" fill="#EABCA0" />

          {/* Jaw / Face Shape (Impasto oil plane) */}
          <path
            d="M 150,180 C 145,260 170,325 220,325 C 270,325 295,260 290,180 C 290,120 150,120 150,180 Z"
            fill="url(#skinGrad)"
            filter="url(#boyImpastoOil)"
          />

          {/* Knife Light Catch on Cheek */}
          <path d="M 160,220 Q 190,205 205,240 Q 185,260 165,245 Z" fill="#FDE1CF" opacity="0.45" />

          {/* Eyebrows */}
          <g id="eyebrows" transform={`translate(0, ${emotionConfig.browY})`}>
            {/* Left Brow */}
            <path
              d="M 168,198 Q 190,190 205,196"
              stroke="#2B211C"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              transform={`rotate(${emotionConfig.browTilt}, 185, 195)`}
            />
            {/* Right Brow */}
            <path
              d="M 235,196 Q 250,190 272,198"
              stroke="#2B211C"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              transform={`rotate(${-emotionConfig.browTilt}, 255, 195)`}
            />
          </g>

          {/* Eyes */}
          <g id="eyes">
            {/* Left Eye */}
            <ellipse
              cx="186"
              cy="218"
              rx="11"
              ry={isBlinking ? 1.5 : 12 * emotionConfig.eyeOpen}
              fill="#221A16"
            />
            {!isBlinking && <circle cx="189" cy="214" r="3" fill="#FFFFFF" />}

            {/* Right Eye */}
            <ellipse
              cx="254"
              cy="218"
              rx="11"
              ry={isBlinking ? 1.5 : 12 * emotionConfig.eyeOpen}
              fill="#221A16"
            />
            {!isBlinking && <circle cx="257" cy="214" r="3" fill="#FFFFFF" />}
          </g>

          {/* Nose */}
          <path d="M 218,220 L 214,242 Q 220,246 226,242" stroke="#B87D60" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Mouth */}
          <path
            d={`M 202,272 Q 220,${272 + emotionConfig.mouthCurve + speechOpen} 238,272`}
            stroke="#2B211C"
            strokeWidth="4"
            strokeLinecap="round"
            fill={speechOpen > 4 ? '#7A2E20' : 'none'}
          />
        </g>

        {/* --- MESSY DARK HAIR WITH COWLICK (Palette Knife Strokes) --- */}
        <g id="boyHair" filter="url(#boyImpastoOil)">
          {/* Main Hair Volume */}
          <path
            d="M 140,180 C 130,110 170,80 220,80 C 270,80 310,110 300,180 C 290,150 270,140 220,140 C 170,140 150,150 140,180 Z"
            fill="#1F1A17"
          />
          {/* Expressive Messy Locks & Cowlick */}
          <path d="M 210,85 Q 225,50 245,65 Q 230,80 220,85 Z" fill="#2B2420" />
          <path d="M 160,110 Q 140,80 165,95 Z" fill="#1F1A17" />
          <path d="M 260,105 Q 290,75 280,100 Z" fill="#2B2420" />
          {/* Hair highlights (Knife edge) */}
          <path d="M 175,100 Q 220,85 265,100" stroke="#3E342F" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
