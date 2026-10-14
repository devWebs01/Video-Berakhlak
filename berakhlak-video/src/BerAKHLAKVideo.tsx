import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {Audio} from '@remotion/media';
import {Intro} from './compositions/Intro';
import {Akronim} from './compositions/Akronim';
import {Nilai} from './compositions/Nilai';
import {Outro} from './compositions/Outro';
import {LogoOverlay} from './components/Logo';
import {values} from './data/values';
import {sceneDurations, sceneIds, sceneStart, logoLandingGlobal} from './timeline';
import {OVERLAP, color} from './theme';

/**
 * Susunan waktu utama.
 *
 * Audio: hanya narasi + efek suara pendek. TIDAK ada musik latar —
 * keputusan sadar supaya video tidak terasa seperti template.
 *
 * Lambang Kota Jambi ada DI LUAR TransitionSeries supaya tidak ikut
 * terpotong transisi; ia hidup terus dan baru bergerak di Outro.
 */
export const BerAKHLAKVideo: React.FC<{sfx?: boolean}> = ({sfx = true}) => {
  const {width, height} = useVideoConfig();

  const landingLocal = Math.round(sceneDurations.outro * 0.62);
  const landingGlobal = logoLandingGlobal();

  // batas antar scene (dipakai untuk menaruh efek suara transisi)
  const boundaries = sceneIds.slice(1).map((id) => sceneStart(id));

  const transitionAt = (i: number) => {
    // i = indeks transisi (0..8), antara scene i dan i+1
    if (i === 0) {
      // satu-satunya clockWipe di seluruh video
      return (
        <TransitionSeries.Transition
          presentation={clockWipe({width, height})}
          timing={linearTiming({durationInFrames: 18})}
        />
      );
    }
    if (i === 1 || i === sceneIds.length - 2) {
      // index transisi tertinggi = sceneIds.length - 2 (jumlah scene - 1 transisi)
      return (
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: OVERLAP})}
        />
      );
    }
    return (
      <TransitionSeries.Transition
        presentation={slide({direction: 'from-right'})}
        timing={linearTiming({durationInFrames: OVERLAP})}
      />
    );
  };

  const sceneFor = (id: string, i: number) => {
    const duration = sceneDurations[id];
    if (id === 'intro') return <Intro durationInFrames={duration} />;
    if (id === 'acronym') return <Akronim durationInFrames={duration} />;
    if (id === 'outro') return <Outro durationInFrames={duration} landingAt={landingLocal} />;
    const index = values.findIndex((v) => `value-${v.id}` === id);
    return <Nilai index={index < 0 ? i : index} durationInFrames={duration} />;
  };

  return (
    <AbsoluteFill style={{background: color.paper}}>
      <TransitionSeries>
        {sceneIds.map((id, i) => (
          <React.Fragment key={id}>
            <TransitionSeries.Sequence durationInFrames={sceneDurations[id]} name={id}>
              {sceneFor(id, i)}
              <Audio src={staticFile(`voiceover/${id}.mp3`)} />
            </TransitionSeries.Sequence>
            {i < sceneIds.length - 1 ? transitionAt(i) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>

      {/* ---------- efek suara (opsional, volume sengaja rendah) ---------- */}
      {sfx ? (
        <>
          {boundaries.map((b, i) => (
            <Sequence key={`whoosh-${i}`} from={Math.max(0, b - 10)} durationInFrames={24} name={`SFX Whoosh ${i + 1}`}>
              <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.22} />
            </Sequence>
          ))}
          {values.map((v, i) => (
            <Sequence
              key={`tick-${v.id}`}
              from={Math.max(0, sceneStart(`value-${v.id}`) + 4)}
              durationInFrames={12}
              name={`SFX Tick ${i + 1}`}
            >
              <Audio src={staticFile('sfx/tick.mp3')} volume={0.3} />
            </Sequence>
          ))}
          <Sequence from={Math.max(0, landingGlobal - 2)} durationInFrames={70} name="SFX Logo Sting">
            <Audio src={staticFile('sfx/sting.mp3')} volume={0.42} />
          </Sequence>
        </>
      ) : null}

      {/* ---------- lambang Kota Jambi (tanda air -> tengah) ---------- */}
      <LogoOverlay outroStart={landingGlobal} />
    </AbsoluteFill>
  );
};
