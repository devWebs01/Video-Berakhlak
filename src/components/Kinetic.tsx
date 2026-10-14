import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {color} from '../theme';

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * Perpustakaan gerak utama. Aturannya ketat: satu scene hanya memakai
 * satu gerak tanda tangan + satu gerak struktural + satu grup teks.
 * Semua nilai animasi ditulis inline dengan rentang dan easing eksplisit.
 */

/** Baris yang tersingkap dari balik topeng (mask reveal). */
export const MaskLine: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({children, delay = 0, duration = 20, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <span style={{display: 'block', overflow: 'hidden', paddingBottom: '0.06em'}}>
      <span
        style={{
          display: 'block',
          transform: `translateY(${(1 - p) * 105}%)`,
          ...style,
        }}
      >
        {children}
      </span>
    </span>
  );
};

/**
 * Sorotan oker yang menyapu dari kiri di belakang kata.
 * Oker hanya dipakai sebagai BENTUK; hurufnya tetap tinta.
 * Kontras tinta di atas oker ≈ 6:1 — masih terbaca.
 */
export const Mark: React.FC<{
  children: React.ReactNode;
  delay?: number;
  tone?: string;
}> = ({children, delay = 0, tone = color.ochre}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <span style={{position: 'relative', display: 'inline-block', padding: '0 0.18em'}}>
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '18%',
          bottom: '10%',
          background: tone,
          transformOrigin: 'left center',
          transform: `scaleX(${p})`,
        }}
      />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

/** Guratan garis tinta yang menggambar dari kiri. */
export const RuleDraw: React.FC<{
  delay?: number;
  width: number;
  thickness?: number;
  tone?: string;
  vertical?: boolean;
}> = ({delay = 0, width, thickness = 2, tone = color.ink, vertical = false}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

  return (
    <div
      style={
        vertical
          ? {width: thickness, height: width * p, background: tone}
          : {height: thickness, width: width * p, background: tone}
      }
    />
  );
};

/** Teks kecil bergaya label editorial (huruf kapital, jarak lebar). */
export const Label: React.FC<{
  children: React.ReactNode;
  delay?: number;
  tone?: string;
  size?: number;
}> = ({children, delay = 0, tone = color.red, size = 16}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        fontSize: size,
        fontWeight: 700,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: tone,
        opacity: p,
      }}
    >
      {children}
    </div>
  );
};
