import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, ContactShadows, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { C, Studio } from './common.jsx';
import { Phone } from './Phone.jsx';
import { PlayBadge, Bell, Shield, Cap, Padlock, Gear, ChainLinks } from './models.jsx';

const damp = THREE.MathUtils.damp;

/* ================= HERO: three phones with real app screens ================= */
export function HeroScene({ progress }) {
  const rig = useRef();
  const { viewport } = useThree();
  const small = viewport.width < 5;
  useFrame((s, dt) => {
    const p = progress?.current ?? 0;
    if (!rig.current) return;
    rig.current.rotation.y = damp(rig.current.rotation.y, s.pointer.x * 0.25 - p * 0.6, 3.5, dt);
    rig.current.rotation.x = damp(rig.current.rotation.x, -s.pointer.y * 0.12 + p * 0.2, 3.5, dt);
    rig.current.position.y = damp(rig.current.position.y, p * 1.2, 3.5, dt);
  });
  return (
    <>
      <Studio />
      <group ref={rig} scale={small ? 0.72 : 0.92}>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
          <Phone shot="ST6.1" rotation={[0.04, -0.22, 0]} position={[0, 0, 0.6]} />
        </Float>
        <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.6}>
          <Phone shot="ST1.4" rotation={[0.06, 0.5, 0.05]} position={[1.85, -0.25, -0.6]} scale={0.86} />
        </Float>
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
          <Phone shot="ST7.3" rotation={[0.06, -0.75, -0.05]} position={[-1.85, -0.3, -0.6]} scale={0.86} />
        </Float>
        <Float speed={2} rotationIntensity={1} floatIntensity={1.2}><PlayBadge position={[1.2, 1.95, 1]} rotation={[0.2, -0.5, 0.1]} scale={0.55} /></Float>
        <Float speed={1.8} rotationIntensity={1} floatIntensity={1.2}><Shield position={[-1.25, 1.85, 1]} rotation={[0.1, 0.5, -0.1]} scale={0.6} /></Float>
      </group>
      <ContactShadows frames={1} position={[0, -2.2, 0]} opacity={0.3} scale={10} blur={2.4} far={4} resolution={256} color={C.ink} />
    </>
  );
}

/* ================= JOURNEY: link → processor → published → student (background band) ================= */
const STATIONS = [new THREE.Vector3(3.3, 0.3, 0), new THREE.Vector3(1.1, -0.35, 0.4), new THREE.Vector3(-1.1, 0.35, 0.4), new THREE.Vector3(-3.3, -0.3, 0)];
function Flow({ curve, count = 40 }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((s) => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      const t = (i / count + s.clock.elapsedTime * 0.06) % 1;
      curve.getPointAt(t, dummy.position);
      dummy.scale.setScalar(0.045);
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={C.sky} toneMapped={false} />
    </instancedMesh>
  );
}
function Station({ i, progress, children }) {
  const g = useRef();
  useFrame((s, dt) => {
    const p = (progress?.current ?? 0) * 3;
    const active = 1 - Math.min(1, Math.abs(p - i));
    if (!g.current) return;
    g.current.scale.setScalar(damp(g.current.scale.x, 0.75 + active * 0.45, 6, dt));
    g.current.rotation.y += dt * (0.25 + active * 0.7);
  });
  return <group position={STATIONS[i]}><group ref={g}>{children}</group></group>;
}
export function JourneyScene({ progress }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(STATIONS.map((v) => v.clone()), false, 'catmullrom', 0.5), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 100, 0.03, 6, false), [curve]);
  const gearRef = useRef();
  const { viewport } = useThree();
  const k = Math.min(1, viewport.width / 7.5);
  useFrame((s, dt) => {
    const p = progress?.current ?? 0;
    s.camera.position.x = damp(s.camera.position.x, THREE.MathUtils.lerp(1.6, -1.6, p) * k, 3, dt);
    s.camera.lookAt(s.camera.position.x * 0.6, 0, 0);
    if (gearRef.current) gearRef.current.rotation.z -= dt * 1.2;
  });
  return (
    <group scale={k}>
      <Studio />
      <mesh geometry={tube}><meshBasicMaterial color={C.cobalt} transparent opacity={0.5} toneMapped={false} /></mesh>
      <Flow curve={curve} />
      <Station i={0} progress={progress}><ChainLinks scale={0.9} /></Station>
      <Station i={1} progress={progress}><group ref={gearRef}><Gear /></group></Station>
      <Station i={2} progress={progress}><Bell scale={1.1} /></Station>
      <Station i={3} progress={progress}><PlayBadge scale={1.05} /></Station>
    </group>
  );
}

/* ================= OFFLINE: padlock closing over an orbit of encrypted bits ================= */
function Bits({ count = 48 }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => Array.from({ length: count }, (_, i) => ({ r: 1.6 + ((i * 37) % 10) / 11, a: (i / count) * Math.PI * 2, y: (((i * 53) % 17) / 17 - 0.5) * 1.6, s: 0.05 + ((i * 29) % 7) / 100, v: 0.25 + ((i * 13) % 5) / 12 })), [count]);
  useFrame((st) => {
    if (!ref.current) return;
    const t = st.clock.elapsedTime;
    data.forEach((d, i) => {
      const a = d.a + t * d.v * 0.5;
      dummy.position.set(Math.cos(a) * d.r, d.y, Math.sin(a) * d.r);
      dummy.rotation.set(a, a * 1.3, 0); dummy.scale.setScalar(d.s);
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={C.sky} emissive={C.cobalt} emissiveIntensity={0.6} roughness={0.3} />
    </instancedMesh>
  );
}
export function LockScene({ progress }) {
  const shackle = useRef();
  const rig = useRef();
  useFrame((s, dt) => {
    const p = progress?.current ?? 0;
    const closed = THREE.MathUtils.smoothstep(p, 0.15, 0.55);
    if (shackle.current) shackle.current.position.y = damp(shackle.current.position.y, 0.42 + (1 - closed) * 0.42, 6, dt);
    if (rig.current) rig.current.rotation.y = damp(rig.current.rotation.y, s.pointer.x * 0.35, 3, dt);
  });
  return (
    <>
      <Studio />
      <group ref={rig}>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}><Padlock shackleRef={shackle} /></Float>
        <Bits />
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.05, 0.012, 6, 96]} />
          <meshBasicMaterial color={C.cobaltHi} transparent opacity={0.6} toneMapped={false} />
        </mesh>
      </group>
      <ContactShadows frames={1} position={[0, -1.6, 0]} opacity={0.28} scale={7} blur={2.4} far={3} resolution={256} color={C.ink} />
    </>
  );
}

/* ================= FINAL CTA: graduation cap over a liquid orb ================= */
export function FinaleScene() {
  return (
    <>
      <Studio />
      <mesh position={[0, -0.2, -1]} scale={1.7}>
        <icosahedronGeometry args={[1, 12]} />
        <MeshDistortMaterial color={C.cobalt} distort={0.32} speed={1.4} roughness={0.2} metalness={0.2} />
      </mesh>
      <Float speed={1.8} rotationIntensity={0.7} floatIntensity={1}><Cap position={[0, 1.05, 0.6]} rotation={[0.45, 0.6, -0.1]} scale={1.15} /></Float>
      <Float speed={1.6} floatIntensity={1.2}><PlayBadge position={[-2.1, 0.2, 0.4]} rotation={[0.1, 0.6, 0]} scale={0.6} /></Float>
      <Float speed={1.5} floatIntensity={1.1}><Shield position={[2.1, -0.3, 0.4]} rotation={[0.1, -0.6, 0]} scale={0.7} /></Float>
      <Sparkles count={40} scale={[7, 4, 3]} size={2.2} speed={0.4} color="#ffffff" />
    </>
  );
}
