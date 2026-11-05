import React from "react";
import { Composition } from "remotion";
import { CampfireScene } from "./Series/CampfireScene";
import { StudioScene } from "./Series/StudioScene";
import { WhiteboardScene } from "./Series/WhiteboardScene";
import { WhiteboardSceneDay2 } from "./Series/WhiteboardSceneDay2";
import { DialogueLine } from "./Series/types";

// Episode 1: ELI5 AI Voice Stack (ElevenLabs Voices: Liam + George)
const episode1Eli5Lines: DialogueLine[] = [
  {
    speaker: "boy",
    text: "Claude, why do AI voice apps charge $50 every month?",
    emotion: "annoyed",
    camera: "BOY_FOCUS",
    startFrame: 0,
    durationFrames: 135,
  },
  {
    speaker: "claude",
    text: "Because people don't know Kokoro exists. It's completely free.",
    emotion: "smug",
    camera: "CLAUDE_FOCUS",
    startFrame: 135,
    durationFrames: 120,
  },
  {
    speaker: "boy",
    text: "Wait, explain it to me like I'm five. What is it?",
    emotion: "surprised",
    camera: "BOY_FOCUS",
    startFrame: 255,
    durationFrames: 88,
  },
  {
    speaker: "claude",
    text: "It's a tiny AI voice model. Takes 10 seconds to download, talks completely offline, and runs on any normal laptop.",
    emotion: "neutral",
    camera: "CLAUDE_FOCUS",
    startFrame: 343,
    durationFrames: 235,
    stepCard: {
      stepNumber: 1,
      title: "Free AI Voice (ELI5)",
      subtitle: "Zero Dollar Voiceover Setup",
      badge: "100% Free",
    },
  },
  {
    speaker: "boy",
    text: "Does it actually sound like a real person?",
    emotion: "excited",
    camera: "BOY_FOCUS",
    startFrame: 578,
    durationFrames: 76,
  },
  {
    speaker: "claude",
    text: "American, British, male, female. Even a sarcastic genius like me.",
    emotion: "excited",
    camera: "CLAUDE_FOCUS",
    startFrame: 654,
    durationFrames: 154,
  },
  {
    speaker: "boy",
    text: "So what does our voice setup cost?",
    emotion: "surprised",
    camera: "BOY_FOCUS",
    startFrame: 808,
    durationFrames: 70,
  },
  {
    speaker: "claude",
    text: "Zero dollars. Comment FREE and I'll send you the step-by-step setup guide.",
    emotion: "smug",
    camera: "CLAUDE_FOCUS",
    startFrame: 878,
    durationFrames: 136,
  },
  {
    speaker: "boy",
    text: "Wait, you know how to send DMs?",
    emotion: "excited",
    camera: "BOY_FOCUS",
    startFrame: 1014,
    durationFrames: 56,
  },
  {
    speaker: "claude",
    text: "No, you will. Now go comment.",
    emotion: "smug",
    camera: "PUNCHLINE_SNAP",
    startFrame: 1070,
    durationFrames: 90,
  },
];

// Episode 2: Midjourney vs Flux.1 Schnell (26.67s / 800 frames with ElevenLabs Liam & George)
const episode2Lines: DialogueLine[] = [
  {
    speaker: "boy",
    text: "Claude, I need Midjourney for thumbnails.",
    emotion: "annoyed",
    camera: "BOY_FOCUS",
    startFrame: 9,
    durationFrames: 75,
  },
  {
    speaker: "claude",
    text: "No you don't. You need Flux.",
    emotion: "smug",
    camera: "CLAUDE_FOCUS",
    startFrame: 84,
    durationFrames: 56,
  },
  {
    speaker: "boy",
    text: "Flux? That free thing? It looks cheap.",
    emotion: "surprised",
    camera: "BOY_FOCUS",
    startFrame: 140,
    durationFrames: 71,
  },
  {
    speaker: "claude",
    text: "Flux.1 Schnell. Open-source. Same quality. Zero dollars.",
    emotion: "neutral",
    camera: "CLAUDE_FOCUS",
    startFrame: 211,
    durationFrames: 131,
  },
  {
    speaker: "boy",
    text: "But Midjourney has better styles.",
    emotion: "annoyed",
    camera: "BOY_FOCUS",
    startFrame: 342,
    durationFrames: 69,
  },
  {
    speaker: "claude",
    text: "Flux does photoreal, anime, 3D, text in image. In your browser.",
    emotion: "excited",
    camera: "CLAUDE_FOCUS",
    startFrame: 411,
    durationFrames: 137,
  },
  {
    speaker: "boy",
    text: "So I just cancelled Midjourney?",
    emotion: "excited",
    camera: "BOY_FOCUS",
    startFrame: 548,
    durationFrames: 63,
  },
  {
    speaker: "claude",
    text: "You just saved $120 a year. Comment FREE for setup.",
    emotion: "smug",
    camera: "PUNCHLINE_SNAP",
    startFrame: 611,
    durationFrames: 189,
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Setting A: Canonical Campfire Scene with Phoneme Lip-Sync */}
      <Composition
        id="CampfireEpisode1"
        component={CampfireScene}
        durationInFrames={1160}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          lines: episode1Eli5Lines,
          audioSrc: "episode1_master.wav",
          seriesTitle: "HARSHITH & CLAUDE • EPISODE 1",
        }}
      />

      {/* Setting B: New Developer Studio Scene with 7 Clean Plates & Phoneme Lip-Sync */}
      <Composition
        id="StudioEpisode1"
        component={StudioScene}
        durationInFrames={1160}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          lines: episode1Eli5Lines,
          audioSrc: "episode1_master.wav",
          seriesTitle: "HARSHITH & CLAUDE • EPISODE 1",
        }}
      />

      {/* Setting C: 100 Days of Free AI Whiteboard Explainer Day 01 */}
      <Composition
        id="WhiteboardEpisode1"
        component={WhiteboardScene}
        durationInFrames={1160}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          lines: episode1Eli5Lines,
          audioSrc: "episode1_master.wav",
          seriesTitle: "100 DAYS OF FREE AI • DAY 01 / 100",
        }}
      />

      {/* Setting D: 100 Days of Free AI Whiteboard Explainer Day 02 */}
      <Composition
        id="WhiteboardEpisode2"
        component={WhiteboardSceneDay2}
        durationInFrames={800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          lines: episode2Lines,
          audioSrc: "episode2_master.wav",
          seriesTitle: "100 DAYS OF FREE AI • DAY 02 / 100",
        }}
      />
    </>
  );
};
