// Procedural 3D models for the Darsly landing page (no external assets).
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { C } from './common.jsx';

const glossy = (color, extra = {}) => ({ color, roughness: 0.25, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.15, ...extra });

/* ---------- Play badge: rounded tile + extruded triangle ---------- */
export function PlayBadge({ color = C.cobalt, ...p }) {
  const tri = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.16, -0.2); s.lineTo(0.22, 0); s.lineTo(-0.16, 0.2); s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 4 });
  }, []);
  return (
    <group {...p}>
      <RoundedBox args={[0.9, 0.9, 0.22]} radius={0.22} smoothness={6}>
        <meshPhysicalMaterial {...glossy(color)} />
      </RoundedBox>
      <mesh geometry={tri} position={[0.02, 0, 0.1]}>
        <meshPhysicalMaterial {...glossy(C.white)} />
      </mesh>
    </group>
  );
}

/* ---------- Bell: lathe body + clapper ---------- */
export function Bell({ color = C.amber, ...p }) {
  const geo = useMemo(() => {
    const pts = [[0, 0.42], [0.08, 0.41], [0.12, 0.36], [0.2, 0.3], [0.26, 0.12], [0.3, -0.1], [0.38, -0.22], [0.42, -0.26], [0, -0.26]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return (
    <group {...p}>
      <mesh geometry={geo}><meshPhysicalMaterial {...glossy(color, { metalness: 0.35 })} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.33, 0]}><sphereGeometry args={[0.08, 24, 24]} /><meshPhysicalMaterial {...glossy(color, { metalness: 0.35 })} /></mesh>
      <mesh position={[0.26, 0.3, 0.1]}><sphereGeometry args={[0.1, 24, 24]} /><meshPhysicalMaterial {...glossy(C.red)} /></mesh>
    </group>
  );
}

/* ---------- Shield with check ---------- */
export function Shield({ color = C.green, ...p }) {
  const { body, check } = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.5); s.bezierCurveTo(0.2, 0.42, 0.34, 0.4, 0.42, 0.38); s.lineTo(0.42, 0.02);
    s.bezierCurveTo(0.42, -0.26, 0.22, -0.44, 0, -0.52); s.bezierCurveTo(-0.22, -0.44, -0.42, -0.26, -0.42, 0.02);
    s.lineTo(-0.42, 0.38); s.bezierCurveTo(-0.34, 0.4, -0.2, 0.42, 0, 0.5);
    const body = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.05, bevelSegments: 6 });
    body.center();
    const path = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.17, 0.0, 0), new THREE.Vector3(-0.05, -0.12, 0), new THREE.Vector3(0.2, 0.16, 0)], false, 'catmullrom', 0);
    const check = new THREE.TubeGeometry(path, 32, 0.045, 12, false);
    return { body, check };
  }, []);
  return (
    <group {...p}>
      <mesh geometry={body}><meshPhysicalMaterial {...glossy(color)} /></mesh>
      <mesh geometry={check} position={[0, 0, 0.13]}><meshPhysicalMaterial {...glossy(C.white)} /></mesh>
    </group>
  );
}

/* ---------- Graduation cap ---------- */
export function Cap({ ...p }) {
  const tassel = useRef();
  useFrame((s) => { if (tassel.current) tassel.current.rotation.z = Math.sin(s.clock.elapsedTime * 2) * 0.15; });
  return (
    <group {...p}>
      <mesh rotation={[0, Math.PI / 4, 0]} position={[0, 0.18, 0]}>
        <boxGeometry args={[1.25, 0.06, 1.25]} />
        <meshPhysicalMaterial {...glossy(C.ink2)} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 0.36, 48, 1, true]} />
        <meshPhysicalMaterial {...glossy(C.ink)} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.23, 0]}><sphereGeometry args={[0.06, 16, 16]} /><meshPhysicalMaterial {...glossy(C.amber, { metalness: 0.6 })} /></mesh>
      <group ref={tassel} position={[0, 0.23, 0]}>
        <mesh position={[0.32, -0.02, 0.32]} rotation={[0, Math.PI / 4, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.9, 8]} />
          <meshPhysicalMaterial {...glossy(C.amber, { metalness: 0.6 })} />
        </mesh>
        <mesh position={[0.63, -0.25, 0.63]}><cylinderGeometry args={[0.05, 0.09, 0.32, 16]} /><meshPhysicalMaterial {...glossy(C.amber, { metalness: 0.6 })} /></mesh>
      </group>
    </group>
  );
}

/* ---------- Padlock: shackle (torus arc + legs) + body + keyhole ---------- */
export function Padlock({ shackleRef, color = C.cobalt, ...p }) {
  return (
    <group {...p}>
      <group ref={shackleRef} position={[0, 0.42, 0]}>
        <mesh position={[0, 0.28, 0]}>
          <torusGeometry args={[0.42, 0.09, 24, 64, Math.PI]} />
          <meshPhysicalMaterial color="#C9D3EA" metalness={1} roughness={0.18} />
        </mesh>
        {[-0.42, 0.42].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.56, 24]} />
            <meshPhysicalMaterial color="#C9D3EA" metalness={1} roughness={0.18} />
          </mesh>
        ))}
      </group>
      <RoundedBox args={[1.4, 1.1, 0.5]} radius={0.16} smoothness={6} position={[0, -0.25, 0]}>
        <meshPhysicalMaterial {...glossy(color)} />
      </RoundedBox>
      <mesh position={[0, -0.16, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.04, 32]} />
        <meshStandardMaterial color={C.ink} />
      </mesh>
      <mesh position={[0, -0.34, 0.26]}>
        <boxGeometry args={[0.08, 0.26, 0.04]} />
        <meshStandardMaterial color={C.ink} />
      </mesh>
    </group>
  );
}

/* ---------- Gear (video processor) ---------- */
export function Gear({ color = C.amber, teeth = 12, ...p }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const rO = 0.62, rI = 0.5;
    for (let i = 0; i < teeth * 2; i++) {
      const a0 = (i / (teeth * 2)) * Math.PI * 2, a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
      const r = i % 2 === 0 ? rO : rI;
      if (i === 0) s.moveTo(Math.cos(a0) * r, Math.sin(a0) * r); else s.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
      s.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
    }
    const hole = new THREE.Path(); hole.absarc(0, 0, 0.2, 0, Math.PI * 2, true); s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.03, bevelSegments: 3 });
    g.center(); return g;
  }, [teeth]);
  return <mesh geometry={geo} {...p}><meshPhysicalMaterial {...glossy(color, { metalness: 0.5 })} /></mesh>;
}

/* ---------- Chain link pair (the source link) ---------- */
export function ChainLinks({ ...p }) {
  const link = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 0.18, 0), new THREE.Vector3(0.35, 0.18, 0), new THREE.Vector3(0.5, 0, 0), new THREE.Vector3(0.35, -0.18, 0),
      new THREE.Vector3(-0.35, -0.18, 0), new THREE.Vector3(-0.5, 0, 0)
    ], true, 'centripetal');
    return new THREE.TubeGeometry(curve, 96, 0.08, 16, true);
  }, []);
  return (
    <group {...p}>
      <mesh geometry={link} position={[-0.32, 0, 0]} rotation={[0, 0, 0.5]}><meshPhysicalMaterial color="#C9D3EA" metalness={1} roughness={0.2} /></mesh>
      <mesh geometry={link} position={[0.32, 0, 0]} rotation={[Math.PI / 2, 0, 0.5]}><meshPhysicalMaterial {...glossy(C.cobalt, { metalness: 0.4 })} /></mesh>
    </group>
  );
}
