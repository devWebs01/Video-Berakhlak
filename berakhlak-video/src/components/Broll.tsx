import React from 'react';
import {Sequence, staticFile, useVideoConfig} from 'remotion';
import {Video} from '@remotion/media';
import type {Shot} from '../data/shots';

/**
 * Bagi durasi panel di antara beberapa klip footage.
 *
 * Masalah nyata yang harus ditangani: sebagian rekaman sumber hanya beberapa
 * detik (ada yang 2,7 dtk), sedangkan satu panel bisa butuh 9 dtk. Kalau
 * pembagian hanya mengikuti bobot, klip pendek akan kehabisan gambar dan
 * frame terakhirnya membeku di layar — terlihat seperti video rusak.
 *
 * Jadi alurnya: bagi sesuai bobot -> BATASI tiap klip pada `seconds` yang
 * benar-benar tersedia -> alihkan kelebihan ke klip lain yang masih punya
 * sisa, berulang sampai tidak ada lagi yang melampaui batas.
 */
const allocate = (caps: number[], weights: number[], duration: number) => {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const alloc = weights.map((w) => (w / totalWeight) * duration);

  for (let iter = 0; iter < 12; iter++) {
    let deficit = 0;
    const room = alloc.map((a, i) => {
      if (a > caps[i]) {
        deficit += a - caps[i];
        alloc[i] = caps[i];
      }
      return Math.max(0, caps[i] - alloc[i]);
    });
    if (deficit < 1) break;
    const totalRoom = room.reduce((a, b) => a + b, 0);
    if (totalRoom < 1) break; // tidak ada sisa: loop akan menutup kekurangan
    for (let i = 0; i < alloc.length; i++) {
      alloc[i] += (room[i] / totalRoom) * deficit;
    }
  }

  // pembulatan: pastikan jumlahnya persis sama dengan durasi panel
  const out = alloc.map((a) => Math.floor(a));
  let rest = duration - out.reduce((a, b) => a + b, 0);
  const byFraction = alloc
    .map((a, i) => ({i, frac: a - Math.floor(a)}))
    .sort((a, b) => b.frac - a.frac);
  for (const {i} of byFraction) {
    if (rest <= 0) break;
    if (out[i] < caps[i]) {
      out[i] += 1;
      rest -= 1;
    }
  }
  if (rest > 0) out[out.length - 1] += rest;

  return out;
};

/**
 * Deretan klip di dalam satu panel.
 * Setiap klip adalah node JSX tersendiri dengan nama dan waktunya sendiri
 * supaya bisa dipilih dan digeser satu per satu di Remotion Studio.
 *
 * HARD CUT antar klip di dalam scene (sesuai keputusan desain: transisi
 * halus hanya dipakai ANTAR scene).
 */
export const Broll: React.FC<{
  clips: Shot[];
  /** total durasi panel, frame */
  duration: number;
  name?: string;
}> = ({clips, duration, name = 'Shot'}) => {
  const {fps} = useVideoConfig();

  const caps = clips.map((c) => Math.max(1, Math.floor(c.seconds * fps)));
  const lengths = allocate(
    caps,
    clips.map((c) => c.weight),
    duration,
  );

  let from = 0;
  return (
    <>
      {clips.map((c, i) => {
        const start = from;
        from += lengths[i];
        return (
          <Sequence
            key={`${c.file}-${i}`}
            from={start}
            durationInFrames={lengths[i]}
            name={`${name} ${i + 1}`}
          >
            <Video
              name={c.file}
              src={staticFile(`clips/${c.file}.mp4`)}
              muted
              objectFit="cover"
              trimBefore={c.trimBefore}
              // jaring pengaman: kalau alokasi melampaui stok gambar,
              // mengulang jauh lebih baik daripada frame beku
              loop
              premountFor={30}
              style={{width: '100%', height: '100%'}}
            />
          </Sequence>
        );
      })}
    </>
  );
};
