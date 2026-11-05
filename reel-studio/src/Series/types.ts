export type Emotion =
  | "neutral"
  | "surprised"
  | "annoyed"
  | "smug"
  | "sad"
  | "excited";

export type CameraShot =
  | "TWO_SHOT"
  | "BOY_FOCUS"
  | "CLAUDE_FOCUS"
  | "LEO_FOCUS"
  | "KIP_FOCUS"
  | "PUNCHLINE_SNAP";

export type LocationType =
  | "MidnightLoft"
  | "ServerLounge"
  | "HostelRoom";

export interface StepCardData {
  stepNumber: number;
  title: string;
  subtitle: string;
  badge: string;
}

export interface DialogueLine {
  speaker: "boy" | "claude" | "leo" | "kip";
  text: string;
  emotion: Emotion;
  camera: CameraShot;
  startFrame: number;
  durationFrames: number;
  stepCard?: StepCardData;
}
