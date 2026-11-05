import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background3D } from "./Background3D";
import { BoyRig } from "./BoyRig";
import { ClaudeRig } from "./ClaudeRig";
import { CollageBroll } from "./CollageBroll";
import { DialogueLine, Emotion, LocationType } from "./types";

interface EpisodeSceneProps {
  location?: LocationType;
  lines: DialogueLine[];
  audioSrc?: string;
}

export const EpisodeScene: React.FC<EpisodeSceneProps> = ({
  location = "MidnightLoft",
  lines,
  audioSrc = "episode1_master.wav",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Find active line
  const activeLine =
    lines.find(
      (l) => frame >= l.startFrame && frame < l.startFrame + l.durationFrames
    ) || lines[lines.length - 1];

  const currentSpeaker = activeLine ? activeLine.speaker : null;
  const isBoySpeaking = currentSpeaker === "boy" || currentSpeaker === "leo";
  const isClaudeSpeaking = currentSpeaker === "claude" || currentSpeaker === "kip";

  const currentCamera = activeLine ? activeLine.camera : "TWO_SHOT";

  // Active emotions
  const boyEmotion: Emotion = isBoySpeaking
    ? activeLine.emotion
    : activeLine?.camera === "PUNCHLINE_SNAP"
    ? "surprised"
    : "neutral";

  const claudeEmotion: Emotion = isClaudeSpeaking
    ? activeLine.emotion
    : activeLine?.camera === "PUNCHLINE_SNAP"
    ? "smug"
    : "neutral";

  // Onetake: Slow cinematic camera push (1.0 -> 1.05 continuous forward move)
  const baseSlowPush = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Camera Framing & Operator Choreography
  let targetCameraX = 0;
  let targetCameraZoom = baseSlowPush;

  if (currentCamera === "BOY_FOCUS" || currentCamera === "LEO_FOCUS") {
    targetCameraX = 85; // Pan toward Boy (left side of stage)
    targetCameraZoom = baseSlowPush * 1.14;
  } else if (currentCamera === "CLAUDE_FOCUS" || currentCamera === "KIP_FOCUS") {
    targetCameraX = -95; // Pan toward Claude (right side of stage)
    targetCameraZoom = baseSlowPush * 1.16;
  } else if (currentCamera === "PUNCHLINE_SNAP") {
    targetCameraZoom = baseSlowPush * 1.24; // Impact zoom on punchline
  }

  // Smooth camera chaser spring (onetake camera physics)
  const cameraSpring = spring({
    frame: frame % 90,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  const finalCameraX = targetCameraX;
  const finalCameraZoom = targetCameraZoom;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0C0F14",
        overflow: "hidden",
      }}
    >
      {/* Synchronized Master Audio Track */}
      {audioSrc && <Audio src={staticFile(audioSrc)} />}

      {/* Cinematic Stage with Continuous Camera Transform */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${finalCameraZoom}) translateX(${finalCameraX}px)`,
          transformOrigin: "center center",
          transition: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {/* 3D Parallax Environment */}
        <Background3D location={location} cameraX={finalCameraX} />

        {/* Characters Layer */}
        {/* Left Character: The Boy */}
        <BoyRig
          emotion={boyEmotion}
          isSpeaking={isBoySpeaking}
          scale={1.38}
          x={60}
          y={1180}
        />

        {/* Right Character: Claude (Official Anthropic Mascot) */}
        <ClaudeRig
          emotion={claudeEmotion}
          isSpeaking={isClaudeSpeaking}
          scale={1.42}
          x={640}
          y={1220}
        />

        {/* Gbro Halftone Paper-Collage B-roll Card (When active in step explanation) */}
        {activeLine?.stepCard && (
          <CollageBroll
            stepNumber={activeLine.stepCard.stepNumber}
            title={activeLine.stepCard.title}
            subtitle={activeLine.stepCard.subtitle}
            badge={activeLine.stepCard.badge}
          />
        )}
      </div>

      {/* Top Brand Tag Header */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 24px",
          backgroundColor: "rgba(18, 22, 28, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 30,
          zIndex: 60,
        }}
      >
        {/* Claude Terracotta Dot */}
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#D97757",
            boxShadow: "0 0 10px #D97757",
          }}
        />
        <span
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "0.06em",
            color: "#FFFFFF",
            textTransform: "uppercase",
          }}
        >
          Zero Dollar Dev
        </span>
      </div>

      {/* Reference-Inspired Captions Area (Centered Lower-Third Pill) */}
      {activeLine && (
        <div
          style={{
            position: "absolute",
            bottom: 310,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 60px",
            zIndex: 70,
          }}
        >
          {/* Speaker Badge */}
          <div
            style={{
              padding: "6px 18px",
              borderRadius: "14px 14px 0 0",
              backgroundColor: isClaudeSpeaking ? "#D97757" : "#1E352B",
              color: "#FFFFFF",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              border: "1.5px solid rgba(255,255,255,0.15)",
              borderBottom: "none",
            }}
          >
            {isClaudeSpeaking ? "Claude" : "The Boy"}
          </div>

          {/* Subtitle Pill with Word Highlights */}
          <div
            style={{
              backgroundColor: "rgba(12, 16, 22, 0.92)",
              backdropFilter: "blur(16px)",
              border: "2px solid rgba(255, 255, 255, 0.16)",
              borderRadius: 22,
              padding: "24px 38px",
              maxWidth: 960,
              textAlign: "center",
              boxShadow: "0 16px 36px rgba(0,0,0,0.6)",
            }}
          >
            <span
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.32,
                letterSpacing: "-0.01em",
                color: "#FFFFFF",
              }}
            >
              {activeLine.text.split(" ").map((word, idx) => {
                const isHighlight =
                  /fifty|50|kokoro|kakoro|free|apache|onnx|zero|gpu|cpu/i.test(
                    word.replace(/[^a-zA-Z0-9]/g, "")
                  );
                return (
                  <span
                    key={idx}
                    style={{
                      color: isHighlight
                        ? isClaudeSpeaking
                          ? "#F5B700"
                          : "#00E5C9"
                        : "#FFFFFF",
                      marginRight: 8,
                      display: "inline-block",
                      textShadow: isHighlight
                        ? "0 0 16px rgba(245, 183, 0, 0.5)"
                        : "none",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </span>
          </div>
        </div>
      )}

      {/* Mandatory AI Disclosure Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: "rgba(255, 255, 255, 0.4)",
          zIndex: 80,
        }}
      >
        [AI Note: Characters & voices generated locally with open models]
      </div>
    </AbsoluteFill>
  );
};
