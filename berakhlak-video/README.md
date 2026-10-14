# Video BerAKHLAK — Pemerintah Kota Jambi

Video motion-grafis BerAKHLAK (7 nilai dasar ASN) berbasis
[Remotion](https://www.remotion.dev/) + React, arah seni **Editorial Paper**
(kanvas kertas hangat, tipografi editorial, footage sebagai jendela geometris,
motif batik Melayu Jambi). Footage: dokumentasi layanan
RSUD H. Abdul Manap Kota Jambi.

- Landscape `BerAKHLAK` 1920×1080 dan vertikal `BerAKHLAK-Vertical` 1080×1920,
  30fps, ±5744 frame (±3:11 — durasi mengikuti audio narasi, bukan angka tetap).
- Narasi TTS perempuan Bahasa Indonesia (Edge TTS `id-ID-GadisNeural`) +
  subtitle bakar per scene. Tanpa musik latar (hanya 3 SFX sintetis).

## Mulai cepat

```bash
npm i
npm run dev        # Remotion Studio
npm run verify     # eslint + tsc + cek keseimbangan footage
npx remotion render BerAKHLAK out/berakhlak.mp4
```

> Catatan: `remotion.config.ts` otomatis memakai Chrome/Chromium sistem
> kalau ada (bisa ditimpa via `REMOTION_BROWSER_EXECUTABLE`), karena unduhan
> Chrome Headless Shell bawaan Remotion gagal di sebagian mesin Linux.

## Alur kerja

| Perintah | Fungsi |
|---|---|
| `bash scripts/generate-voiceover.sh` (`npm run voiceover`) | TTS dari `src/data/narration.json` → `public/voiceover/*.mp3` + `*.srt`, lalu menulis ulang `src/data/durations.ts` + `src/data/captions.ts` |
| `bash scripts/make-proxies.sh <klip…>` | Potong footage 4K sumber menjadi proxy 1080p di `public/clips/` |
| `node scripts/check-shots.mjs` (`npm run check:shots`) | Pastikan tiap scene punya cukup footage dan angka `seconds` cocok dengan proxy di disk |
| `bash scripts/generate-sfx.sh` (`npm run sfx`) | Sintesis 3 SFX (whoosh/tick/sting) via ffmpeg |

Sumber teks narasi: `src/data/narration.json` (satu-satunya sumber — dipakai
komposisi maupun script TTS). Timeline (`src/timeline.ts`) menurunkan durasi
scene dari durasi audio terukur, jadi mengubah naskah → jalankan ulang
`generate-voiceover.sh` dan video menyesuaikan sendiri.

## Struktur

- `src/compositions/` — `Intro`, `Akronim`, `Nilai` (dipakai 7×), `Outro`
- `src/components/` — `Paper`, `Panel`, `Motif` (8 motif batik line-art),
  `Broll` (deret klip + alokasi berkapasitas), `Rail`, `Kinetic`, `Logo`,
  `Subtitles`
- `src/data/` — `narration.json`, `durations.ts`, `captions.ts`, `values.ts`,
  `shots.ts` (peta scene→klip + kolom `what` untuk peninjauan)
- `public/voiceover/`, `public/clips/`, `public/brand/`, `public/sfx/`

Rincian perubahan: `CHANGELOG.md`.
