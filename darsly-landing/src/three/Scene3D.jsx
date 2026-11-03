// Lazy entry: three.js + R3F + drei live in their own chunk, loaded after the first paint.
import { View3D } from './common.jsx';
import { HeroScene, JourneyScene, LockScene, FinaleScene } from './scenes.jsx';

const SCENES = { hero: HeroScene, journey: JourneyScene, lock: LockScene, finale: FinaleScene };

export default function Scene3D({ name, progress, camera, className }) {
  const S = SCENES[name];
  return <View3D className={className} camera={camera}><S progress={progress} /></View3D>;
}
