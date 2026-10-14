import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {body, color} from '../theme';

const CROP: Record<string, string> = {
  tl: 'M22 2 H2 V22',
  tr: 'M4 2 H24 V22',
  bl: 'M2 4 V24 H22',
  br: 'M24 4 V24 H4',
};

const CROPS = [
  ['tl', {top: -20, left: -20}],
  ['tr', {top: -20, right: -20}],
  ['bl', {bottom: -20, left: -20}],
  ['br', {bottom: -20, right: -20}],
] as const;

/**
 * Panel footage: jendela bersudut tajam, garis tinta 2px, tanda potong
 * (crop mark) di keempat sudut, plus keterangan foto kecil di bawahnya.
 *
 * Footage dinilai ulang (grade) ke arah kertas — saturasi diturunkan dan
 * sedikit dihangatkan supaya rekaman menyatu dengan kanvas, bukan menempel.
 */
export const Panel: React.FC<{
  caption: string;
  tag?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
}> = ({caption, tag, children, style, delay = 0}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [delay, delay + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{display: 'flex', flexDirection: 'column', position: 'relative', ...style}}>
      <div style={{position: 'relative', flex: 1, minHeight: 0}}>
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: color.ink}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              filter: 'saturate(0.82) contrast(1.06) sepia(0.14) brightness(1.02)',
              // singkapan horizontal: pola potong kiri-ke-kanan
              clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
            }}
          >
            {children}
          </div>
          <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 0 2px ${color.ink}`}} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: color.paper,
              opacity: 0.06,
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        {CROPS.map(([key, pos]) => (
          <svg
            key={key}
            width={26}
            height={26}
            viewBox="0 0 26 26"
            style={{position: 'absolute', ...pos, opacity: reveal}}
          >
            <path d={CROP[key]} fill="none" stroke={color.ink} strokeWidth={2} />
          </svg>
        ))}
      </div>

      <div style={{marginTop: 30, opacity: reveal, flexShrink: 0}}>
        {tag ? (
          <div
            style={{
              fontFamily: body,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 2.4,
              textTransform: 'uppercase',
              color: color.red,
              marginBottom: 8,
            }}
          >
            {tag}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: body,
            fontSize: 20,
            fontWeight: 500,
            color: color.inkSoft,
            letterSpacing: 0.2,
            lineHeight: 1.3,
          }}
        >
          {caption}
        </div>
      </div>
    </div>
  );
};
