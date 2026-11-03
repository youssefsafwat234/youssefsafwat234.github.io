import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { C } from './common.jsx';

const W = 780, H = 1688; // 390 x 844 @2x

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function txt(ctx, s, x, y, font, color, align = 'right') {
  ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.direction = 'rtl'; ctx.fillText(s, x, y);
}

/** Draws the Darsly lecture-player screen into a canvas (the phone's screen texture). */
export function drawPlayerScreen(canvas, t = 0) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
  // status bar
  txt(ctx, '9:41', 60, 64, '600 30px "IBM Plex Sans Arabic"', C.ink, 'left');
  // header
  rr(ctx, W - 128, 110, 88, 88, 28); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#E7E4DC'; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(W - 104, 154); ctx.lineTo(W - 64, 154); ctx.moveTo(W - 82, 134); ctx.lineTo(W - 62, 154); ctx.lineTo(W - 82, 174); ctx.stroke();
  ctx.direction = 'ltr'; ctx.font = '800 38px Alexandria'; ctx.fillStyle = C.ink; ctx.textAlign = 'right'; ctx.fillText('Chapter 1 · Part 2', W - 160, 150);
  txt(ctx, 'محاضرة 5 · Purchasing & Inventory', W - 160, 194, '500 25px "IBM Plex Sans Arabic"', '#5E6372');
  // video
  const vy = 240, vh = 440;
  const g = ctx.createLinearGradient(0, vy, W, vy + vh); g.addColorStop(0, '#13234A'); g.addColorStop(1, '#0B1736');
  rr(ctx, 32, vy, W - 64, vh, 36); ctx.fillStyle = g; ctx.fill();
  // slide content inside the video
  ctx.fillStyle = 'rgba(255,255,255,.08)'; rr(ctx, 80, vy + 60, 380, 26, 13); ctx.fill(); rr(ctx, 80, vy + 110, 300, 20, 10); ctx.fill(); rr(ctx, 80, vy + 150, 340, 20, 10); ctx.fill();
  ctx.fillStyle = C.cobalt; ctx.beginPath(); ctx.arc(W / 2, vy + vh / 2, 62, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(W / 2 - 18, vy + vh / 2 - 30); ctx.lineTo(W / 2 + 30, vy + vh / 2); ctx.lineTo(W / 2 - 18, vy + vh / 2 + 30); ctx.closePath(); ctx.fill();
  // moving watermark
  const wx = 140 + ((Math.sin(t * 0.6) + 1) / 2) * 380, wy = vy + 110 + ((Math.cos(t * 0.45) + 1) / 2) * 240;
  ctx.globalAlpha = 0.35; txt(ctx, 'عمر أشرف · S-55120', wx + 200, wy, '600 26px "IBM Plex Sans Arabic"', '#fff'); ctx.globalAlpha = 1;
  // progress bar
  rr(ctx, 70, vy + vh - 60, W - 140, 10, 5); ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fill();
  const p = 0.42; rr(ctx, W - 70 - (W - 140) * p, vy + vh - 60, (W - 140) * p, 10, 5); ctx.fillStyle = C.cobaltHi; ctx.fill();
  // chips
  const chips = [['تلقائي · 720p', '#EEF2FD', C.cobalt], ['محمي', '#E8F5EE', '#136B49'], ['المشغّل الأساسي', '#F0EEE8', '#3D4250']];
  let cx = W - 40;
  ctx.font = '700 26px "IBM Plex Sans Arabic"';
  chips.forEach(([s, bg, ink]) => {
    const w = ctx.measureText(s).width + 48; rr(ctx, cx - w, vy + vh + 30, w, 60, 30); ctx.fillStyle = bg; ctx.fill();
    txt(ctx, s, cx - 24, vy + vh + 70, '700 26px "IBM Plex Sans Arabic"', ink); cx -= w + 14;
  });
  // chapters card
  const cy = vy + vh + 130;
  rr(ctx, 32, cy, W - 64, 560, 40); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#E7E4DC'; ctx.lineWidth = 2; ctx.stroke();
  txt(ctx, 'الفصول', W - 72, cy + 70, '800 32px Alexandria', C.ink);
  const rows = [['المقدمة', '00:00', true], ['EOQ — الكمية الاقتصادية', '06:40', true], ['سؤال: احسب الـ EOQ', '12:10', false], ['FIFO و LIFO', '18:25', false]];
  rows.forEach(([s, time, done], i) => {
    const y = cy + 130 + i * 104;
    ctx.fillStyle = done ? '#E8F5EE' : i === 2 ? '#FDF1DC' : '#F6F5F1'; ctx.beginPath(); ctx.arc(W - 96, y, 26, 0, Math.PI * 2); ctx.fill();
    txt(ctx, s, W - 140, y + 10, '600 28px "IBM Plex Sans Arabic"', '#14171F');
    txt(ctx, time, 72, y + 10, '500 24px "IBM Plex Mono"', '#9A9EA9', 'left');
  });
  // download button
  const by = H - 190;
  rr(ctx, 32, by, W - 64, 110, 34); ctx.fillStyle = C.cobalt; ctx.fill();
  txt(ctx, 'تحميل · بيتحفظ مشفّر', W / 2, by + 68, '700 32px Alexandria', '#fff', 'center');
}

/** A phone body (rounded aluminium + glass) with the live Darsly screen. */
export function Phone({ screen = 'player', ...p }) {
  const canvas = useMemo(() => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; }, []);
  const tex = useMemo(() => { const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }, [canvas]);
  const [ready, setReady] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    let alive = true;
    Promise.all([
      document.fonts.load('800 38px Alexandria'), document.fonts.load('600 28px "IBM Plex Sans Arabic"'), document.fonts.load('500 24px "IBM Plex Mono"')
    ]).catch(() => {}).finally(() => { if (alive) { drawPlayerScreen(canvas, 0); tex.needsUpdate = true; setReady(true); } });
    return () => { alive = false; };
  }, [canvas, tex]);
  useFrame((s) => {
    if (!ready) return;
    const t = s.clock.elapsedTime;
    if (t - last.current > 1 / 20) { drawPlayerScreen(canvas, t); tex.needsUpdate = true; last.current = t; }
  });
  const sw = 1.62, sh = 3.5;
  return (
    <group {...p}>
      <RoundedBox args={[sw + 0.16, sh + 0.16, 0.2]} radius={0.24} smoothness={8}>
        <meshPhysicalMaterial color="#1B2440" metalness={0.85} roughness={0.28} clearcoat={1} />
      </RoundedBox>
      <RoundedBox args={[sw + 0.06, sh + 0.06, 0.02]} radius={0.2} smoothness={6} position={[0, 0, 0.1]}>
        <meshPhysicalMaterial color="#05070d" roughness={0.05} metalness={0} clearcoat={1} />
      </RoundedBox>
      <mesh position={[0, 0, 0.112]}>
        <planeGeometry args={[sw, sh]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <RoundedBox args={[0.5, 0.13, 0.01]} radius={0.06} position={[0, sh / 2 - 0.16, 0.118]}>
        <meshBasicMaterial color="#000" />
      </RoundedBox>
      {[0.7, 0.35].map((y) => (
        <RoundedBox key={y} args={[0.04, 0.26, 0.08]} radius={0.02} position={[-(sw / 2 + 0.09), y, 0]}>
          <meshPhysicalMaterial color="#2A3558" metalness={0.9} roughness={0.3} />
        </RoundedBox>
      ))}
    </group>
  );
}
