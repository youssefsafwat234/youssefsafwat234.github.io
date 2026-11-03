import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const C = {
  ink: '#0B1736', ink2: '#13234A', cobalt: '#1F4FD8', cobaltHi: '#3A6BF0', sky: '#7FA6FF',
  paper: '#F6F5F1', amber: '#F2A93B', red: '#E4704F', green: '#18865B', white: '#FFFFFF'
};

/** Canvas that only renders while on screen (saves GPU on a long page). */
export function View3D({ children, camera = { position: [0, 0, 6], fov: 35 }, className = '', style, dpr = [1, 1.75] }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`view3d ${className}`} style={style}>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={dpr}
        camera={camera}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.outputColorSpace = THREE.SRGBColorSpace; }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}

/** Studio lighting built from light-formers (no HDR download needed). */
export function Studio({ intensity = 1 }) {
  return (
    <>
      <ambientLight intensity={0.35 * intensity} />
      <directionalLight position={[4, 6, 5]} intensity={1.6 * intensity} />
      <directionalLight position={[-5, -2, 3]} intensity={0.6 * intensity} color={C.sky} />
      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer form="rect" intensity={4} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer form="rect" intensity={2} color={C.cobaltHi} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 0.6, 1]} />
          <Lightformer form="rect" intensity={2} color="#ffffff" position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[20, 0.6, 1]} />
          <Lightformer form="ring" intensity={3} color={C.amber} position={[2, 3, 6]} scale={2} />
        </group>
      </Environment>
    </>
  );
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
