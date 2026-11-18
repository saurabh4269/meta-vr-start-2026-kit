# Hast Rekha - divine narrator samples (offline, free)

Proof-of-concept clips for the "divine voice" stack described in
[`../hast-rekha-magic-design.md`](../hast-rekha-magic-design.md) section 4.
Everything here was produced **offline on a CPU box** in seconds per clip.

| File | What it is |
|---|---|
| `life-line_en_dry.ogg` | Piper `en_GB-alba-medium`, no processing (A/B reference) |
| `life-line_en_divine.ogg` | same text after the divine chain (about 19 s) |
| `heart-line_en_divine.ogg` | Heart line, English (about 13 s) |
| `life-line_hi_divine.ogg` | Life line in Hindi, Piper `hi_IN-pratham-medium` + chain (about 17 s) |
| `*.txt` | the narration scripts |
| `divine.sh` | the ffmpeg post chain (one command per clip) |
| `gen_assets.py` (run first; the two wavs it writes are git-ignored) | makes `temple_ir.wav` (synthetic stone-hall impulse response) and `tanpura.wav` (synthetic tanpura-style drone) with numpy; both are ours, no licence issue |
| `make_clips.sh` | rebuilds everything from scratch |

Honest status: I verified the files decode, loudness (-16 LUFS, -2 dBTP), reverb tail decay and spectrum. I could not *listen*, so
**please play the three `_divine` files and the dry one on a headset/speakers before trusting the tuning.** The knobs are the last
arguments of `divine.sh` and the numbers in the filter graph (see below).

## Exact commands

```bash
# 1. Piper (offline neural TTS, CPU)
python3 -m venv .venv && . .venv/bin/activate
pip install piper-tts numpy scipy
python -m piper.download_voices en_GB-alba-medium hi_IN-pratham-medium     # downloads .onnx + .json into cwd

# 2. synthesize (writes 22.05 kHz mono wav)
python -m piper -m en_GB-alba-medium -i life-line_en.txt -f life_en.wav
python -m piper -m hi_IN-pratham-medium -i life-line_hi.txt -f life_hi.wav
#   optional: --length-scale 1.15 (slower, more solemn)  --noise-scale 0.5 --noise-w-scale 0.6

# 3. helper assets (once)
python gen_assets.py

# 4. divine chain  ->  ./divine.sh in.wav out.ogg [drone_dB=-20] [octave_down_gain=0.30]
./divine.sh life_en.wav life-line_en_divine.ogg
```

## What the chain does (ffmpeg filter graph in `divine.sh`)

1. `highpass 90 Hz` + gentle `acompressor` (3:1) - tidy the raw TTS.
2. Four parallel layers, summed with `amix normalize=0`:
   - **main** - narrator with a small warmth/presence EQ.
   - **sub** - `rubberband pitch=0.5` (octave down), low-passed at 900 Hz, gain 0.30: the "voice of the mountain" weight.
   - **whisper** - `rubberband pitch=2.0` (octave up), high-passed 1.5 kHz, 28 ms late, gain 0.10: a breathy halo.
   - **fifth** - `rubberband pitch=1.4983` (perfect fifth up), low-passed 3.5 kHz, 45 ms late, gain 0.12: a pad-like harmony.
3. `chorus` (2 voices, slow LFO) to smear the layers into a choir-like texture.
4. **Convolution reverb**: `afir` with `temple_ir.wav` (3.2 s RT60, darkening tail, 18 ms pre-delay), 85 % wet.
5. **Tanpura bed** at -20 dB, looped (`-stream_loop -1`), cut to the voice length + 3 s tail.
6. `loudnorm I=-16 TP=-1.5 LRA=7` then `alimiter 0.95`; encode Ogg Vorbis q3 (about 100 kbps, 200-270 KB per clip).

Requirements: ffmpeg built with `--enable-librubberband` and `afir` (Ubuntu/Debian/Homebrew builds have both; check with
`ffmpeg -filters | grep -E "rubberband|afir"`). On Windows use the gyan.dev "full" build.

## Using a real (recorded) impulse response instead of the synthetic one

Replace `temple_ir.wav` with any stereo/mono IR wav; keep it under ~4 s. Candidates and licences are listed in the design doc.
Convert with `ffmpeg -i ir.flac -ar 44100 -ac 2 temple_ir.wav`.

## Licences of what is in this folder

- Piper engine: `piper-tts` is GPL-3 (OHF-Voice/piper1-gpl). We only run it; the audio output is not GPL-encumbered.
- **`en_GB-alba-medium`**: dataset CC BY 4.0 (Univ. of Edinburgh "Alba") - **credit it** in the app's credits screen.
  The *no branding* rule concerns the demo video; a credits screen inside the app is normal.
- **`hi_IN-pratham-medium`** (and `priyamvada`): dataset licence **CC BY-NC-SA 4.0 (non-commercial)**. Fine for a hackathon prototype,
  **not** for a paid release. For a commercial Hindi voice use Azure/Google/ElevenLabs (paid) or Indic Parler-TTS (Apache-2.0).
- `en_US-lessac-high` carries the Blizzard-2013 licence - avoided on purpose.
- This is a synthetic voice of a neutral dataset speaker, not anyone famous; do not clone a real person without consent.
