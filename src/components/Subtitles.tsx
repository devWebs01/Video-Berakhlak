import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {body, color} from '../theme';
import {captionsByScene} from '../data/captions';

/**
 * Subtitle bakar (burn-in) dari word-boundary Edge TTS.
 * Gaya editorial: tanpa plakat, huruf tinta di atas kertas, ditandai
 * satu batang oker tipis di kiri — bukan kapsul gelap ala template.
 *
 * Pita subtitle sengaja dibatasi lebarnya supaya tidak menabrak
 * lambang Kota Jambi di kanan bawah.
 */
export const Subtitles: React.FC<{
  scene: string;
  /** lebar maksimum pita (px) */
  maxWidth: number;
  /** posisi pita dari kiri kanvas */
  left: number;
  /** posisi pita dari atas kanvas */
  top: number;
  size?: number;
}> = ({scene, maxWidth, left, top, size = 34}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;

  const captions = captionsByScene[scene];
  if (!captions) return null;

  const active = captions.find((c) => ms >= c.startMs && ms < c.endMs);
  if (!active) return null;

  const fadeIn = interpolate(ms, [active.startMs, active.startMs + 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(ms, [active.endMs - 140, active.endMs], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const rise = interpolate(ms, [active.startMs, active.startMs + 200], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: maxWidth,
        display: 'flex',
        gap: 18,
        opacity,
        transform: `translateY(${rise}px)`,
      }}
    >
      <div style={{width: 4, background: color.ochre, flexShrink: 0}} />
      <div
        style={{
          fontFamily: body,
          fontSize: size,
          fontWeight: 600,
          lineHeight: 1.34,
          letterSpacing: 0.1,
          color: color.ink,
        }}
      >
        {active.text}
      </div>
    </div>
  );
};
