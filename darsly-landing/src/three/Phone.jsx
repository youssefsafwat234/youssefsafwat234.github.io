import { useTexture, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { screen } from '../data/screens.js';

/** Phone body + a real Darsly app screen (static texture, no per-frame redraw). */
export function Phone({ shot = 'ST6.1', ...p }) {
  const tex = useTexture(screen(shot));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const sw = 1.62, sh = 3.5;
  return (
    <group {...p}>
      <RoundedBox args={[sw + 0.16, sh + 0.16, 0.2]} radius={0.26} smoothness={4}>
        <meshStandardMaterial color="#1B2440" metalness={0.8} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[sw + 0.06, sh + 0.06, 0.02]} radius={0.22} smoothness={4} position={[0, 0, 0.1]}>
        <meshStandardMaterial color="#05070d" roughness={0.1} />
      </RoundedBox>
      <mesh position={[0, 0, 0.112]}>
        <planeGeometry args={[sw, sh]} />
        <meshBasicMaterial map={tex} toneMapped={false} transparent alphaTest={0.5} />
      </mesh>
      <RoundedBox args={[0.46, 0.12, 0.01]} radius={0.05} smoothness={2} position={[0, sh / 2 - 0.13, 0.118]}>
        <meshBasicMaterial color="#000" />
      </RoundedBox>
    </group>
  );
}
