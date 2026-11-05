#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

mkdir -p test_outputs/audio_master

# 1. Subtle acoustic filter on Kip's voice (clean robot companion tone: subtle high-pass & crisp highs)
for f in line2_kip line4_kip line6_kip; do
  ffmpeg -y -i "test_outputs/dialogue/${f}.wav" \
    -af "highpass=f=180,lowpass=f=5500,volume=1.1" \
    "test_outputs/dialogue/${f}_treated.wav"
done

# 2. Concat dialogue track with realistic conversational pauses (0.25s gap)
ffmpeg -y \
  -i "test_outputs/dialogue/line1_leo.wav" \
  -i "test_outputs/dialogue/line2_kip_treated.wav" \
  -i "test_outputs/dialogue/line3_leo.wav" \
  -i "test_outputs/dialogue/line4_kip_treated.wav" \
  -i "test_outputs/dialogue/line5_leo.wav" \
  -i "test_outputs/dialogue/line6_kip_treated.wav" \
  -filter_complex "
    [0:a]adelay=100|100[a0];
    [1:a]adelay=3800|3800[a1];
    [2:a]adelay=8300|8300[a2];
    [3:a]adelay=10600|10600[a3];
    [4:a]adelay=16000|16000[a4];
    [5:a]adelay=18800|18800[a5];
    [a0][a1][a2][a3][a4][a5]amix=inputs=6:dropout_transition=0:normalize=0[dialogue]
  " \
  -map "[dialogue]" -c:a pcm_s16le "test_outputs/dialogue/full_dialogue.wav"

DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "test_outputs/dialogue/full_dialogue.wav")
TOTAL_DUR=$(node -e "console.log(Math.ceil($DURATION) + 1)")

# 3. Generate soft ambient lo-fi music bed (Cmaj7 / Am9 warm harmonic tones, ducked to -24dB)
ffmpeg -y \
  -f lavfi -i "sine=frequency=130.81:duration=${TOTAL_DUR}" \
  -f lavfi -i "sine=frequency=196.00:duration=${TOTAL_DUR}" \
  -f lavfi -i "sine=frequency=246.94:duration=${TOTAL_DUR}" \
  -f lavfi -i "sine=frequency=329.63:duration=${TOTAL_DUR}" \
  -filter_complex "
    amix=inputs=4:normalize=0,
    tremolo=f=0.5:d=0.3,
    volume=0.04,
    afade=t=in:ss=0:d=1,
    afade=t=out:st=$((TOTAL_DUR - 2)):d=2
  " \
  -c:a pcm_s16le "test_outputs/audio_master/lofi_bed.wav"

# 4. Generate punchline sound effect (digital chirp / record-stop blip at 18.5s)
ffmpeg -y -f lavfi -i "sine=frequency=880:duration=0.25" \
  -af "volume=0.3,afade=t=out:st=0.05:d=0.2" \
  "test_outputs/audio_master/sfx_blip.wav"

# 5. Master Mix: Dialogue + Lo-Fi Music Bed + SFX + EBU R128 Loudness Normalisation (-14 LUFS for Reels)
ffmpeg -y \
  -i "test_outputs/dialogue/full_dialogue.wav" \
  -i "test_outputs/audio_master/lofi_bed.wav" \
  -i "test_outputs/audio_master/sfx_blip.wav" \
  -filter_complex "
    [2:a]adelay=18600|18600[sfx];
    [0:a][1:a][sfx]amix=inputs=3:dropout_transition=0:normalize=0[mixed];
    [mixed]loudnorm=I=-14:TP=-1.5:LRA=11[master]
  " \
  -map "[master]" \
  -c:a aac -b:a 192k \
  "Exports/dialogue_master_20s.m4a"

# Also render WAV for Remotion/Whisper
ffmpeg -y -i "Exports/dialogue_master_20s.m4a" -c:a pcm_s16le "Exports/dialogue_master_20s.wav"

echo "=== 20-Second Master Audio Mixed Successfully! ==="
ffprobe -v error -show_entries format=duration,bit_rate -of default=noprint_wrappers=1 "Exports/dialogue_master_20s.m4a"
