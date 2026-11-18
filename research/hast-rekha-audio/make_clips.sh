#!/usr/bin/env bash
# Reproduce every clip in this folder on Linux/macOS/WSL.  ~3 min incl. voice download (~190 MB, not committed).
set -euo pipefail
cd "$(dirname "$0")"
python3 -m venv .venv && . .venv/bin/activate
pip install -q piper-tts numpy scipy                 # piper-tts 1.8 (GPL-3, OHF-Voice/piper1-gpl)
mkdir -p voices
python -m piper.download_voices --download-dir voices en_GB-alba-medium hi_IN-pratham-medium
python gen_assets.py                                  # temple_ir.wav + tanpura.wav (synthetic, ours)
python -m piper -m voices/en_GB-alba-medium    -i life-line_en.txt  -f /tmp/life_en.wav
python -m piper -m voices/en_GB-alba-medium    -i heart-line_en.txt -f /tmp/heart_en.wav
python -m piper -m voices/hi_IN-pratham-medium -i life-line_hi.txt  -f /tmp/life_hi.wav
./divine.sh /tmp/life_en.wav  life-line_en_divine.ogg
./divine.sh /tmp/heart_en.wav heart-line_en_divine.ogg
./divine.sh /tmp/life_hi.wav  life-line_hi_divine.ogg -20 0.25
