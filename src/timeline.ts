import {FPS, OVERLAP, TAIL} from './theme';
import {audioSeconds} from './data/durations';
import {narrationOrder} from './data/narration';

/**
 * Timeline adaptif — durasi tiap scene diturunkan dari durasi audio narasi
 * yang terukur, bukan angka tetap. Jadi kalau naskah TTS diubah, video
 * ikut menyesuaikan tanpa menyunting timeline secara manual.
 */

export const sceneIds: string[] = narrationOrder;

const FALLBACK_SECONDS = 10;

export const sceneFrames = (id: string) =>
  Math.ceil((audioSeconds[id] ?? FALLBACK_SECONDS) * FPS) + OVERLAP + TAIL;

export const sceneDurations: Record<string, number> = Object.fromEntries(
  narrationOrder.map((id) => [id, sceneFrames(id)]),
);

/** Scene terakhir tidak dipotong overlap di ekornya. */
export const totalFrames =
  narrationOrder.reduce((acc, id) => acc + sceneDurations[id], 0) -
  (narrationOrder.length - 1) * OVERLAP;

/** Frame global saat sebuah scene mulai tampil (setelah overlap masuk). */
export const sceneStart = (id: string) => {
  let acc = 0;
  for (const sid of narrationOrder) {
    if (sid === id) return acc;
    acc += sceneDurations[sid] - OVERLAP;
  }
  return acc;
};

/** Titik di mana lambang mulai bergerak ke tengah (62% masuk Outro). */
export const logoLandingGlobal = () => {
  const outroStart = sceneStart('outro');
  return outroStart + Math.round(sceneDurations.outro * 0.62);
};
