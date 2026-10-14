import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {body, color} from '../theme';

/**
 * Rel kemajuan 7 nilai. Setiap nilai yang dilewati menambah satu penanda —
 * dipakai juga sebagai pemicu SFX \"tick\" di timeline.
 */
export const Rail: React.FC<{
  /** 1..7 — nilai yang sedang tampil */
  current: number;
  total?: number;
  delay?: number;
  size?: number;
}> = ({current, total = 7, delay = 0, size = 26}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 8}}>
      {Array.from({length: total}).map((_, i) => {
        const n = i + 1;
        const active = n === current;
        const passed = n < current;
        const grow = interpolate(frame, [delay + i * 3, delay + i * 3 + 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={n}
            style={{
              width: size,
              height: active ? 12 : passed ? 6 : 3,
              background: active ? color.ink : passed ? color.inkFaint : 'rgba(18, 35, 63, 0.16)',
              transformOrigin: 'bottom center',
              transform: `scaleY(${grow})`,
            }}
          />
        );
      })}
      <div
        style={{
          fontFamily: body,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 2,
          color: color.inkSoft,
          marginLeft: 10,
          lineHeight: 1,
        }}
      >
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
    </div>
  );
};
