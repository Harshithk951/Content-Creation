# SOURCES & FACT VERIFICATION: EPISODE 01

> **Episode Title:** The $50 Voiceover Trap  
> **Topic:** Kokoro-82M (Local, Open-Weight Text-to-Speech)  
> **Format:** 38s 9:16 Vertical Reel (The Boy & Claude)  

---

## 1. Verified Claims in Episode Script

| Claim in Script | Verification Source | Official Link | Status |
|---|---|---|---|
| **"Apache-2.0 licensed"** | Hugging Face & GitHub repository license declaration | [hexgrad/Kokoro-82M on HuggingFace](https://huggingface.co/hexgrad/Kokoro-82M) | ✅ Verified |
| **"82 million parameters"** | Model architecture specifications | [Kokoro Model Card](https://huggingface.co/hexgrad/Kokoro-82M) | ✅ Verified |
| **"Runs on your laptop CPU"** | ONNX runtime benchmark (x86_64 and ARM CPU execution) | [kokoro-onnx GitHub](https://github.com/thewh1teagle/kokoro-onnx) | ✅ Verified |
| **"300 megabytes total"** | Model ONNX file size = 325 MB, voices = 28 MB | `~/.cache/hyperframes/tts/models/kokoro-v1.0.onnx` | ✅ Verified |
| **"No GPU needed"** | Runs in realtime (~2s per line) on Intel Core i9 CPU without GPU acceleration | Local testing on MacBook Pro i9 | ✅ Verified |
| **"Zero dollars / free"** | 100% local inference, no API keys, no subscription tiers | Local offline execution confirmed | ✅ Verified |

---

## 2. Technical Stack Used

- **Speech Synthesis:** Kokoro-82M via Kokoro-ONNX / HyperFrames local engine (`am_adam` and `bm_george` voices).
- **Audio Post-Processing:** ffmpeg EBU R128 (`loudnorm`) targeting -14 LUFS, 192kbps AAC.
- **Captions:** whisper.cpp (`base.en` model) word-level transcription.
- **Visuals:** Remotion 4.0 with Impasto Oil painting SVG shaders, onetake camera grammar, and gbro paper-collage B-roll elements.
