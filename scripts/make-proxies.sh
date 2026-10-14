#!/bin/bash
# Potong klip sumber 4K menjadi proxy 1080p H.264 (tanpa audio) untuk Remotion.
#
# Kenapa proxy:
#   - sumber 4K HEVC (2,3 GB) terlalu berat untuk dipratinjau dan dirender
#   - 1080p H.264 jauh lebih ringan, mutu tetap cukup untuk kanvas 1080p
#
# Titik mulai = 28% durasi klip. Titik ini sudah diperiksa secara visual
# (lihat analisis kontak-sheet), jadi potongan proxy sudah berisi adegan
# yang memang dipilih, dan `trimBefore` di shots.ts cukup 0.
#
# Pemakaian: scripts/make-proxies.sh <nama-klip> [<nama-klip> ...]
set -euo pipefail

cd "$(dirname "$0")/.."

SRC="/mnt/DiskD/Projects/videos/VIdeo Berakhlak"
OUT="public/clips"
LEN=12

mkdir -p "$OUT"

if [ "$#" -eq 0 ]; then
  echo "Tidak ada klip yang diminta." >&2
  exit 1
fi

for b in "$@"; do
  src="$SRC/$b.mp4"
  if [ ! -f "$src" ]; then
    echo "LEWAT (tidak ada): $b"
    continue
  fi
  dur=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$src")
  start=$(awk -v d="$dur" -v l="$LEN" 'BEGIN{s=d*0.28; if (s > d-l-0.5) s=d-l-0.5; if (s<0) s=0; printf "%.2f", s}')
  ffmpeg -v error -y -ss "$start" -i "$src" -t "$LEN" \
    -vf "scale=1920:1080" -r 30 \
    -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -an \
    -movflags +faststart "$OUT/$b.mp4"
  printf "%-24s mulai %6ss / %6ss  ->  %s\n" "$b" "$start" "$dur" "$(du -h "$OUT/$b.mp4" | cut -f1)"
done

echo "SELESAI: $(ls "$OUT" | wc -l) proxy di $OUT"
