# Video-Berakhlak

Video motion-grafis BerAKHLAK (7 nilai dasar ASN) untuk Pemerintah Kota Jambi —
dari materi, footage mentah, sampai proyek Remotion yang siap render.

## Isi folder

| Folder / berkas | Keterangan |
|---|---|
| `berakhlak-video/` | **Proyek utama** (Remotion + React). Baca `berakhlak-video/README.md` untuk cara jalan. Landscape 1920×1080 + vertikal 1080×1920, 30fps, ±5744 frame (±3:11). |
| `VIdeo Berakhlak/` | Footage mentah dokumentasi layanan RSUD H. Abdul Manap Kota Jambi (45 klip 4K). |
| `logo/` | Aset logo (referensi). Logo resmi yang dipakai video ada di `berakhlak-video/public/brand/`. |
| `Materi Video Berakhlak.md` | Naskah/materi sumber narasi. |
| `berakhlak-video/out/` | Hasil render lokal (`BerAKHLAK.mp4`) — tidak ikut di-git. |

## Mulai cepat

```bash
cd berakhlak-video
npm i
npm run dev        # Remotion Studio
npm run verify     # eslint + tsc + cek keseimbangan footage
npx remotion render BerAKHLAK out/berakhlak.mp4
```

## Catatan footage

Lima file footage mentah (>100MB per file) **tidak ikut di-git** karena batas
keras GitHub menolak file >100MB:

- `20261012_085518.mp4`, `20261012_092132.mp4`, `20261012_092742.mp4`,
  `20261012_093807.mp4`, `20261012_100345.mp4`

Ini tidak mengurangi apa pun: proxy 1080p dari **semua** klip tersebut sudah
ada di `berakhlak-video/public/clips/` dan itulah yang dipakai render.
File `.zip` di folder ini juga tidak di-git (duplikat dari folder di sebelahnya).
