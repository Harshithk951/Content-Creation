import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Emotion } from './types';

interface ClaudeRigProps {
  emotion: Emotion;
  isSpeaking: boolean;
  scale?: number;
  x?: number;
  y?: number;
  tilt?: number;
}

/**
 * ClaudeRig — The official Anthropic Claude AI character,
 * rendered with Impasto Oil Painting aesthetic (palette knife planes,
 * raking light ridges, terracotta clay hues, tactile physical texture)
 * and responsive expressive states.
 */
export const ClaudeRig: React.FC<ClaudeRigProps> = ({
  emotion,
  isSpeaking,
  scale = 1,
  x = 0,
  y = 0,
  tilt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Natural idle hover & breathing (fluid continuous physics)
  const floatY = Math.sin(frame * 0.08) * 8;
  const breatheScale = 1 + Math.sin(frame * 0.05) * 0.02;

  // Speech mouth animation
  const speechOpen = isSpeaking ? Math.abs(Math.sin(frame * 0.5)) * 14 : 0;

  // Eye blinking (every 80 frames)
  const isBlinking = frame % 85 >= 80;

  // Emotion-driven tilt and eye shape
  const emotionConfig = {
    neutral: { eyeH: 26, eyeW: 24, browY: 0, mouthCurve: 0, bodyTilt: 0 },
    surprised: { eyeH: 34, eyeW: 28, browY: -8, mouthCurve: -4, bodyTilt: -3 },
    annoyed: { eyeH: 20, eyeW: 24, browY: 6, mouthCurve: 6, bodyTilt: 4 },
    smug: { eyeH: 22, eyeW: 24, browY: -2, mouthCurve: -6, bodyTilt: -5 },
    sad: { eyeH: 22, eyeW: 22, browY: 4, mouthCurve: 8, bodyTilt: 2 },
    excited: { eyeH: 32, eyeW: 28, browY: -6, mouthCurve: -8, bodyTilt: -4 },
  }[emotion];

  const currentTilt = tilt + emotionConfig.bodyTilt + Math.sin(frame * 0.06) * 1.5;

  return (
    <div
      style={{
        transform: `translate(${x}px, ${y + floatY}px) scale(${scale * breatheScale}) rotate(${currentTilt}deg)`,
        transformOrigin: 'bottom center',
        width: 380,
        height: 480,
        position: 'relative',
        filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.55))',
      }}
    >
      <svg viewBox="0 0 380 480" width="380" height="480">
        <defs>
          {/* Impasto Oil Paint Filter: simulates thick paint ridges & raking directional light */}
          <filter id="claudeImpastoOil" x="-10%" y="-10%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="textured" />
            <feDiffuseLighting in="textured" lightingColor="#ffffff" surfaceScale="2" diffuseConstant="1.2" result="light">
              <feDistantLight azimuth="225" elevation="45" />
            </feDiffuseLighting>
            <feComposite in="light" in2="textured" operator="in" result="litPaint" />
            <feBlend mode="multiply" in="SourceGraphic" in2="litPaint" />
          </filter>

          {/* Claude Terracotta Body Gradient */}
          <linearGradient id="claudeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E58B6D" />
            <stop offset="45%" stopColor="#D97757" />
            <stop offset="100%" stopColor="#B85536" />
          </linearGradient>

          {/* Palette Knife Stroke Gradient (Highlight bevel) */}
          <linearGradient id="knifeBevel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FAD4C0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D97757" stopOpacity="0.1" />
          </linearGradient>

          {/* Soft Cheek Blush */}
          <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EA6B48" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D97757" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient shadow underneath */}
        <ellipse cx="190" cy="460" rx="110" ry="16" fill="rgba(0,0,0,0.3)" filter="blur(8px)" />

        {/* Main Clay Body (The iconic rounded Claude silhouette) */}
        <path
          d="M 190,70 
             C 285,70 330,130 330,230 
             C 330,340 295,430 190,430 
             C 85,430 50,340 50,230 
             C 50,130 95,70 190,70 Z"
          fill="url(#claudeBodyGrad)"
          filter="url(#claudeImpastoOil)"
        />

        {/* Visible Palette Knife Planes (Thick Oil Paint Texture) */}
        {/* Knife Plane 1: Top Forehead Light Catch */}
        <path
          d="M 120,95 Q 190,80 260,105 Q 230,130 140,120 Z"
          fill="url(#knifeBevel)"
          opacity="0.75"
        />
        {/* Knife Plane 2: Right Shoulder Chiseled Ridge */}
        <path
          d="M 285,160 Q 320,230 305,320 Q 285,280 270,190 Z"
          fill="#C65A3B"
          opacity="0.65"
        />
        {/* Knife Plane 3: Left Highlight Rim */}
        <path
          d="M 65,180 Q 55,250 80,330 Q 95,260 85,190 Z"
          fill="#F5B29B"
          opacity="0.55"
        />

        {/* Cheeks */}
        <ellipse cx="120" cy="270" rx="28" ry="16" fill="url(#cheekBlush)" />
        <ellipse cx="260" cy="270" rx="28" ry="16" fill="url(#cheekBlush)" />

        {/* Eyes (Anthropic Claude's soulful friendly eyes) */}
        <g id="claudeEyes">
          {/* Left Eye */}
          <ellipse
            cx="145"
            cy={220 + emotionConfig.browY}
            rx={emotionConfig.eyeW / 2}
            ry={isBlinking ? 2 : emotionConfig.eyeH / 2}
            fill="#1E1614"
          />
          {!isBlinking && (
            <circle cx="151" cy={214 + emotionConfig.browY} r="4.5" fill="#FFFFFF" />
          )}

          {/* Right Eye */}
          <ellipse
            cx="235"
            cy={220 + emotionConfig.browY}
            rx={emotionConfig.eyeW / 2}
            ry={isBlinking ? 2 : emotionConfig.eyeH / 2}
            fill="#1E1614"
          />
          {!isBlinking && (
            <circle cx="241" cy={214 + emotionConfig.browY} r="4.5" fill="#FFFFFF" />
          )}
        </g>

        {/* Cute Mouth (Speech-animated + expressive) */}
        <path
          d={`M 172,275 Q 190,${275 + emotionConfig.mouthCurve + speechOpen} 208,275`}
          stroke="#1E1614"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill={speechOpen > 4 ? '#541D12' : 'none'}
        />

        {/* Sparkle of Intelligence (Claude's 4-point star icon hovering above when excited or smug) */}
        {(emotion === 'excited' || emotion === 'smug') && (
          <g
            transform={`translate(190, 42) scale(${1 + Math.sin(frame * 0.15) * 0.15})`}
            style={{ transformOrigin: 'center' }}
          >
            <path
              d="M 0,-24 Q 0,0 24,0 Q 0,0 0,24 Q 0,0 -24,0 Q 0,0 0,-24 Z"
              fill="#F5B700"
              filter="drop-shadow(0 0 10px #FFD700)"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
