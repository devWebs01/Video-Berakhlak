import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {color} from '../theme';
import type {MotifId} from '../data/values';

/**
 * Motif batik Melayu Jambi sebagai GURATAN satu ketebalan (line-art),
 * bukan ikon clip-art berisi warna — seperti sketsa tangan di margin buku.
 *
 * Digambar "tumbuh" memakai strokeDashoffset + `pathLength={1}` supaya
 * panjang animasi tepat tanpa perlu mengukur path di browser.
 */

const STROKE = 2.1;

/** Daun runcing dari pusat (50,50) ke atas; dipakai berulang dengan rotasi. */
const LEAF = 'M50 50 C45.5 41 45.5 24 50 11 C54.5 24 54.5 41 50 50';

type Shape = {d: string; transform?: string};

/** Cincin bergerigi (durian). */
const spikedRing = (r: number, spikes: number, depth: number) => {
  const pts: string[] = [];
  for (let i = 0; i < spikes; i++) {
    const a1 = (Math.PI * 2 * i) / spikes;
    const a2 = (Math.PI * 2 * (i + 0.5)) / spikes;
    pts.push(`${(50 + r * Math.cos(a1)).toFixed(1)} ${(50 + r * Math.sin(a1)).toFixed(1)}`);
    pts.push(
      `${(50 + (r + depth) * Math.cos(a2)).toFixed(1)} ${(50 + (r + depth) * Math.sin(a2)).toFixed(1)}`,
    );
  }
  return `M${pts.join(' L')} Z`;
};

const shapesFor = (id: MotifId): Shape[] => {
  switch (id) {
    case 'tampuk':
      return [
        ...Array.from({length: 6}, (_, i) => ({
          d: LEAF,
          transform: `rotate(${60 * i} 50 50)`,
        })),
        {d: 'M50 50 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0'},
      ];
    case 'kaco':
      return [
        {d: 'M50 50 m-38 0 a38 38 0 1 0 76 0 a38 38 0 1 0 -76 0'},
        {d: 'M50 50 m-27 0 a27 27 0 1 0 54 0 a27 27 0 1 0 -54 0'},
        {d: 'M50 66 C41 57 34 51 34 44 A8 8 0 0 1 50 40 A8 8 0 0 1 66 44 C66 51 59 57 50 66 Z'},
      ];
    case 'durian':
      return [
        {d: spikedRing(34, 18, 7)},
        {d: 'M50 22 L50 78'},
        {d: 'M28 38 C40 46 60 46 72 38'},
      ];
    case 'melati':
      return [
        ...Array.from({length: 5}, (_, i) => ({
          d: 'M50 50 C43 40 42 26 50 14 C58 26 57 40 50 50',
          transform: `rotate(${-90 + 72 * i} 50 50)`,
        })),
        {d: 'M50 50 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0'},
      ];
    case 'keris':
      return [
        {d: 'M52 10 C44 22 60 28 52 40 C44 52 60 58 52 70 L50 78'},
        {d: 'M40 78 C44 74 58 74 62 78 L58 86 L44 86 Z'},
        {d: 'M44 86 L44 96 M58 86 L58 96'},
      ];
    case 'batanghari':
      return [
        {d: 'M8 34 C24 26 34 42 50 34 C66 26 76 42 92 34'},
        {d: 'M8 50 C24 42 34 58 50 50 C66 42 76 58 92 50'},
        {d: 'M8 66 C24 58 34 74 50 66 C66 58 76 74 92 66'},
        {d: 'M20 82 C32 76 40 88 52 82'},
      ];
    case 'itik':
      return [
        {d: 'M18 66 C26 52 42 52 50 66'},
        {d: 'M40 74 C48 60 64 60 72 74'},
        {d: 'M60 56 C68 42 84 42 92 56'},
        {d: 'M10 46 C18 32 34 32 42 46'},
      ];
    case 'angso':
      return [
        {d: 'M50 70 C34 70 20 58 20 42 C20 28 30 18 42 18 C50 18 50 26 50 32'},
        {d: 'M50 70 C66 70 80 58 80 42 C80 28 70 18 58 18 C50 18 50 26 50 32'},
        {d: 'M42 18 C38 12 40 6 46 6 M58 18 C62 12 60 6 54 6'},
      ];
  }
};

export const Motif: React.FC<{
  id: MotifId;
  size: number;
  /** frame lokal saat gambar mulai tumbuh */
  delay?: number;
  tone?: string;
  opacity?: number;
}> = ({id, size, delay = 0, tone = color.ink, opacity = 1}) => {
  const frame = useCurrentFrame();
  const shapes = shapesFor(id);
  const p = interpolate(frame, [delay, delay + 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{opacity, overflow: 'visible'}}>
      <g fill="none" stroke={tone} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
        {shapes.map((s, i) => {
          const start = (i / Math.max(shapes.length, 1)) * 0.4;
          const local = interpolate(p, [start, 1], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <path
              key={i}
              d={s.d}
              transform={s.transform}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - local}
            />
          );
        })}
      </g>
    </svg>
  );
};
