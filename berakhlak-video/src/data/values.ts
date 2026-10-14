/**
 * 7 nilai utama BerAKHLAK + pemetaan motif batik Melayu Jambi.
 *
 * Motif dipilih karena maknanya memang cocok dengan nilainya — bukan
 * hiasan generik. Sumber makna: kajian Batik Jambi (Durian Pecah, Angso Duo,
 * Kaco Piring, Tampuk Manggis, Bungo Melati) & arti Lambang Kota Jambi
 * (Angso Duo, Keris Siginjai, garis Batanghari).
 */

export type MotifId =
  | 'angso'
  | 'tampuk'
  | 'kaco'
  | 'durian'
  | 'melati'
  | 'keris'
  | 'batanghari'
  | 'itik';

export type ValueLine = {
  text: string;
  /** Posisi kemunculan sebagai fraksi durasi scene (0..1) — adaptif. */
  at: number;
  /** Kata yang diberi sorotan oker. */
  emphasis?: string;
  /** Baris peringatan (merah sultan) — dipakai di Akuntabel. */
  warn?: boolean;
};

export type Value = {
  /** '01'..'07' */
  id: string;
  title: string;
  motif: MotifId;
  motifName: string;
  motifMeaning: string;
  lines: ValueLine[];
};

export const values: Value[] = [
  {
    id: '01',
    title: 'Berorientasi Pelayanan',
    motif: 'tampuk',
    motifName: 'Tampuk Manggis',
    motifMeaning: 'Memberi dan menghidupi — pelayanan yang menguatkan masyarakat.',
    lines: [
      {text: 'Proaktif memahami kebutuhan masyarakat', at: 0.12, emphasis: 'Proaktif'},
      {text: 'Melayani dengan ramah dan solutif', at: 0.38},
      {text: 'Memberikan informasi yang akurat', at: 0.62, emphasis: 'akurat'},
      {text: 'Pelayanan merata, tanpa membeda-bedakan', at: 0.82, emphasis: 'merata'},
    ],
  },
  {
    id: '02',
    title: 'Akuntabel',
    motif: 'kaco',
    motifName: 'Kaco Piring',
    motifMeaning: 'Tekad kuat dengan hati yang bersih dan terbuka.',
    lines: [
      {text: 'Menjunjung kejujuran, disiplin, integritas', at: 0.12, emphasis: 'kejujuran'},
      {text: 'Setiap keputusan harus objektif', at: 0.38},
      {text: 'Setiap tugas dipertanggungjawabkan', at: 0.6},
      {text: 'Tanpa penyalahgunaan wewenang', at: 0.8, warn: true},
    ],
  },
  {
    id: '03',
    title: 'Kompeten',
    motif: 'durian',
    motifName: 'Durian Pecah',
    motifMeaning: 'Iman dan ilmu tidak terpisahkan — kerja berbasis pengetahuan.',
    lines: [
      {text: 'Dunia terus berubah', at: 0.12},
      {text: 'Selalu belajar dan mengembangkan diri', at: 0.34, emphasis: 'belajar'},
      {text: 'Tumbuh bersama rekan kerja', at: 0.6},
      {text: 'Kinerja yang berkualitas', at: 0.8, emphasis: 'berkualitas'},
    ],
  },
  {
    id: '04',
    title: 'Harmonis',
    motif: 'melati',
    motifName: 'Bungo Melati',
    motifMeaning: 'Keanggunan dan kesantunan dalam hubungan kerja.',
    lines: [
      {text: 'Hubungan kerja yang sehat dan adil', at: 0.14},
      {text: 'Penuh rasa hormat', at: 0.4},
      {text: 'Menghargai perbedaan, menolong sesama', at: 0.6, emphasis: 'Menghargai'},
      {text: 'Selesaikan konflik dengan bijak', at: 0.8},
    ],
  },
  {
    id: '05',
    title: 'Loyal',
    motif: 'keris',
    motifName: 'Keris Siginjai',
    motifMeaning: 'Kebesaran dan kesetiaan — pusaka Kerajaan Melayu Jambi.',
    lines: [
      {text: 'Memegang teguh Pancasila dan UUD 1945', at: 0.12},
      {text: 'Setia pada NKRI dan pemerintah yang sah', at: 0.36},
      {text: 'Menjaga nama baik instansi', at: 0.6},
      {text: 'Laksanakan keputusan dengan tanggung jawab', at: 0.8},
    ],
  },
  {
    id: '06',
    title: 'Adaptif',
    motif: 'batanghari',
    motifName: 'Batanghari',
    motifMeaning: 'Sungai yang mengalir — kemampuan menyesuaikan diri.',
    lines: [
      {text: 'Menyesuaikan diri di era perubahan', at: 0.12, emphasis: 'Menyesuaikan diri'},
      {text: 'Menguasai teknologi', at: 0.4},
      {text: 'Menghadirkan inovasi', at: 0.6, emphasis: 'inovasi'},
      {text: 'Berani menyampaikan ide dan solusi', at: 0.8},
    ],
  },
  {
    id: '07',
    title: 'Kolaboratif',
    motif: 'itik',
    motifName: 'Itik Sekawan',
    motifMeaning: 'Berkawan dan bergotong royong mencapai tujuan bersama.',
    lines: [
      {text: 'Tidak ada keberhasilan tanpa kerja sama', at: 0.14},
      {text: 'Terbuka bagi semua pihak', at: 0.42},
      {text: 'Bersinergi mencapai tujuan bersama', at: 0.62, emphasis: 'Bersinergi'},
      {text: 'Kuat di dalam tim dan dengan stakeholder', at: 0.82},
    ],
  },
];
