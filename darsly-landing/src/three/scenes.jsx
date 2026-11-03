import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, ContactShadows, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { C, Studio } from './common.jsx';
import { Phone } from './Phone.jsx';
import { PlayBadge, Bell, Shield, Cap, Padlock, Gear, ChainLinks } from './models.jsx';

const damp = THREE.MathUtils.damp;

/* ================= HERO: phone + orbiting product icons ================= */
export function HeroScene({ progress }) {
  const rig = useRef();
  const phone = useRef();
  const { viewport } = useThree();
  const small = viewport.width < 5;
  useFrame((s, dt) => {
    const p = progress?.current ?? 0;
    if (rig.current) {
      rig.current.rotation.y = damp(rig.current.rotation.y, s.pointer.x * 0.35 - p * 0.9, 4, dt);
      rig.current.rotation.x = damp(rig.current.rotation.x, -s.pointer.y * 0.18 + p * 0.25, 4, dt);
      rig.current.position.y = damp(rig.current.position.y, p * 1.4, 4, dt);
    }
    if (phone.current) phone.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.6) * 0.04;
  });
  return (
    <>
      <Studio />
      <group ref={rig} scale={small ? 0.78 : 1}>
        <group ref={phone} rotation={[0.08, -0.32, 0]}>
          <Phone />
        </group>
        <Float speed={2} rotationIntensity={1.2} floatIntensity={1.4}><PlayBadge position={[1.75, 1.15, 0.6]} rotation={[0.2, -0.5, 0.1]} scale={0.72} /></Float>
        <Float speed={1.6} rotationIntensity={1} floatIntensity={1.2}><Bell position={[-1.65, 1.35, 0.4]} rotation={[0.2, 0.4, 0.3]} scale={0.8} /></Float>
        <Float speed={1.8} rotationIntensity={1.1} floatIntensity={1.5}><Shield position={[-1.8, -0.9, 0.7]} rotation={[0.1, 0.5, -0.1]} scale={0.8} /></Float>
        <Float speed={1.4} rotationIntensity={0.9} floatIntensity={1.1}><Cap position={[1.7, -1.2, 0.3]} rotation={[0.5, 0.3, -0.2]} scale={0.62} /></Float>
        <Sparkles count={60} scale={[6, 5, 3]} size={2.2} speed={0.4} color={C.sky} />
      </group>
      <ContactShadows position={[0, -2.25, 0]} opacity={0.35} scale={9} blur={2.6} far={4} color={C.ink} />
    </>
  );
}

/* ================= JOURNEY: link → processor → published → student ================= */
const STATIONS = [new THREE.Vector3(3.3, 0.3, 0), new THREE.Vector3(1.1, -0.35, 0.4), new THREE.Vector3(-1.1, 0.35, 0.4), new THREE.Vector3(-3.3, -0.3, 0)];
function Flow({ curve, count = 70 }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offs = useMemo(() => Array.from({ length: count }, (_, i) => i / count), [count]);
  useFrame((s) => {
    if (!ref.current) return;
    offs.forEach((o, i) => {
      const t = (o + s.clock.elapsedTime * 0.06) % 1;
      curve.getPointAt(t, dummy.position);
      dummy.scale.setScalar(0.035 + 0.025 * Math.sin((t + i) * 20));
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color={C.sky} toneMapped={false} />
    </instancedMesh>
  );
}
function Station({ i, progress, children }) {
  const g = useRef();
  useFrame((s, dt) => {
    const p = (progress?.current ?? 0) * 3; // 0..3
    const active = 1 - Math.min(1, Math.abs(p - i));
    if (g.current) {
      const sc = 0.75 + active * 0.45;
      g.current.scale.setScalar(damp(g.current.scale.x, sc, 6, dt));
      g.current.rotation.y += dt * (0.3 + active * 0.8);
    }
  });
  return <group position={STATIONS[i]}><group ref={g}>{children}</group></group>;
}
export function JourneyScene({ progress }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(STATIONS.map((v) => v.clone()), false, 'catmullrom', 0.5), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 160, 0.03, 8, false), [curve]);
  const gearRef = useRef();
  const { viewport } = useThree();
  const k = Math.min(1, viewport.width / 7.5);
  useFrame((s, dt) => {
    const p = progress?.current ?? 0;
    s.camera.position.x = damp(s.camera.position.x, THREE.MathUtils.lerp(1.6, -1.6, p) * k, 3, dt);
    s.camera.lookAt(s.camera.position.x * 0.6, 0, 0);
    if (gearRef.current) gearRef.current.rotation.z -= dt * 1.4;
  });
  return (
    <group scale={k}>
      <Studio />
      <mesh geometry={tube}><meshBasicMaterial color={C.cobalt} transparent opacity={0.45} toneMapped={false} /></mesh>
      <Flow curve={curve} />
      <Station i={0} progress={progress}><ChainLinks scale={0.9} /></Station>
      <Station i={1} progress={progress}><group ref={gearRef}><Gear /></group><Gear position={[0.55, 0.45, -0.2]} scale={0.45} color={C.cobaltHi} /></Station>
      <Station i={2} progress={progress}><Bell scale={1.1} /></Station>
      <Station i={3} progress={progress}><PlayBadge scale={1.05} /></Station>
      <Sparkles count={50} scale={[9, 3, 2]} size={2} speed={0.3} color={C.sky} />
    </group>
  );
}

/* ================= OFFLINE: padlock closing over an orbit of encrypted bits ================= */
function Bits({ count = 90 }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => Array.from({ length: count }, (_, i) => ({ r: 1.6 + Math.random() * 0.9, a: (i / count) * Math.PI * 2, y: (Math.random() - 0.5) * 1.6, s: 0.04 + Math.random() * 0.07, v: 0.2 + Math.random() * 0.4 })), [count]);
  useFrame((st) => {
    if (!ref.current) return;
    data.forEach((d, i) => {
      const a = d.a + st.clock.elapsedTime * d.v * 0.5;
      dummy.position.set(Math.cos(a) * d.r, d.y + Math.sin(a * 2) * 0.1, Math.sin(a) * d.r);
      dummy.rotation.set(a, a * 1.3, 0); dummy.scale.setScalar(d.s);
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial color={C.sky} emissive={C.cobalt} emissiveIntensity={0.6} roughness={0.3} />
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
    if (rig.current) rig.current.rotation.y = damp(rig.current.rotation.y, s.pointer.x * 0.4 + Math.sin(s.clock.elapsedTime * 0.4) * 0.15, 3, dt);
  });
  return (
    <>
      <Studio />
      <group ref={rig}>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}><Padlock shackleRef={shackle} /></Float>
        <Bits />
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.05, 0.012, 8, 160]} />
          <meshBasicMaterial color={C.cobaltHi} transparent opacity={0.6} toneMapped={false} />
        </mesh>
      </group>
      <ContactShadows position={[0, -1.6, 0]} opacity={0.3} scale={7} blur={2.4} far={3} color={C.ink} />
    </>
  );
}

/* ================= FINAL CTA: graduation cap over a liquid orb ================= */
export function FinaleScene() {
  return (
    <>
      <Studio />
      <mesh position={[0, -0.2, -1]} scale={1.7}>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial color={C.cobalt} distort={0.35} speed={1.6} roughness={0.15} metalness={0.2} />
      </mesh>
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}><Cap position={[0, 1.05, 0.6]} rotation={[0.45, 0.6, -0.1]} scale={1.15} /></Float>
      <Float speed={1.7} floatIntensity={1.4}><PlayBadge position={[-2.1, 0.2, 0.4]} rotation={[0.1, 0.6, 0]} scale={0.6} /></Float>
      <Float speed={1.5} floatIntensity={1.3}><Shield position={[2.1, -0.3, 0.4]} rotation={[0.1, -0.6, 0]} scale={0.7} /></Float>
      <Sparkles count={80} scale={[7, 4, 3]} size={2.4} speed={0.5} color="#ffffff" />
    </>
  );
}
