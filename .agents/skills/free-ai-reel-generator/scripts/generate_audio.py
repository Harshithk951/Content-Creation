#!/usr/bin/env python3
"""
Generate standardized dialogue audio with ElevenLabs for 100 Days of Free AI.
Enforces:
  - Harshith: Liam (TX3LPaxmHKxFdv7VOQHJ)
  - Claude: George (JBFqnCBsd6RMkjVDRZzb)
  - 320ms equal turn gap
  - 48kHz stereo WAV mastered to -14 LUFS
"""

import argparse
import json
import os
import ssl
import subprocess
import urllib.request

VOICES = {
    "harshith": "TX3LPaxmHKxFdv7VOQHJ",  # Liam
    "boy": "TX3LPaxmHKxFdv7VOQHJ",       # Liam alias
    "claude": "JBFqnCBsd6RMkjVDRZzb",    # George
    "kip": "JBFqnCBsd6RMkjVDRZzb",       # George alias
}

def get_api_key():
    key = os.environ.get("ELEVEN_API_KEY", "")
    if not key and os.path.exists(".env"):
        with open(".env") as f:
            for line in f:
                if "ELEVEN" in line.upper() and "=" in line:
                    key = line.strip().split("=", 1)[1].strip('"\' ')
    if not key:
        raise ValueError("ELEVEN_API_KEY not found in environment or .env")
    return key

def synthesize_line(speaker: str, text: str, out_path: str, api_key: str):
    voice_id = VOICES.get(speaker.lower())
    if not voice_id:
        raise ValueError(f"Unknown speaker '{speaker}'. Must be 'harshith' or 'claude'.")
    
    ctx = ssl._create_unverified_context()
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    payload = json.dumps({
        "text": text,
        "model_id": "eleven_turbo_v2_5",
        "voice_settings": {
            "stability": 0.55,
            "similarity_boost": 0.80,
            "style": 0.20,
            "use_speaker_boost": True
        }
    }).encode("utf-8")
    
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"xi-api-key": api_key, "Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, context=ctx) as resp:
        with open(out_path, "wb") as f:
            f.write(resp.read())

def get_duration(file_path: str) -> float:
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", file_path
    ]
    return float(subprocess.check_output(cmd).decode().strip())

def main():
    parser = argparse.ArgumentParser(description="Generate 100 Days of Free AI Audio")
    parser.add_argument("--script", type=str, required=True, help="Path to JSON script file containing array of {speaker, text}")
    parser.add_argument("--output", type=str, required=True, help="Path to output master audio WAV")
    parser.add_argument("--temp-dir", type=str, default="/tmp/reel_audio_temp", help="Temporary working directory")
    args = parser.parse_args()

    api_key = get_api_key()
    os.makedirs(args.temp_dir, exist_ok=True)

    with open(args.script) as f:
        dialogue = json.load(f)

    # 1. Synthesize individual lines and trim silence
    clean_lines = []
    for i, line in enumerate(dialogue):
        raw_mp3 = os.path.join(args.temp_dir, f"line_{i:02d}_{line['speaker']}.mp3")
        clean_wav = os.path.join(args.temp_dir, f"line_{i:02d}_{line['speaker']}_clean.wav")
        print(f"[{i+1}/{len(dialogue)}] Synthesizing {line['speaker']}: '{line['text'][:40]}...'")
        synthesize_line(line["speaker"], line["text"], raw_mp3, api_key)

        # Trim lead/tail silence
        subprocess.check_call([
            "ffmpeg", "-y", "-i", raw_mp3,
            "-af", "silenceremove=start_periods=1:start_duration=0.03:start_threshold=-45dB:detection=peak,areverse,silenceremove=start_periods=1:start_duration=0.03:start_threshold=-45dB:detection=peak,areverse",
            "-ar", "48000", "-ac", "2", clean_wav
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        dur = get_duration(clean_wav)
        clean_lines.append((line["speaker"], clean_wav, dur, line["text"]))

    # 2. Assemble timeline with exact 320ms turn gaps
    print("\nCalculated Turn Schedule (320ms equal conversational gap):")
    timeline = []
    current_time = 0.0
    gap = 0.320  # 320ms

    for i, (speaker, wav, dur, text) in enumerate(clean_lines):
        start_f = round(current_time * 30)
        dur_f = round(dur * 30)
        timeline.append({
            "index": i + 1,
            "speaker": speaker,
            "startSec": round(current_time, 3),
            "endSec": round(current_time + dur, 3),
            "startFrame": start_f,
            "durationFrames": dur_f,
            "text": text,
            "file": wav
        })
        print(f"  Line {i+1} ({speaker}): {current_time:.2f}s -> {current_time + dur:.2f}s (Frame {start_f}..{start_f + dur_f})")
        current_time += dur + gap

    total_speech_duration = current_time
    outro_hold = 2.0
    total_reel_duration = total_speech_duration + outro_hold
    total_reel_frames = round(total_reel_duration * 30)

    print(f"\nTotal Spoken Duration: {total_speech_duration:.2f}s")
    print(f"Total Composition Duration (with 2s outro CTA hold): {total_reel_duration:.2f}s ({total_reel_frames} frames @ 30 FPS)")

    # 3. Save timeline JSON for Remotion
    timeline_path = os.path.splitext(args.output)[0] + "_timeline.json"
    with open(timeline_path, "w") as f:
        json.dump({
            "totalDurationSec": total_reel_duration,
            "totalFrames": total_reel_frames,
            "lines": timeline
        }, f, indent=2)
    print(f"Saved timeline to: {timeline_path}")

    # 4. Mix speech tracks into raw dialogue track
    filter_complex = []
    inputs = []
    for i, item in enumerate(timeline):
        inputs.extend(["-i", item["file"]])
        delay_ms = round(item["startSec"] * 1000)
        filter_complex.append(f"[{i}]adelay={delay_ms}|{delay_ms}[d{i}];")
    
    mix_sources = "".join(f"[d{i}]" for i in range(len(timeline)))
    filter_complex.append(f"{mix_sources}amix=inputs={len(timeline)}:duration=longest:dropout_transition=0,volume=1.0[speech_out]")
    
    raw_dialogue_wav = os.path.join(args.temp_dir, "raw_dialogue.wav")
    cmd_mix = ["ffmpeg", "-y"] + inputs + ["-filter_complex", "".join(filter_complex), "-map", "[speech_out]", "-ar", "48000", "-ac", "2", raw_dialogue_wav]
    subprocess.check_call(cmd_mix, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 5. Master dialogue with loudnorm (-14 LUFS)
    subprocess.check_call([
        "ffmpeg", "-y", "-i", raw_dialogue_wav,
        "-af", "loudnorm=I=-14:LRA=7:TP=-1.5",
        "-ar", "48000", "-ac", "2", args.output
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    print(f"Successfully generated master audio: {args.output}")

if __name__ == "__main__":
    main()
