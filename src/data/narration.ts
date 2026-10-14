import raw from './narration.json';

/**
 * Narasi TTS BerAKHLAK — sumber tunggal untuk voiceover.
 *
 * Naskah UTUH (natural) dari materi asli, sudah dibersihkan salah ketik.
 * Data ada di `narration.json` supaya `scripts/generate-voiceover.sh`
 * bisa membacanya juga (tanpa duplikasi teks).
 *
 * Durasi scene TIDAK di-hardcode — diambil dari durasi audio asli
 * (`src/data/durations.ts`, dihasilkan oleh script yang sama).
 */

export type NarrationScene = {
  sequence: string;
  text: string;
};

type NarrationFile = {
  voice: string;
  rate: string;
  order: string[];
  scenes: Record<string, NarrationScene>;
};

const data = raw as NarrationFile;

export const TTS_VOICE = data.voice;
export const TTS_RATE = data.rate;
export const narrationOrder: string[] = data.order;
export const narration: Record<string, NarrationScene> = data.scenes;
