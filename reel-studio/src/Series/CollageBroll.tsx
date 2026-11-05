import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface CollageBrollProps {
  stepNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  accentColor?: string;
}

/**
 * CollageBroll — Editorial halftone paper-collage step cards
 * inspired by gbro-collage-broll & onetake motion carry.
 * Features textured torn-paper edges, halftone dot grid,
 * bold editorial grotesque typography, and stop-motion assembly.
 */
export const CollageBroll: React.FC<CollageBrollProps> = ({
  stepNumber,
  title,
  subtitle,
  badge,
  accentColor = '#D97757', // Claude Terracotta
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stop-motion style discrete stepping (animate on twos / stepped curve)
  const steppedFrame = Math.floor(frame / 2) * 2;

  // Spring entrance from bottom with slight paper tilt
  const enterSpring = spring({
    frame: steppedFrame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.8 },
  });

  const cardY = interpolate(enterSpring, [0, 1], [300, 0]);
  const cardRotate = interpolate(enterSpring, [0, 1], [8, -1.5]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 280,
        left: '50%',
        transform: `translateX(-50%) translateY(${cardY}px) scale(${cardScale}) rotate(${cardRotate}deg)`,
        width: 820,
        zIndex: 50,
      }}
    >
      {/* Paper Drop Shadow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          filter: 'blur(20px)',
          transform: 'translateY(16px)',
          borderRadius: 16,
        }}
      />

      {/* Main Halftone Collage Paper Card */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#F7F3EB', // Warm vintage paper tone
          backgroundImage: `
            radial-gradient(#C4BEB2 1.5px, transparent 1.5px),
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px, 32px 32px',
          border: '4px solid #1A1A1A',
          borderRadius: 14,
          padding: '36px 42px',
          boxShadow: '0 12px 0 #1A1A1A',
          color: '#1A1A1A',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Top Header Tag */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div
            style={{
              backgroundColor: accentColor,
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 18px',
              borderRadius: 6,
              border: '2px solid #1A1A1A',
              boxShadow: '2px 2px 0 #1A1A1A',
            }}
          >
            STEP 0{stepNumber}
          </div>

          <div
            style={{
              backgroundColor: '#1A1A1A',
              color: '#F5B700',
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: '0.06em',
              padding: '6px 14px',
              borderRadius: 6,
            }}
          >
            {badge}
          </div>
        </div>

        {/* Main Title (Editorial Punchy Headline) */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 14,
            color: '#111111',
          }}
        >
          {title}
        </div>

        {/* Subtitle / Key Stat */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            lineHeight: 1.35,
            color: '#444444',
            borderTop: '2px dashed #C4BEB2',
            paddingTop: 16,
          }}
        >
          {subtitle}
        </div>

        {/* Tactile Stamp Accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            right: 32,
            border: `3px solid ${accentColor}`,
            color: accentColor,
            fontWeight: 900,
            fontSize: 16,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            transform: 'rotate(-8deg)',
            opacity: 0.85,
          }}
        >
          VERIFIED FREE
        </div>
      </div>
    </div>
  );
};
