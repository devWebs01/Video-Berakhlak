import {Composition, Folder} from 'remotion';
import {BerAKHLAKVideo} from './BerAKHLAKVideo';
import {Intro} from './compositions/Intro';
import {Akronim} from './compositions/Akronim';
import {Nilai} from './compositions/Nilai';
import {Outro} from './compositions/Outro';
import {sceneDurations, totalFrames} from './timeline';
import {values} from './data/values';
import {FPS} from './theme';

const landscape = {width: 1920, height: 1080, fps: FPS} as const;
const vertical = {width: 1080, height: 1920, fps: FPS} as const;

const outroLanding = Math.round(sceneDurations.outro * 0.62);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="BerAKHLAK"
      component={BerAKHLAKVideo}
      durationInFrames={totalFrames}
      defaultProps={{sfx: true}}
      {...landscape}
    />
    <Composition
      id="BerAKHLAK-Vertical"
      component={BerAKHLAKVideo}
      durationInFrames={totalFrames}
      defaultProps={{sfx: true}}
      {...vertical}
    />
    <Folder name="Scenes">
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={sceneDurations.intro}
        defaultProps={{durationInFrames: sceneDurations.intro}}
        {...landscape}
      />
      <Composition
        id="Akronim"
        component={Akronim}
        durationInFrames={sceneDurations.acronym}
        defaultProps={{durationInFrames: sceneDurations.acronym}}
        {...landscape}
      />
      {values.map((v, i) => (
        <Composition
          key={v.id}
          id={`Nilai-${v.id}`}
          component={Nilai}
          durationInFrames={sceneDurations[`value-${v.id}`]}
          defaultProps={{index: i, durationInFrames: sceneDurations[`value-${v.id}`]}}
          {...landscape}
        />
      ))}
      <Composition
        id="Outro"
        component={Outro}
        durationInFrames={sceneDurations.outro}
        defaultProps={{durationInFrames: sceneDurations.outro, landingAt: outroLanding}}
        {...landscape}
      />
    </Folder>
  </>
);
