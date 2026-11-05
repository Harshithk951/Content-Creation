#!/usr/bin/env bash
# ==============================================================================
# Local Free Instagram Reel Creation Pipeline
# Steps:
# 1. Source Video -> ffmpeg trim (max 90s) & crop/scale to 1080x1920 (9:16) @ 30fps
# 2. Extract 16kHz mono WAV for whisper.cpp
# 3. whisper.cpp -> word-level timestamps in JSON
# 4. Remotion -> animated word-by-word captions overlaid on 9:16 video
# 5. Export -> final 1080x1920 MP4 under 90s in Exports/
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

INPUT="${1:-RawFootage/sample_16x9_talk.mp4}"
OUTPUT="${2:-Exports/reel_output.mp4}"

if [ ! -f "$INPUT" ]; then
  echo "Error: Input video '$INPUT' not found!"
  exit 1
fi

mkdir -p Exports RawFootage test_outputs reel-studio/public

echo "=== [1/4] FFmpeg: Trimming (max 90s) and cropping to 1080x1920 (9:16) ==="
ffmpeg -y -i "$INPUT" \
  -t 90 \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" \
  -c:v libx264 -pix_fmt yuv420p -preset fast \
  -c:a aac -b:a 128k -ar 44100 \
  "reel-studio/public/reel_source.mp4"

echo "=== [2/4] FFmpeg: Extracting 16kHz mono audio for whisper.cpp ==="
ffmpeg -y -i "reel-studio/public/reel_source.mp4" \
  -vn -ar 16000 -ac 1 -c:a pcm_s16le \
  "reel-studio/public/reel_audio.wav"

echo "=== [3/4] whisper.cpp: Transcribing with word-level timestamps ==="
/usr/local/bin/whisper-cli \
  -m "models/ggml-base.en.bin" \
  -f "reel-studio/public/reel_audio.wav" \
  -oj -sow -ml 1 \
  -of "test_outputs/current_transcript"

# Extract transcription array to Remotion's transcript file
node -e '
  const fs = require("fs");
  const data = JSON.parse(fs.readFileSync("test_outputs/current_transcript.json", "utf8"));
  fs.writeFileSync("reel-studio/src/defaultTranscript.json", JSON.stringify(data.transcription || [], null, 2));
'

echo "=== [4/4] Remotion: Rendering 1080x1920 Reel with animated captions ==="
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "reel-studio/public/reel_source.mp4")
FRAMES=$(node -e "console.log(Math.min(2700, Math.floor($DURATION * 30)))")
END_FRAME=$((FRAMES - 1))

echo "Video duration: ${DURATION}s -> Rendering frames: 0 to ${END_FRAME} (${FRAMES} total frames)"

(
  cd reel-studio
  ./node_modules/.bin/remotion render InstagramReel "../$OUTPUT" --frames=0-"$END_FRAME"
)

echo "=== Reel Generated Successfully! ==="
ffprobe -v error -show_entries stream=width,height,r_frame_rate,codec_name -show_entries format=duration,size -of default=noprint_wrappers=1 "$OUTPUT"
echo "Output saved to: $OUTPUT"
