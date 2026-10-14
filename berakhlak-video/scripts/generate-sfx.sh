#!/bin/bash
# SFX minimal — dihasilkan secara sintetis dengan ffmpeg.
#
# Kenapa sintetis, bukan unduh stok:
#   - deterministik & reproducible (AI-BEHAVIOR: same input -> same output)
#   - bebas isu lisensi / atribusi
#   - sengaja lembut & pendek supaya tidak terasa seperti template video
#
# Output: public/sfx/{whoosh,tick,sting}.mp3
set -euo pipefail

cd "$(dirname "$0")/.."
OUT="public/sfx"
mkdir -p "$OUT"

echo "-> whoosh (transisi scene)"
# Sapuan frekuensi naik yang lembut + tekstur noise tipis, amplop lonceng.
ffmpeg -v error -y -f lavfi \
  -i "aevalsrc='0.16*sin(2*PI*(260+900*t/0.55)*t)*sin(PI*t/0.55)+0.05*(random(0)*2-1)':d=0.55:s=44100" \
  -af "highpass=f=180,lowpass=f=4200,afade=t=in:d=0.12,afade=t=out:st=0.25:d=0.3,volume=2.2" \
  -c:a libmp3lame -q:a 6 "$OUT/whoosh.mp3"

echo "-> tick (progress rail)"
# Klik sangat pendek — hanya penanda ritme.
ffmpeg -v error -y -f lavfi \
  -i "aevalsrc='0.2*sin(2*PI*1180*t)*exp(-55*t)':d=0.09:s=44100" \
  -af "highpass=f=600,afade=t=out:st=0.03:d=0.06,volume=1.1" \
  -c:a libmp3lame -q:a 6 "$OUT/tick.mp3"

echo "-> sting (logo mendarat di Outro)"
# Akor lembut (G-B-D) dengan serangan lambat dan ekor panjang.
ffmpeg -v error -y -f lavfi \
  -i "aevalsrc='0.09*sin(2*PI*392*t)+0.07*sin(2*PI*494*t)+0.06*sin(2*PI*587*t)+0.03*sin(2*PI*784*t)':d=2.0:s=44100" \
  -af "afade=t=in:d=0.55,afade=t=out:st=0.9:d=1.1,lowpass=f=3800,volume=1.4" \
  -c:a libmp3lame -q:a 6 "$OUT/sting.mp3"

echo ""
ls -lh "$OUT"
for f in "$OUT"/*.mp3; do
  echo "  $(basename "$f")  $(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$f")s"
done
