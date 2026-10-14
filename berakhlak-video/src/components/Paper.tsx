import React from 'react';
import {AbsoluteFill} from 'remotion';
import {color} from '../theme';

/**
 * Kanvas "kertas": dasar krem hangat + gradien cahaya + butiran halus.
 * Butiran dibuat dari SVG feTurbulence — deterministik, tanpa berkas aset.
 */
export const Paper: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: color.paper}}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 105% at 12% 4%, ${color.paperDeep} 0%, rgba(246, 241, 230, 0) 60%)`,
      }}
    />
    <AbsoluteFill>
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="paper-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed={7} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#paper-grain)" opacity={0.05} />
      </svg>
    </AbsoluteFill>
    {children}
  </AbsoluteFill>
);
