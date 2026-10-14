import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Paper} from '../components/Paper';
import {Panel} from '../components/Panel';
import {Motif} from '../components/Motif';
import {Broll} from '../components/Broll';
import {MaskLine, RuleDraw, Label} from '../components/Kinetic';
import {Subtitles} from '../components/Subtitles';
import {body, serif, color} from '../theme';
import {layoutFor} from '../layout';
import {shots} from '../data/shots';

/**
 * Scene pembuka. Gerak tanda tangan: wordmark tersingkap dari balik topeng
 * dan motif Angso Duo yang tumbuh di kaki halaman.
 */
export const Intro: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const {width, height} = useVideoConfig();
  const L = layoutFor(width, height);
  const frame = useCurrentFrame();
  const meta = shots.intro;

  const fade = (from: number, dur = 18) =>
    interpolate(frame, [from, from + dur], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const wordSize = L.vertical ? 96 : 128;

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
            gap: L.vertical ? 44 : 64,
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
            <Label delay={2}>Pemerintah Kota Jambi</Label>

            <h1
              style={{
                margin: 0,
                marginTop: L.vertical ? 26 : 40,
                fontFamily: body,
                fontSize: wordSize,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -5,
                color: color.ink,
                whiteSpace: 'nowrap',
              }}
            >
              <MaskLine delay={8} duration={26}>
                <span style={{fontWeight: 600}}>Ber</span>
                <span style={{color: color.ink}}>AKHLAK</span>
              </MaskLine>
            </h1>

            <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 18}}>
              <RuleDraw delay={26} width={L.vertical ? 96 : 130} thickness={3} />
              <span
                style={{
                  fontFamily: body,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 2.8,
                  textTransform: 'uppercase',
                  color: color.red,
                  opacity: fade(26),
                }}
              >
                Nilai Dasar ASN
              </span>
            </div>

            <p
              style={{
                margin: 0,
                marginTop: 34,
                maxWidth: 700,
                fontFamily: body,
                fontSize: L.vertical ? 34 : 36,
                fontWeight: 500,
                lineHeight: 1.4,
                color: color.inkSoft,
                opacity: fade(46, 22),
                transform: `translateY(${interpolate(frame, [46, 68], [12, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })}px)`,
              }}
            >
              Budaya kerja yang kuat, profesional, dan berintegritas — untuk pelayanan
              yang lebih baik kepada masyarakat.
            </p>

            <div
              style={{
                marginTop: 'auto',
                paddingTop: 28,
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                opacity: fade(58, 24),
              }}
            >
              <Motif id="angso" size={L.motifSize} delay={58} opacity={0.9} />
              <div>
                <div
                  style={{
                    fontFamily: body,
                    fontSize: 17,
                    fontWeight: 700,
                    letterSpacing: 2.2,
                    textTransform: 'uppercase',
                    color: color.ink,
                  }}
                >
                  Angso Duo
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: serif,
                    fontSize: 21,
                    color: color.inkSoft,
                  }}
                >
                  Tanah Pilih Pesako Betuah
                </div>
              </div>
            </div>
          </div>

          <div style={{flex: 1, display: 'flex', minHeight: 0, order: L.vertical ? 1 : 2}}>
            <Panel
              style={{width: '100%', height: L.panelHeight, alignSelf: 'flex-start'}}
              tag="Dokumentasi 2026"
              caption={meta.caption}
              delay={6}
            >
              <Broll clips={meta.clips} duration={durationInFrames} name="Intro" />
            </Panel>
          </div>
        </div>
      </AbsoluteFill>

      <Subtitles scene="intro" left={L.subLeft} top={L.subTop} maxWidth={L.subMaxWidth} size={L.subSize} />
    </Paper>
  );
};
