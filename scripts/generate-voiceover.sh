#!/bin/bash
# Generate voiceover TTS perempuan Bahasa Indonesia via Edge TTS.
# Pola mengikuti Remotion skill (voiceover.md), provider diganti Edge TTS
# (gratis, tanpa API key) sebagai pengganti ElevenLabs.
#
# Voice: id-ID-GadisNeural (Female)
# Sumber teks: src/data/narration.json  (tanpa duplikasi)
# Output:
#   public/voiceover/<id>.mp3   audio narasi
#   public/voiceover/<id>.srt   timing per kata (untuk subtitle burn-in)
#   src/data/durations.ts       durasi audio terukur (dipakai timeline adaptif)
set -euo pipefail

cd "$(dirname "$0")/.."

OUT_DIR="public/voiceover"
mkdir -p "$OUT_DIR"

TTS_CMD=(uvx edge-tts)

VOICE=$(node -p "require('./src/data/narration.json').voice")
RATE=$(node -p "require('./src/data/narration.json').rate")
PITCH=$(node -p "require('./src/data/narration.json').pitch")

echo "TTS voice=$VOICE rate=$RATE pitch=$PITCH out=$OUT_DIR"

# id<TAB>text  per baris — dibaca dari narration.json
mapfile -t ROWS < <(node -e "
const n=require('./src/data/narration.json');
for (const id of n.order) console.log(id + '\t' + n.scenes[id].text);
")

for row in "${ROWS[@]}"; do
  id="${row%%$'\t'*}"
  text="${row#*$'\t'}"
  echo "-> $id"
  # Bentuk --flag=nilai (dengan `=`) wajib: nilai negatif seperti -5% akan
  # ditolak argparse kalau dipisah dengan spasi.
  "${TTS_CMD[@]}" --voice "$VOICE" --rate="$RATE" --pitch="$PITCH" --text "$text" \
    --write-media "$OUT_DIR/${id}.mp3" \
    --write-subtitles "$OUT_DIR/${id}.srt"
done

# Durasi terukur -> src/data/durations.ts (timeline adaptif, deterministik)
node scripts/srt-to-captions.mjs

{
  echo "// DIHASILKAN OTOMATIS oleh scripts/generate-voiceover.sh — jangan diubah manual."
  echo "// Durasi audio narasi terukur (detik), dipakai untuk timeline adaptif."
  echo ""
  echo "export const audioSeconds: Record<string, number> = {"
  for row in "${ROWS[@]}"; do
    id="${row%%$'\t'*}"
    dur=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$OUT_DIR/${id}.mp3")
    printf "  '%s': %s,\n" "$id" "$dur"
  done
  echo "};"
} > src/data/durations.ts

echo ""
echo "Durasi hasil:"
for row in "${ROWS[@]}"; do
  id="${row%%$'\t'*}"
  echo "  $id  $(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$OUT_DIR/${id}.mp3")s"
done
echo ""
echo "Total audio: $(node -e "
const d=require('fs').readFileSync('src/data/durations.ts','utf8');
const m=[...d.matchAll(/':\s*([0-9.]+),/g)].map(x=>Number(x[1]));
console.log(m.reduce((a,b)=>a+b,0).toFixed(2)+'s');
")"
