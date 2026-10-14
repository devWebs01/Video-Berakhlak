import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Paper} from '../components/Paper';
import {Panel} from '../components/Panel';
import {Motif} from '../components/Motif';
import {Broll} from '../components/Broll';
import {Label, MaskLine, RuleDraw} from '../components/Kinetic';
import {Subtitles} from '../components/Subtitles';
import {logoHeroRect} from '../components/Logo';
import {body, serif, color} from '../theme';
import {layoutFor} from '../layout';
import {shots} from '../data/shots';

/**
 * Scene penutup, dua babak:
 *  1. pernyataan penutup (susunan editorial biasa),
 *  2. kartu akhir — lambang sudah bergerak ke tengah (diurus LogoOverlay,
 *     di luar TransitionSeries), lalu pita semboyan dan nama instansi muncul.
 * Komposisi ini hanya menyiapkan ruang dan lockup di bawah lambang.
 */
export const Outro: React.FC<{durationInFrames: number; landingAt: number}> = ({
  durationInFrames,
  landingAt,
}) => {
  const {width, height} = useVideoConfig();
  const L = layoutFor(width, height);
  const frame = useCurrentFrame();
  const meta = shots.outro;

  const ease = Easing.bezier(0.16, 1, 0.3, 1);

  // babak 1 memudar saat lambang mendarat
  const pre = interpolate(frame, [landingAt - 6, landingAt + 10], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // babak 2 muncul setelah lambang mendarat
  const post = interpolate(frame, [landingAt + 10, landingAt + 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  const hero = logoHeroRect(width, height);
  const ribbonTop = hero.top + hero.size + 46;
  const ribbonWidth = L.vertical ? 620 : 660;

  return (
    <Paper>
      {/* ---------- babak 1: pernyataan penutup ---------- */}
      <AbsoluteFill
        style={{
          left: L.safe,
          top: L.safe,
          right: L.safe,
          bottom: height - L.subTop + 30,
          opacity: pre,
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
            <Label delay={2}>Penutup</Label>

            <p
              style={{
                margin: 0,
                marginTop: L.vertical ? 24 : 34,
                fontFamily: serif,
                fontSize: L.vertical ? 44 : 52,
                lineHeight: 1.22,
                color: color.ink,
                letterSpacing: -0.5,
              }}
            >
              <MaskLine delay={8} duration={24}>
                <span>Kita bukan sekadar ASN —</span>
              </MaskLine>
              <MaskLine delay={16} duration={24}>
                <span>
                  kita ASN yang <span style={{color: color.red}}>bangga melayani bangsa</span>.
                </span>
              </MaskLine>
            </p>

            <div style={{marginTop: 28, display: 'flex', alignItems: 'center', gap: 18}}>
              <RuleDraw delay={26} width={L.vertical ? 96 : 130} thickness={3} />
              <span
                style={{
                  fontFamily: body,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 2.8,
                  textTransform: 'uppercase',
                  color: color.red,
                  opacity: interpolate(frame, [26, 38], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                }}
              >
                BerAKHLAK
              </span>
            </div>

            <p
              style={{
                margin: 0,
                marginTop: 30,
                maxWidth: 700,
                fontFamily: body,
                fontSize: L.vertical ? 32 : 34,
                fontWeight: 500,
                lineHeight: 1.4,
                color: color.inkSoft,
                opacity: interpolate(frame, [40, 62], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              Mari membangun negeri dengan akhlak, integritas, dan dedikasi.
            </p>

            <div
              style={{
                marginTop: 'auto',
                paddingTop: 28,
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                opacity: interpolate(frame, [54, 76], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              <Motif id="angso" size={L.motifSize} delay={54} opacity={0.9} />
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
                    maxWidth: 430,
                    fontFamily: body,
                    fontSize: 18,
                    fontWeight: 500,
                    color: color.inkSoft,
                    lineHeight: 1.35,
                  }}
                >
                  Dua angsa yang setia — lambang kesetiaan pada tanah Jambi.
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
              {/* panel hanya tampil sampai kartu akhir masuk, jadi durasi klip
                  dialokasikan pada jendela yang benar-benar terlihat */}
              <Broll
                clips={meta.clips}
                duration={Math.min(durationInFrames, landingAt + 10)}
                name="Outro"
              />
            </Panel>
          </div>
        </div>
      </AbsoluteFill>

      {/* ---------- babak 2: lockup kartu akhir ---------- */}
      <AbsoluteFill style={{opacity: post}}>
        <div
          style={{
            position: 'absolute',
            left: (width - ribbonWidth) / 2,
            top: ribbonTop,
            width: ribbonWidth,
          }}
        >
          {/* pita semboyan — oker sebagai BENTUK, huruf tetap tinta */}
          <div
            style={{
              position: 'relative',
              height: 76,
              background: color.ochre,
              clipPath:
                'polygon(0 50%, 26px 0, calc(100% - 26px) 0, 100% 50%, calc(100% - 26px) 100%, 26px 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: serif,
                fontSize: 34,
                color: color.ink,
                letterSpacing: 0.4,
              }}
            >
              Tanah Pilih Pesako Betuah
            </span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: ribbonTop + 110,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: body,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 3.4,
              textTransform: 'uppercase',
              color: color.ink,
            }}
          >
            Pemerintah Kota Jambi
          </div>
        </div>
      </AbsoluteFill>

      <Subtitles scene="outro" left={L.subLeft} top={L.subTop} maxWidth={L.subMaxWidth} size={L.subSize} />
    </Paper>
  );
};
