#!/usr/bin/env bash
# usage: ./divine.sh narration.wav out.ogg [drone_db=-20] [pitch_down_gain=0.30]
# Needs: ffmpeg with rubberband + afir (stock Ubuntu/brew ffmpeg builds have both).
set -euo pipefail
IN="$1"; OUT="$2"; DRONE_DB="${3:--20}"; SUB="${4:-0.30}"
HERE="$(cd "$(dirname "$0")" && pwd)"
ffmpeg -y -hide_banner -loglevel error \
  -i "$IN" -i "$HERE/temple_ir.wav" -stream_loop -1 -i "$HERE/tanpura.wav" \
  -filter_complex "
  [0:a]aresample=44100,highpass=f=90,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,asplit=4[m][s][w1][w2];
  [m]equalizer=f=220:t=h:w=200:g=2,equalizer=f=4500:t=q:w=1.5:g=1.5[main];
  [s]rubberband=pitch=0.5,lowpass=f=900,volume=${SUB}[sub];
  [w1]rubberband=pitch=2.0,highpass=f=1500,adelay=28,volume=0.10[whisper];
  [w2]rubberband=pitch=1.4983,lowpass=f=3500,adelay=45,volume=0.12[fifth];
  [main][sub][whisper][fifth]amix=inputs=4:normalize=0,chorus=0.6:0.9:55|70:0.4|0.32:0.25|0.4:2|1.3,pan=stereo|c0=c0|c1=c0[voice];
  [voice]asplit=2[dry][toverb];
  [toverb][1:a]afir=dry=0:wet=1:gtype=peak:irgain=1,volume=0.9[wet];
  [dry][wet]amix=inputs=2:weights=1 0.85:normalize=0,apad=pad_dur=3[vmix];
  [2:a]volume=${DRONE_DB}dB,aresample=44100,pan=stereo|c0=c0|c1=c0[drone];
  [vmix][drone]amix=inputs=2:duration=first:normalize=0,afade=t=in:d=0.4,loudnorm=I=-16:TP=-1.5:LRA=7,alimiter=limit=0.95[out]
  " -map "[out]" -ac 2 -c:a libvorbis -q:a 3 "$OUT"
echo "wrote $OUT"
