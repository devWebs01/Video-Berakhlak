/**
 * Peta footage: scene -> klip.
 *
 * Sumber: rekaman dokumentasi layanan RSUD H. Abdul Manap Kota Jambi
 * (2026-10-12, 08:54-10:15). Rekaman ini dipilih karena rumah sakit daerah
 * adalah wujud paling konkret dari nilai Berorientasi Pelayanan — bukan
 * sekadar bahan yang kebetulan tersedia.
 *
 * Pemetaan ditentukan dari pemeriksaan visual tiap klip (kontak-sheet
 * berlabel + analisis model vision) DAN dari durasi nyata tiap klip.
 * Kolom `what` menyimpan ringkasan isi supaya pemetaan ini bisa ditinjau
 * dan ditukar tanpa membuka berkas videonya.
 *
 * PENTING — `seconds`: panjang proxy yang benar-benar tersedia.
 * Sebagian rekaman hanya beberapa detik (ada yang 2,7 dtk). Karena itu
 * `seconds` wajib diisi dengan benar: Broll membatasi durasi tiap klip
 * pada nilai ini supaya gambar tidak membeku di frame terakhir.
 * Syarat yang harus tetap dijaga: jumlah `seconds` per scene HARUS lebih
 * besar daripada durasi scene (lihat src/timeline.ts).
 *
 * Klip yang SENGAJA tidak dipakai:
 *   VID-20261012-WA0018  (1280x720; diperbesar ke 1920 akan terlihat lembut)
 *   20261012_100004      (gambar blur total / tak terbaca)
 *   20261012_085626      (hanya 2,8 dtk — terlalu pendek untuk satu slot panel)
 *
 * Proxy 1080p dibuat oleh: scripts/make-proxies.sh
 */

export type Shot = {
  /** nama berkas di public/clips/<file>.mp4 */
  file: string;
  /** frame awal di dalam proxy (proxy sudah dipotong di titik terbaik) */
  trimBefore: number;
  /** panjang proxy yang tersedia, detik — dipakai Broll sebagai batas atas */
  seconds: number;
  /** bobot pembagian durasi panel di dalam satu scene */
  weight: number;
  /** isi klip — untuk peninjauan manusia, tidak dipakai saat render */
  what: string;
};

export type SceneMeta = {
  /** keterangan kecil di bawah panel */
  caption: string;
  clips: Shot[];
};

const s = (file: string, seconds: number, what: string): Shot => ({
  file,
  trimBefore: 0,
  seconds,
  weight: 1,
  what,
});

export const shots: Record<string, SceneMeta> = {
  intro: {
    caption: 'Pelayanan publik — RSUD H. Abdul Manap Kota Jambi',
    clips: [
      s(
        '20261012_100204',
        8.09,
        'Lobi rawat jalan: kursi hijau berisi pasien, deretan kursi roda terlipat, umbul-umbul merah putih',
      ),
      s(
        '20261012_085518',
        12,
        'Koridor rumah sakit yang panjang, pengunjung duduk di sepanjang dinding, satu orang berkursi roda',
      ),
      s(
        '20261012_085443',
        12,
        'Aula tunggu penuh pasien dan keluarga — berbagai usia, kursi hijau tersambung, sejumlah memakai masker',
      ),
    ],
  },
  acronym: {
    caption: 'Tujuh nilai, satu budaya kerja',
    clips: [
      s('20261012_085822', 12, 'Aula tunggu luas dan padat, layar TV di dinding, dekorasi hijau di langit-langit'),
      s('20261012_092444', 12, 'Ruang tunggu yang tenang dan tertib, kursi roda kosong di sisi kiri'),
    ],
  },
  'value-01': {
    caption: 'Informasi dan pendaftaran — melayani di depan',
    clips: [
      s('20261012_085657', 6.91, 'Loket INFORMASI/REGISTRATION dari samping: tiga perempuan berhijab dan seorang pria berbaju batik mengantre'),
      s('20261012_100318', 4.59, 'Seorang perempuan menyerahkan berkas melalui jendela layanan kaca'),
      s('20261012_092529', 12, 'Petugas berseragam kuning berdiri membantu pasien yang duduk, termasuk beberapa perempuan lanjut usia'),
    ],
  },
  'value-02': {
    caption: 'Tertib administrasi dan berkas layanan',
    clips: [
      s('20261012_100345', 12, 'Pegawai berseragam khaki ASN menangani berkas di meja layanan'),
      s('20261012_100754', 5.69, 'Ruang kerja dengan tumpukan dokumen dan kardus; dua pegawai berseragam khaki bekerja'),
      s('20261012_100806', 12, 'Meja penuh berkas warna-warni; tiga petugas bekerja berdampingan di baliknya'),
    ],
  },
  'value-03': {
    caption: 'Keterampilan teknis di laboratorium dan ruang periksa',
    clips: [
      s('20261012_095540', 8.1, 'Petugas laboratorium memilah tabung sampel dan kapas — kerja teknis yang teliti'),
      s('20261012_092630', 12, 'Perawat mengukur tekanan darah pasien di ruang periksa'),
      s('20261012_093138', 10.89, 'Pos perawat: tiga petugas bekerja di komputer di balik meja panjang'),
    ],
  },
  'value-04': {
    caption: 'Ruang konsultasi dan perawatan pasien',
    clips: [
      s('20261012_101521', 12, 'Petugas berhijab kuning tersenyum bekerja di meja yang penuh berkas'),
      s('20261012_092742', 12, 'Meja konsultasi: petugas berbincang dengan pasien di depan layar komputer'),
      s('20261012_093807', 12, 'Ruang rawat inap: pasien duduk di tempat tidur, perawat berhijab mendampingi'),
    ],
  },
  'value-05': {
    caption: 'Merah putih dan lambang pengabdian',
    clips: [
      s('20261012_095347', 7.2, 'Pos IGD: kursi merah, petugas bermasker di balik meja, bendera merah putih kecil di atas meja'),
      s('20261012_095602', 12, 'Meja layanan: bendera merah putih kecil, laptop, dan dokumen'),
      s('20261012_090146', 12, 'Prasasti peresmian marmer hitam dengan lambang rumah sakit di dinding'),
    ],
  },
  'value-06': {
    caption: 'Sistem informasi dan layanan digital',
    clips: [
      s('20261012_095758', 12, 'Dua petugas bermasker bekerja dengan laptop di meja layanan putih yang bersih'),
      s('20261012_100215', 12, 'Lobi rawat jalan: kursi roda di depan, layar antrean digital, dekorasi merah putih'),
      s('20261012_092132', 12, 'Dua petugas berhijab bekerja di komputer di balik loket pendaftaran'),
    ],
  },
  'value-07': {
    caption: 'Kerja tim di unit pelayanan',
    clips: [
      s('20261012_095524', 12, 'Empat petugas bermasker bekerja bersama di satu meja laboratorium'),
      s('20261012_093107', 12, 'Pos perawat: dua petugas mengisi formulir bersama di balik meja'),
      s('20261012_092554', 12, 'Koridor lobi: meja layanan dengan dua petugas melayani pengunjung, petugas keamanan di sisi kanan'),
    ],
  },
  outro: {
    caption: 'Melayani dengan setulus hati',
    clips: [
      s('20261012_093618', 12, 'Ruang rawat inap: perawat berjalan di antara tempat tidur, jendela berkelambu'),
      s('20261012_085927', 7.95, 'Halaman rumah sakit: papan informasi tinggi, sepeda motor terparkir, taman'),
      s('2.11', 6.21, 'Spanduk sambutan RSUD H. Abdul Manap Kota Jambi beserta foto wali kota dan wakil wali kota'),
    ],
  },
};
