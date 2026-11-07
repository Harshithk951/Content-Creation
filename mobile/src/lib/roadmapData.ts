import { RoadmapPhase } from "../types";

export const ROADMAP_DATA: RoadmapPhase[] = [
  {
    id: "phase-1",
    title: "Phase 1: Generative Media & Voice Workflows",
    episodes: "Days 01 - 20",
    description: "Replace Midjourney, ElevenLabs, Runway, and commercial speech APIs with 100% free open-weights models.",
    status: "active",
    topics: [
      { day: 1, title: "Kokoro 82M: Studio Quality AI Voice", tool: "Kokoro 82M", costSaved: "$50/mo", completed: true },
      { day: 2, title: "Midjourney vs Flux.1 Schnell", tool: "Flux.1", costSaved: "$10/mo", completed: true },
      { day: 3, title: "GitHub Copilot vs Continue.dev", tool: "Continue + Ollama", costSaved: "$10/mo", completed: true },
      { day: 4, title: "Whisper WebGPU: 100% Offline Audio Transcription", tool: "Transformers.js", costSaved: "$20/mo", completed: false },
      { day: 5, title: "Stable Audio Open: Royalty-Free Sound FX & BGM", tool: "Stable Audio", costSaved: "$30/mo", completed: false },
      { day: 6, title: "ComfyUI Local Mastery for Image Generation", tool: "ComfyUI", costSaved: "$25/mo", completed: false },
      { day: 7, title: "Segment Anything (SAM 2): Instant Video Masking", tool: "Meta SAM 2", costSaved: "$40/mo", completed: false },
    ],
  },
  {
    id: "phase-2",
    title: "Phase 2: Autonomous Coding & Local LLMs",
    episodes: "Days 21 - 40",
    description: "Run local coding agents that read your codebase, run tests, and fix bugs without cloud API bills.",
    status: "upcoming",
    topics: [
      { day: 21, title: "Ollama + DeepSeek R1 for Local Reasoning", tool: "Ollama", costSaved: "$20/mo", completed: false },
      { day: 22, title: "Aider: Terminal Pair-Programming That Works", tool: "Aider AI", costSaved: "$15/mo", completed: false },
      { day: 23, title: "LM Studio & Local OpenAI-Compatible Endpoints", tool: "LM Studio", costSaved: "$20/mo", completed: false },
      { day: 24, title: "Qwen 2.5 Coder 32B on Apple Silicon & CUDA", tool: "Qwen 2.5", costSaved: "$30/mo", completed: false },
    ],
  },
  {
    id: "phase-3",
    title: "Phase 3: Multi-Agent Systems & MCP Servers",
    episodes: "Days 41 - 60",
    description: "Connect AI agents to your files, databases, APIs, and browsers via Model Context Protocol.",
    status: "upcoming",
    topics: [
      { day: 41, title: "Model Context Protocol (MCP) Crash Course", tool: "Anthropic MCP", costSaved: "$100/mo", completed: false },
      { day: 42, title: "Building a Free SQLite & Postgres MCP Tool", tool: "TypeScript SDK", costSaved: "$50/mo", completed: false },
      { day: 43, title: "Browser Automation Agents with Playwright", tool: "Stagehand", costSaved: "$75/mo", completed: false },
    ],
  },
  {
    id: "phase-4",
    title: "Phase 4: Local RAG & Document Intelligence",
    episodes: "Days 61 - 80",
    description: "Search across gigabytes of private PDFs, codebases, and notes with zero data leaks.",
    status: "upcoming",
    topics: [
      { day: 61, title: "ChromaDB + Nomic Embed Local Vectors", tool: "ChromaDB", costSaved: "$45/mo", completed: false },
      { day: 62, title: "Hybrid BM25 + Dense Semantic Search", tool: "FastEmbed", costSaved: "$30/mo", completed: false },
    ],
  },
  {
    id: "phase-5",
    title: "Phase 5: Free Full-Stack Cloud Deployment",
    episodes: "Days 81 - 100",
    description: "Host web apps, cron jobs, and background workers on 100% free-tier cloud infrastructure.",
    status: "upcoming",
    topics: [
      { day: 81, title: "Deploying Python & Node.js AI APIs for $0", tool: "Render / Fly.io", costSaved: "$25/mo", completed: false },
      { day: 90, title: "Supabase Free Tier Architecture & Backups", tool: "Supabase", costSaved: "$25/mo", completed: false },
      { day: 100, title: "The $0/Year Production Stack Blueprint", tool: "Full Architecture", costSaved: "$3,600/yr", completed: false },
    ],
  },
];
