import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Paper} from '../components/Paper';
import {Panel} from '../components/Panel';
import {Broll} from '../components/Broll';
import {Label, MaskLine, RuleDraw} from '../components/Kinetic';
import {Subtitles} from '../components/Subtitles';
import {body, color} from '../theme';
import {layoutFor} from '../layout';
import {values} from '../data/values';
import {shots} from '../data/shots';

/**
 * Scene akronim: tujuh huruf dibuka satu per satu, dijalankan oleh narasi
 * yang memang menyebut ketujuh nilai secara berurutan.
 */
export const Akronim: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const {width, height} = useVideoConfig();
  const L = layoutFor(width, height);
  const frame = useCurrentFrame();
  const meta = shots.acronym;

  const letters = ['B', 'A', 'K', 'H', 'L', 'A', 'K'];

  return (
    <Paper>
      <AbsoluteFill
        style={{
          left: L.safe,
          top: L.safe,
          right: L.safe,
          bottom: height - L.subTop + 30,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: L.vertical ? 'column' : 'row',
            gap: L.vertical ? 40 : 64,
            height: '100%',
          }}
        >
          <div
            style={{
              flex: L.vertical ? 1 : '0 0 750px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              order: L.vertical ? 2 : 1,
            }}
          >
            <Label delay={2}>Akronim</Label>

            <h1
              style={{
                margin: 0,
                marginTop: L.vertical ? 20 : 30,
                fontFamily: body,
                fontSize: L.titleSize,
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: -1.6,
                color: color.ink,
              }}
            >
              <MaskLine delay={6}>Tujuh Nilai</MaskLine>
              <MaskLine delay={11}>Utama</MaskLine>
            </h1>

            <div style={{marginTop: 22}}>
              <RuleDraw delay={18} width={150} thickness={3} />
            </div>

            <div
              style={{
                marginTop: L.vertical ? 30 : 40,
                display: 'flex',
                flexDirection: 'column',
                gap: L.vertical ? 14 : 16,
              }}
            >
              {values.map((v, i) => {
                // sebar kemunculan mengikuti narasi (0.30 -> 0.86 durasi scene)
                const at = Math.round((0.3 + i * 0.09) * durationInFrames);
                const p = interpolate(frame, [at, at + 14], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                });
                return (
                  <div
                    key={v.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      opacity: interpolate(frame, [at, at + 10], [0, 1], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                      }),
                      transform: `translateX(${(1 - p) * -18}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: L.vertical ? 42 : 46,
                        height: L.vertical ? 42 : 46,
                        flexShrink: 0,
                        background: color.ochre,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: body,
                        fontSize: L.vertical ? 24 : 26,
                        fontWeight: 800,
                        color: color.ink,
                      }}
                    >
                      {letters[i]}
                    </div>
                    <div
                      style={{
                        fontFamily: body,
                        fontSize: L.vertical ? 30 : 33,
                        fontWeight: 600,
                        color: color.ink,
                        letterSpacing: -0.3,
                      }}
                    >
                      {v.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{flex: 1, display: 'flex', minHeight: 0, order: L.vertical ? 1 : 2}}>
            <Panel
              style={{width: '100%', height: L.panelHeight, alignSelf: 'flex-start'}}
              tag="Dokumentasi 2026"
              caption={meta.caption}
              delay={8}
            >
              <Broll clips={meta.clips} duration={durationInFrames} name="Akronim" />
            </Panel>
          </div>
        </div>
      </AbsoluteFill>

      <Subtitles scene="acronym" left={L.subLeft} top={L.subTop} maxWidth={L.subMaxWidth} size={L.subSize} />
    </Paper>
  );
};
