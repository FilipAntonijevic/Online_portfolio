import { useEffect, useRef } from 'react';

const STAR_COUNT  = 320;
const NEBULA_SEED = 42;

// Pixels of background scroll per degree of machine rotation
const STAR_PARALLAX   = -5.0;  // stars — closer layer, moves more
const NEBULA_PARALLAX = -3.0;  // nebulae — deeper layer, moves less

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export default function StarBackground({ angleRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const rand = seededRand(NEBULA_SEED);
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x:     rand(),
      y:     rand(),
      r:     rand() * 1.4 + 0.2,
      base:  rand() * 0.55 + 0.25,
      amp:   rand() * 0.30,
      phase: rand() * Math.PI * 2,
      speed: rand() * 0.018 + 0.004,
    }));

    // Nebulae defined across 0..2 x-range so tiling is seamless
    const nebulae = [
      { x: 0.18, y: 0.25, rx: 0.32, ry: 0.22, color: '60,30,90',  a: 0.13 },
      { x: 0.75, y: 0.65, rx: 0.28, ry: 0.18, color: '20,40,90',  a: 0.11 },
      { x: 0.50, y: 0.80, rx: 0.40, ry: 0.15, color: '40,20,70',  a: 0.09 },
      { x: 0.85, y: 0.15, rx: 0.20, ry: 0.25, color: '80,30,60',  a: 0.10 },
      // Duplicate copies shifted +1 for seamless horizontal tiling
      { x: 1.18, y: 0.25, rx: 0.32, ry: 0.22, color: '60,30,90',  a: 0.13 },
      { x: 1.75, y: 0.65, rx: 0.28, ry: 0.18, color: '20,40,90',  a: 0.11 },
      { x: 1.50, y: 0.80, rx: 0.40, ry: 0.15, color: '40,20,70',  a: 0.09 },
      { x: 1.85, y: 0.15, rx: 0.20, ry: 0.25, color: '80,30,60',  a: 0.10 },
    ];

    let bgOffscreen = null;

    function buildBg(w, h) {
      bgOffscreen = document.createElement('canvas');
      bgOffscreen.width  = w;
      bgOffscreen.height = h;
      const oc = bgOffscreen.getContext('2d');
      const bg = oc.createLinearGradient(0, 0, w * 0.6, h);
      bg.addColorStop(0,   '#06061a');
      bg.addColorStop(0.5, '#080818');
      bg.addColorStop(1,   '#050510');
      oc.fillStyle = bg;
      oc.fillRect(0, 0, w, h);
    }

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      buildBg(canvas.width, canvas.height);
    }

    let animId;
    let frame = 0;

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      const angle = angleRef?.current ?? 0;

      // Pixel offsets, wrapped for seamless scroll
      const starOffX   = ((angle * STAR_PARALLAX)   % w + w) % w;
      const nebulaOffX = ((angle * NEBULA_PARALLAX)  % w + w) % w;

      // Static gradient base
      ctx.drawImage(bgOffscreen, 0, 0);

      // Nebulae with parallax
      nebulae.forEach(n => {
        const rawX = n.x * w - nebulaOffX;
        // wrap so nebulae always stay on screen
        const gx = ((rawX % w) + w) % w;
        const gy = n.y * h;
        const rr = Math.max(n.rx * w, n.ry * h);
        const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, rr);
        gr.addColorStop(0,   `rgba(${n.color},${n.a})`);
        gr.addColorStop(0.5, `rgba(${n.color},${(n.a * 0.4).toFixed(3)})`);
        gr.addColorStop(1,   `rgba(${n.color},0)`);
        ctx.save();
        ctx.scale(1, n.ry / n.rx);
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(gx, gy * (n.rx / n.ry), n.rx * w, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Stars with parallax — wrap for seamless tiling
      stars.forEach(s => {
        const flicker = s.base + s.amp * Math.sin(frame * s.speed + s.phase);
        const sx = ((s.x * w - starOffX) % w + w) % w;
        ctx.beginPath();
        ctx.arc(sx, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,220,255,${flicker.toFixed(3)})`;
        ctx.fill();
      });

      frame++;
      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [angleRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
