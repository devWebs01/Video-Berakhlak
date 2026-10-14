import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {color} from '../theme';

/**
 * Lambang Kota Jambi sebagai satu-satunya elemen overlay yang hidup
 * DI LUAR TransitionSeries: muncul sebagai tanda air di kanan bawah
 * sepanjang video, lalu di Outro bergerak ke tengah dan membesar.
 *
 * Sesuai ketentuan PD-IDGov, lambang dipakai APA ADANYA —
 * hanya dipindah dan diperbesar (uniform scale), tidak diwarnai ulang
 * dan tidak diubah proporsinya.
 */

const watermarkSize = (vertical: boolean) => (vertical ? 96 : 72);
const heroSize = (vertical: boolean) => (vertical ? 340 : 300);
const marginOf = (vertical: boolean) => (vertical ? 110 : 96);

export const LOGO_SRC = 'brand/lambang-kota-jambi.png';

/** Kotak (left/top/size) lambang saat berada di tengah pada Outro. */
export const logoHeroRect = (width: number, height: number) => {
  const vertical = height > width;
  const size = heroSize(vertical);
  const lift = vertical ? 250 : 130;
  return {
    size,
    left: width / 2 - size / 2,
    top: height / 2 - size / 2 - lift,
  };
};

export const LogoOverlay: React.FC<{
  /** frame global saat Outro dimulai */
  outroStart: number;
}> = ({outroStart}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const vertical = height > width;

  const wm = watermarkSize(vertical);
  const hero = heroSize(vertical);
  const margin = marginOf(vertical);

  // Kemunculan pertama (halus, di awal Intro)
  const appear = interpolate(frame, [22, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Perpindahan ke tengah, dimulai bersama Outro
  const move = spring({
    fps,
    frame: frame - outroStart,
    config: {damping: 20, stiffness: 88},
    durationInFrames: 36,
  });

  const watermarkLeft = width - margin - wm;
  const watermarkTop = height - margin - wm;
  const heroRect = logoHeroRect(width, height);

  const size = interpolate(move, [0, 1], [wm, hero]);
  const left = interpolate(move, [0, 1], [watermarkLeft, heroRect.left]);
  const top = interpolate(move, [0, 1], [watermarkTop, heroRect.top]);

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        opacity: appear,
        // bayangan sangat tipis supaya lambang tetap terbaca di kanvas kertas
        filter: 'drop-shadow(0 6px 18px rgba(18, 35, 63, 0.18))',
      }}
    >
      <Img src={staticFile(LOGO_SRC)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      {/* garis tinta tipis di bawah lambang saat sudah membesar */}
      <div
        style={{
          position: 'absolute',
          left: '8%',
          right: '8%',
          bottom: -14,
          height: 2,
          background: color.ink,
          opacity: interpolate(move, [0.55, 1], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </div>
  );
};
