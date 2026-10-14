# Changelog

## [Unreleased] — 2026-10-14
### Changed — Suara lebih natural + panel footage lebih besar (atas permintaan)
- TTS: `rate +10%` → `+0%`, tambah `pitch -5Hz` (`src/data/narration.json` +
  `scripts/generate-voiceover.sh`; flag ditulis bentuk `--flag=nilai` supaya
  nilai negatif lolos argparse). Karakter suara tetap `id-ID-GadisNeural`
  (satu-satunya suara perempuan id-ID di Edge TTS) — racikan dipilih pengguna
  dari 3 sampel uji dengar (A-kalem / B-hangat / C-netral → C menang).
  Catatan uji: SSML TIDAK didukung edge-tts versi ini (tag dibaca harfiah),
  jadi jeda natural hanya dari tanda baca + tempo.
- Total audio 168,96 → 185,76 dtk; komposisi 5239 → 5744 frame (±3:11);
  caption 53 → 59 baris (batas 62 char / 4,8 dtk tetap terjaga).
- Panel footage diperbesar ±31% (landscape 804×520 → 914×600): kolom teks
  850→750px, gap 74→64, `panelHeight` 520→600 (vertikal 660→740). Wordmark
  Intro 148→128 agar tetap muat di kolom baru.
- `npm run verify` tetap LULUS (sisa footage terkecil 3,70 dtk di value-01).

### Changed — Rancang ulang total ke arah "Editorial Paper" (v3 gelap → v4 terang)
Perombakan menyeluruh. Versi lama (kanvas biru gelap, `glow`/`glitch`/confetti/
blob, semua teks di tengah) dibuang karena jatuh ke estetika template AI.
Arah baru: kanvas kertas hangat, tipografi editorial, footage sebagai jendela
geometris, dan motif batik Melayu Jambi yang maknanya memang sepadan.

- `src/theme.ts`: palet baru — kertas `#F6F1E6`, tinta `#12233F`, merah sultan
  `#8C2F2F`, oker `#C9A227`, langit `#3BA3DB`, zamrud `#1E7A3C`.
  Emas & biru SENGAJA hanya dipakai sebagai bentuk/guratan, tidak pernah
  sebagai warna huruf. Font: Plus Jakarta Sans (struktur) + Instrument Serif
  (semboyan/kutipan) via `@remotion/google-fonts`.
- `src/layout.ts` (baru): tata letak asimetris + pemecah kata tersorot.
- Komponen baru: `Paper` (kanvas + butiran SVG), `Panel` (jendela footage,
  garis tinta 2px, tanda potong, keterangan foto), `Motif` (8 motif batik
  line-art yang tumbuh via `strokeDashoffset` + `pathLength={1}`),
  `Broll` (deret klip, hard cut di dalam scene), `Rail` (rel kemajuan 7 nilai),
  `Kinetic` (mask reveal, sorot oker, guratan garis, label), `Logo`
  (lambang Kota Jambi), `Subtitles` (subtitle bakar).
- Komposisi ditulis ulang: `Intro`, `Akronim`, `Nilai`, `Outro`
  (`AcronymReveal`/`ValueCard` dihapus).
- Dihapus: `Background`, `VideoLayer`, `AnimatedText`, `Badge`, `ListLine`,
  `UnderlineDraw`, `public/footage.mp4` (digantikan proxy per-klip).

### Added — Peta footage dari dokumentasi RSUD H. Abdul Manap Kota Jambi
- Pemeriksaan visual 45 klip lewat kontak-sheet berlabel + analisis model
  vision, lalu pemetaan scene → klip berdasarkan ISI adegan, bukan urutan berkas.
  Ringkasan isi disimpan di `src/data/shots.ts` (kolom `what`) agar bisa ditinjau
  dan ditukar tanpa membuka berkas videonya.
- `scripts/make-proxies.sh` (baru): potong klip sumber 4K HEVC menjadi proxy
  1080p H.264 30fps tanpa audio (`public/clips/`), 12 dtk/klip atau sepanjang
  yang tersedia, mulai di 28% durasi — titik yang sudah diperiksa.
- `VID-20261012-WA0018` (1280×720) tetap TIDAK dipakai — diperbesar ke 1920
  akan terlihat lembut. `20261012_100004` juga dibuang (gambar blur total).
  `20261012_085626` dibuang setelah diketahui hanya 2,8 dtk — terlalu pendek
  untuk satu slot panel.

### Fixed — Panel footage bisa membeku di frame terakhir
Rekaman sumber tidak seragam panjangnya: ada yang 2,8 dtk, ada yang 74 dtk,
sementara satu panel bisa butuh 9 dtk. Pembagian durasi yang hanya mengikuti
bobot membuat klip pendek kehabisan gambar, lalu frame terakhirnya membeku
di layar — terlihat seperti video rusak.

- `src/components/Broll.tsx`: pembagian durasi sekarang lewat `allocate()` —
  bagi sesuai bobot, **batasi** tiap klip pada `seconds` yang benar-benar
  tersedia, lalu alihkan kelebihannya ke klip lain yang masih punya sisa
  (berulang sampai tidak ada yang melampaui batas). Jumlah akhir dibulatkan
  agar pas dengan durasi panel. `loop` dipasang sebagai jaring pengaman
  terakhir: mengulang jauh lebih baik daripada membeku.
- `src/data/shots.ts`: kolom `seconds` (panjang proxy nyata) ditambahkan dan
  ke-29 klip dipilih ulang dengan mempertimbangkan durasi, bukan hanya isi.
  Syarat yang dijaga: jumlah `seconds` per scene > durasi scene.
- `scripts/check-shots.mjs` (baru, `npm run check:shots`): memeriksa syarat di
  atas **dan** mencocokkan tiap `seconds` dengan durasi proxy hasil `ffprobe`.
  Gagal keras kalau polanya tidak terbaca, supaya tidak pernah lulus palsu.
  `npm run verify` = eslint + tsc + pemeriksaan ini.
- `src/compositions/Outro.tsx`: klip dialokasikan hanya pada jendela yang
  terlihat (`landingAt + 10`), karena panel sudah memudar saat kartu akhir masuk.

### Fixed — Fade terakhir tidak pernah terpakai
Kondisi transisi terakhir memakai `i === sceneIds.length - 1`, padahal indeks
transisi hanya berjalan 0..jumlah-scene-2 (10 scene → 9 transisi). Akibatnya
fade `value-07 → Outro` tidak pernah aktif dan tergantikan geseran biasa,
sehingga video berakhir dengan potongan yang lebih keras daripada rancangan.

- `src/BerAKHLAKVideo.tsx`: `sceneIds.length - 2`. Sekarang urutan transisinya
  persis seperti rancangan — satu `clockWipe` (Intro → Akronim), `fade`
  (Akronim → nilai-01 dan nilai-07 → Outro), `slide` di antara nilai.
- `src/BerAKHLAKVideo.tsx`: latar kanvas memakai `color.paper` dari tema,
  bukan lagi nilai heksadesimal yang ditulis ulang.

### Fixed — Subtitle terlalu panjang
`--write-subtitles` Edge TTS ternyata menghasilkan cue **per kalimat**, bukan
per kata, sehingga logika penggabungan saja menyisakan baris 140 karakter /
11 dtk yang tidak layak dibaca.

- `scripts/srt-to-captions.mjs`: selain menggabung, sekarang juga **memecah**
  cue panjang di batas kata (maks 62 karakter / 4,8 dtk), lalu membagi waktunya
  proporsional menurut jumlah karakter; batas karakter disempitkan otomatis
  kalau laju tutur di kalimat itu ternyata lebih lambat. Hasil: 33 → 53 baris,
  terpanjang 62 karakter.
- `src/data/captions.ts`: ditulis ulang oleh script di atas.


### Added — Narasi utuh + timeline adaptif
- `src/data/narration.json` menjadi sumber tunggal teks narasi (dipakai
  komposisi maupun script TTS — tidak ada duplikasi teks).
- Naskah diperpanjang ke versi utuh & natural: total audio 168,96 dtk
  (sebelumnya ±75 dtk). Salah ketik materi asli dibersihkan
  (beorientasi, di tuntut, menguasi, stake holder, sekedarASN).
- Tidak ada lagi durasi scene yang di-hardcode: `src/data/durations.ts`
  (dihasilkan script) + `src/timeline.ts` menurunkan durasi dari audio terukur.
  Total komposisi kini 5.239 frame @30fps = **2:54,6**.
- `scripts/srt-to-captions.mjs` (baru): SRT word-boundary Edge TTS digabung
  menjadi baris subtitle yang enak dibaca → `src/data/captions.ts`.

### Added — Aset & suara
- `public/brand/lambang-kota-jambi.png`: Lambang Kota Jambi (Wikimedia Commons,
  800×949, lisensi PD-IDGov). Dipakai apa adanya — hanya dipindah dan
  diperbesar seragam, tidak diwarnai ulang (sesuai ketentuan lisensi).
- `scripts/generate-sfx.sh` (baru): 3 efek suara SIN-TETIS via ffmpeg
  (whoosh transisi, tick rel kemajuan, sting pendaratan lambang).
  Dipilih sintetis agar deterministik dan bebas isu lisensi/atribusi.
- **Tidak ada musik latar** — keputusan sadar; hanya narasi + 3 efek suara
  pada volume rendah (whoosh 0,22 / tick 0,30 / sting 0,42), bisa dimatikan
  lewat prop `sfx`.

### Added — Komposisi vertikal & lambang
- `BerAKHLAK-Vertical` (1080×1920) berbagi komponen dengan versi 16:9;
  margin aman menyesuaikan format (`safeFor`).
- Lambang Kota Jambi hidup DI LUAR `TransitionSeries` supaya tidak terpotong
  transisi: tanda air kanan bawah sepanjang video → bergerak ke tengah dan
  membesar di Outro (62% masuk Outro), disusul pita semboyan oker
  "Tanah Pilih Pesako Betuah" + nama instansi.

### Added — Transisi & gerak (dibatasi dengan sengaja)
- 4 jenis transisi saja: hard cut di dalam scene, `slide` antar nilai,
  `fade` Akronim→nilai-01 dan nilai-07→Outro, dan SATU `clockWipe`
  saat Intro→Akronim.
- Aturan gerak: 1 scene = 1 gerak tanda tangan + 1 gerak struktural +
  1 grup teks. Semua nilai animasi inline dengan rentang & easing eksplisit.

### Preserved dari iterasi sebelumnya (masih berlaku)
- Narasi TTS perempuan Bahasa Indonesia (`id-ID-GadisNeural`, rate `+10%`),
  generator `scripts/generate-voiceover.sh` via `uvx edge-tts`.
- `src/data/values.ts` ditulis ulang: 7 nilai + motif batik + baris penjelas
  dengan timing berbasis FRAKSI durasi scene (ikut menyesuaikan otomatis).

### Notes
- Verifikasi: `npm run lint` (eslint + tsc) bersih, `npx remotion bundle` sukses.
- `npx remotion still` masih gagal di env ini (bug unduh Chrome Headless Shell
  `...zip?clear` EINVAL, tidak terkait perubahan).
- Backup pra-perombakan: `/tmp/opencode/berakhlak-backup/pre-editorial-*.tar.gz`.
- Skrip yang perlu dijalankan ulang bila naskah berubah:
  `./scripts/generate-voiceover.sh` (menulis ulang mp3 + srt + durations.ts
  + captions.ts), lalu `./scripts/make-proxies.sh <klip...>` bila klip berubah.

---

## Riwayat sebelumnya (sudah digantikan)
### Added — Layer footage profesional (20261012_100345.mp4)
- Proxy edit ramah-render `public/footage.mp4` (1920×1080 H264 yuv420p, 74,58 dtk, 51MB)
  dari master 4K HEVC 258MB. Audio dibuang (`-an`).
- `src/components/VideoLayer.tsx` + `src/components/Background.tsx`
  (`footageOffset` per adegan, wash gradien brand). **Keduanya kini dihapus.**

### Added — TTS voiceover perempuan Bahasa Indonesia
- Generator `scripts/generate-voiceover.sh` via `uvx edge-tts`
  (edge-tts 7.2.8 lokal gagal handshake 403; `uvx` memakai 7.3.1+).
- Integrasi `<Audio>` dari `@remotion/media` di `src/BerAKHLAKVideo.tsx`.
- Dependency: `@remotion/media@4.0.535` via `npx remotion add`.
