import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Paper} from '../components/Paper';
import {Panel} from '../components/Panel';
import {Motif} from '../components/Motif';
import {Broll} from '../components/Broll';
import {Rail} from '../components/Rail';
import {MaskLine, Mark, RuleDraw} from '../components/Kinetic';
import {Subtitles} from '../components/Subtitles';
import {body, color} from '../theme';
import {layoutFor, splitEmphasis} from '../layout';
import {values} from '../data/values';
import {shots} from '../data/shots';

/**
 * Scene satu nilai utama.
 * Gerak tanda tangan: singkapan panel + motif batik yang tumbuh.
 * Gerak struktural: guratan garis tinta.
 * Grup teks: judul lalu baris-baris penjelas.
 */
export const Nilai: React.FC<{index: number; durationInFrames: number}> = ({index, durationInFrames}) => {
  const v = values[index];
  const sceneId = `value-${v.id}`;
  const meta = shots[sceneId];
  const {width, height} = useVideoConfig();
  const L = layoutFor(width, height);
  const frame = useCurrentFrame();

  const ghost = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleWords = v.title.split(' ');

  return (
    <Paper>
      {/* area isi — disisakan ruang di bawah untuk pita subtitle */}
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
            gap: L.vertical ? 44 : 64,
            height: '100%',
          }}
        >
          {/* ---------- kolom teks ---------- */}
          <div
            style={{
              flex: L.vertical ? 1 : '0 0 750px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              order: L.vertical ? 2 : 1,
            }}
          >
            <Rail current={index + 1} delay={4} />

            <div style={{position: 'relative', marginTop: L.vertical ? 26 : 34}}>
              {/* angka hantu sebagai tekstur, bukan hiasan */}
              <div
                style={{
                  position: 'absolute',
                  right: -6,
                  top: -68,
                  fontFamily: body,
                  fontSize: L.vertical ? 200 : 300,
                  fontWeight: 800,
                  lineHeight: 1,
                  color: color.ink,
                  opacity: 0.05 * ghost,
                  letterSpacing: -10,
                }}
              >
                {v.id}
              </div>

              <h1
                style={{
                  margin: 0,
                  position: 'relative',
                  fontFamily: body,
                  fontSize: L.titleSize,
                  fontWeight: 800,
                  lineHeight: 1.06,
                  letterSpacing: -1.6,
                  color: color.ink,
                }}
              >
                {titleWords.map((w, i) => (
                  <MaskLine key={i} delay={6 + i * 5}>
                    {w}
                    {i < titleWords.length - 1 ? '\u00A0' : ''}
                  </MaskLine>
                ))}
              </h1>
            </div>

            <div style={{marginTop: 24, display: 'flex', alignItems: 'center', gap: 16}}>
              <RuleDraw delay={16} width={L.vertical ? 120 : 150} thickness={3} />
              <span
                style={{
                  fontFamily: body,
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: 2.6,
                  textTransform: 'uppercase',
                  color: color.red,
                  opacity: interpolate(frame, [16, 28], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                }}
              >
                Nilai {v.id}
              </span>
            </div>

            {/* baris-baris penjelas */}
            <div style={{marginTop: L.vertical ? 40 : 46, display: 'flex', flexDirection: 'column', gap: 22}}>
              {v.lines.map((line, i) => {
                const at = Math.round(line.at * durationInFrames);
                const parts = splitEmphasis(line.text, line.emphasis);
                return (
                  <div key={i} style={{display: 'flex', gap: 18}}>
                    <div
                      style={{
                        width: 3,
                        flexShrink: 0,
                        background: line.warn ? color.red : color.ochre,
                        transformOrigin: 'top center',
                        transform: `scaleY(${interpolate(frame, [at, at + 12], [0, 1], {
                          extrapolateLeft: 'clamp',
                          extrapolateRight: 'clamp',
                        })})`,
                      }}
                    />
                    <div
                      style={{
                        fontFamily: body,
                        fontSize: L.lineSize,
                        fontWeight: line.warn ? 700 : 600,
                        lineHeight: 1.3,
                        color: line.warn ? color.red : color.ink,
                        letterSpacing: -0.2,
                      }}
                    >
                      <MaskLine delay={at}>
                        {parts.map((p, k) =>
                          p.mark ? (
                            <Mark key={k} delay={at + 10}>
                              {p.text}
                            </Mark>
                          ) : (
                            <React.Fragment key={k}>{p.text}</React.Fragment>
                          ),
                        )}
                      </MaskLine>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* catatan motif batik — kaki kolom teks */}
            <div
              style={{
                marginTop: 'auto',
                paddingTop: 30,
                display: 'flex',
                alignItems: 'center',
                gap: 22,
              }}
            >
              <Motif id={v.motif} size={L.motifSize} delay={26} tone={color.ink} opacity={0.9} />
              <div>
                <div
                  style={{
                    fontFamily: body,
                    fontSize: 17,
                    fontWeight: 700,
                    letterSpacing: 2.2,
                    textTransform: 'uppercase',
                    color: color.ink,
                    opacity: interpolate(frame, [30, 44], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                  }}
                >
                  {v.motifName}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    maxWidth: 460,
                    fontFamily: body,
                    fontSize: 18,
                    fontWeight: 500,
                    lineHeight: 1.35,
                    color: color.inkSoft,
                    opacity: interpolate(frame, [36, 52], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                  }}
                >
                  {v.motifMeaning}
                </div>
              </div>
            </div>
          </div>

          {/* ---------- kolom footage ---------- */}
          <div style={{flex: 1, display: 'flex', minHeight: 0, order: L.vertical ? 1 : 2}}>
            <Panel
              style={{width: '100%', height: L.panelHeight, alignSelf: 'flex-start'}}
              tag="Dokumentasi 2026"
              caption={meta.caption}
              delay={10}
            >
              <Broll clips={meta.clips} duration={durationInFrames} name={`Nilai ${v.id}`} />
            </Panel>
          </div>
        </div>
      </AbsoluteFill>

      <Subtitles scene={sceneId} left={L.subLeft} top={L.subTop} maxWidth={L.subMaxWidth} size={L.subSize} />
    </Paper>
  );
};
