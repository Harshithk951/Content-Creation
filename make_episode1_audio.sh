#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

mkdir -p Exports test_outputs/episode1_dialogue

echo "1. Concatenating 10 dialogue lines with micro-pauses..."
ffmpeg -y \
  -i "test_outputs/episode1_dialogue/line1_boy.wav" \
  -i "test_outputs/episode1_dialogue/line2_claude.wav" \
  -i "test_outputs/episode1_dialogue/line3_boy.wav" \
  -i "test_outputs/episode1_dialogue/line4_claude.wav" \
  -i "test_outputs/episode1_dialogue/line5_boy.wav" \
  -i "test_outputs/episode1_dialogue/line6_claude.wav" \
  -i "test_outputs/episode1_dialogue/line7_boy.wav" \
  -i "test_outputs/episode1_dialogue/line8_claude.wav" \
  -i "test_outputs/episode1_dialogue/line9_boy.wav" \
  -i "test_outputs/episode1_dialogue/line10_claude.wav" \
  -filter_complex "[0:a]adelay=100|100[a0];[1:a]adelay=3922|3922[a1];[2:a]adelay=6656|6656[a2];[3:a]adelay=9476|9476[a3];[4:a]adelay=16306|16306[a4];[5:a]adelay=18507|18507[a5];[6:a]adelay=24057|24057[a6];[7:a]adelay=26322|26322[a7];[8:a]adelay=31339|31339[a8];[9:a]adelay=34052|34052[a9];[a0][a1][a2][a3][a4][a5][a6][a7][a8][a9]amix=inputs=10:dropout_transition=0:normalize=0[dialogue]" \
  -map "[dialogue]" -c:a pcm_s16le "test_outputs/episode1_dialogue/raw_dialogue.wav"

TOTAL_DUR=38

echo "2. Synthesizing ambient lo-fi music bed (ducked to -24dB)..."
ffmpeg -y \
  -f lavfi -i "sine=frequency=130.81:duration=${TOTAL_DUR}" \
  -f lavfi -i "sine=frequency=196.00:duration=${TOTAL_DUR}" \
  -f lavfi -i "sine=frequency=246.94:duration=${TOTAL_DUR}" \
  -f lavfi -i "sine=frequency=329.63:duration=${TOTAL_DUR}" \
  -filter_complex "
    amix=inputs=4:normalize=0,
    tremolo=f=0.5:d=0.3,
    volume=0.035,
    afade=t=in:ss=0:d=1.5,
    afade=t=out:st=35:d=3
  " \
  -c:a pcm_s16le "test_outputs/episode1_dialogue/music_bed.wav"

echo "3. Synthesizing punchline SFX..."
ffmpeg -y \
  -f lavfi -i "sine=frequency=587.33:duration=0.18" \
  -af "volume=0.12,afade=t=out:st=0.08:d=0.1" \
  -c:a pcm_s16le "test_outputs/episode1_dialogue/blip_sfx.wav"

echo "4. Mixing dialogue + music bed + SFX with EBU R128 loudness normalization (-14 LUFS)..."
ffmpeg -y \
  -i "test_outputs/episode1_dialogue/raw_dialogue.wav" \
  -i "test_outputs/episode1_dialogue/music_bed.wav" \
  -i "test_outputs/episode1_dialogue/blip_sfx.wav" \
  -filter_complex "
    [2:a]adelay=34000|34000[sfx];
    [0:a][1:a][sfx]amix=inputs=3:dropout_transition=0:normalize=0[mix];
    [mix]loudnorm=I=-14:LRA=7:TP=-1.5[out]
  " \
  -map "[out]" \
  -c:a pcm_s16le "Exports/episode1_master.wav"

ffmpeg -y -i "Exports/episode1_master.wav" -c:a aac -b:a 192k "Exports/episode1_master.m4a"

echo "5. Transcribing with whisper.cpp for word-level captions..."
whisper-cli -m models/ggml-base.en.bin -f "Exports/episode1_master.wav" -oj -osrt -of "Exports/episode1_captions"

echo "Audio master & captions complete!"
