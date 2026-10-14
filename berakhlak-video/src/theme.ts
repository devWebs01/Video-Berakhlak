import {loadFont as loadJakarta} from '@remotion/google-fonts/PlusJakartaSans';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';

/**
 * Arah desain: "Editorial Paper" — kanvas kertas hangat, tinta indigo,
 * tipografi editorial.
 *
 * Warna diturunkan dari pewarna alami batik Jambi dan warna resmi
 * Lambang Kota Jambi (biru langit, cincin hijau, pita emas).
 */

export const heading = loadJakarta('normal', {
  weights: ['500', '600', '700', '800'],
  subsets: ['latin'],
}).fontFamily;

export const body = heading;

export const serif = loadSerif('italic', {
  weights: ['400'],
  subsets: ['latin'],
}).fontFamily;

export const color = {
  /** kanvas */
  paper: '#F6F1E6',
  paperDeep: '#EDE4D3',
  /** teks — kontras tinggi di atas kertas */
  ink: '#12233F',
  inkSoft: 'rgba(18, 35, 63, 0.64)',
  inkFaint: 'rgba(18, 35, 63, 0.34)',
  /** aksen — untuk BENTUK & GURATAN, bukan huruf */
  ochre: '#C9A227',
  sky: '#3BA3DB',
  emerald: '#1E7A3C',
  /** aksen teks yang aman (kontras >= 6:1 di atas kertas) */
  red: '#8C2F2F',
} as const;

export const FPS = 30;

/** Overlap transisi antar-scene (TransitionSeries). */
export const OVERLAP = 15;

/** Jeda setelah narasi selesai sebelum scene berakhir. */
export const TAIL = 15;

/** Margin aman. Vertical dibutuhkan lebih besar (UI Reels/TikTok). */
export const safeFor = (width: number, height: number) => (height > width ? 150 : 96);
