"use client";

import { useEffect, useRef } from "react";

interface Cloud {
  x: number;
  y: number;
  z: number;
  speed: number;
  size: number;
  opacity: number;
  blobs: { ox: number; oy: number; r: number }[];
  color: [number, number, number];
  phase: number;
  driftAmp: number;
}

interface Mist {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
  color: [number, number, number];
}

const CLOUD_COLORS: [number, number, number][] = [
  [255, 255, 255],
  [220, 230, 255],
  [200, 215, 255],
  [230, 220, 255],
  [210, 240, 255],
  [255, 225, 235],
];

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const rand = (a: number, b: number) => Math.random() * (b - a) + a;
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

    // Generate cloud blob clusters
    const makeBlobs = (size: number) => {
      const blobs: { ox: number; oy: number; r: number }[] = [];
      const count = Math.floor(rand(4, 8));
      for (let i = 0; i < count; i++) {
        blobs.push({
          ox: rand(-size * 0.6, size * 0.6),
          oy: rand(-size * 0.3, size * 0.2),
          r: rand(size * 0.3, size * 0.7),
        });
      }
      // Main center blob
      blobs.push({ ox: 0, oy: 0, r: size * 0.55 });
      // Top bumps
      blobs.push({ ox: rand(-size * 0.3, size * 0.3), oy: -size * 0.25, r: size * 0.4 });
      return blobs;
    };

    // ═══ CLOUDS ═══
    const NUM_CLOUDS = 12;
    const clouds: Cloud[] = Array.from({ length: NUM_CLOUDS }, () => {
      const size = rand(40, 120);
      return {
        x: rand(-100, w + 100),
        y: rand(0, h),
        z: rand(0.2, 1),
        speed: rand(0.1, 0.5),
        size,
        opacity: rand(0.04, 0.12),
        blobs: makeBlobs(size),
        color: pick(CLOUD_COLORS),
        phase: rand(0, Math.PI * 2),
        driftAmp: rand(5, 20),
      };
    });

    // ═══ MIST LAYERS ═══
    const NUM_MIST = 8;
    const mists: Mist[] = Array.from({ length: NUM_MIST }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      size: rand(150, 400),
      opacity: rand(0.02, 0.05),
      speed: rand(0.05, 0.2),
      phase: rand(0, Math.PI * 2),
      color: pick(CLOUD_COLORS),
    }));

    // ═══ TINY SPARKLE PARTICLES ═══
    const NUM_SPARKLES = 40;
    interface Sparkle {
      x: number; y: number; size: number;
      opacity: number; phase: number; speed: number;
      vy: number; vx: number;
    }
    const sparkles: Sparkle[] = Array.from({ length: NUM_SPARKLES }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      size: rand(0.5, 2),
      opacity: rand(0.15, 0.5),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.01, 0.03),
      vy: rand(-0.15, -0.03),
      vx: rand(-0.05, 0.05),
    }));

    // ═══ EVENTS ═══
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    // ═══ DRAW CLOUD ═══
    const drawCloud = (cloud: Cloud, t: number) => {
      const [r, g, b] = cloud.color;
      const depthScale = 0.4 + cloud.z * 0.6;
      const yDrift = Math.sin(t * 0.003 + cloud.phase) * cloud.driftAmp;

      // Mouse interaction — clouds gently push away
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      let pushX = 0, pushY = 0;
      const dx = cloud.x - mx, dy = (cloud.y + yDrift) - my;
      const md = Math.sqrt(dx * dx + dy * dy);
      if (md < 180 && md > 0) {
        const force = (180 - md) / 180 * 8;
        pushX = (dx / md) * force;
        pushY = (dy / md) * force;
      }

      const drawX = cloud.x + pushX;
      const drawY = cloud.y + yDrift + pushY;
      const alpha = cloud.opacity * depthScale;

      for (const blob of cloud.blobs) {
        const bx = drawX + blob.ox * depthScale;
        const by = drawY + blob.oy * depthScale;
        const br = blob.r * depthScale;

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    // ═══ RENDER LOOP ═══
    const draw = () => {
      tRef.current++;
      const t = tRef.current;
      ctx.clearRect(0, 0, w, h);

      // ─── 1. MIST (deep background fog) ───
      for (const m of mists) {
        m.x += m.speed * 0.3;
        const yOff = Math.sin(t * 0.002 + m.phase) * 15;
        if (m.x - m.size > w) m.x = -m.size;

        const [r, g, b] = m.color;
        const pulse = Math.sin(t * 0.003 + m.phase) * 0.3 + 0.7;
        const alpha = m.opacity * pulse;

        const grad = ctx.createRadialGradient(m.x, m.y + yOff, 0, m.x, m.y + yOff, m.size);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(0.6, `rgba(${r},${g},${b},${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(m.x, m.y + yOff, m.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // ─── 2. CLOUDS (sorted by depth — back to front) ───
      clouds.sort((a, b) => a.z - b.z);

      for (const cloud of clouds) {
        cloud.x += cloud.speed * (0.3 + cloud.z * 0.7);

        // Wrap
        if (cloud.x - cloud.size * 2 > w) {
          cloud.x = -cloud.size * 2;
          cloud.y = rand(0, h);
          cloud.z = rand(0.2, 1);
        }

        drawCloud(cloud, t);
      }

      // ─── 3. SPARKLES (twinkling light specs in clouds) ───
      for (const s of sparkles) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.y < -10) { s.y = h + 10; s.x = rand(0, w); }
        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;

        const twinkle = Math.sin(t * s.speed + s.phase);
        const alpha = s.opacity * (twinkle * 0.5 + 0.5);

        // Only show when "on" cycle
        if (alpha < 0.05) continue;

        // Star cross shape
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#ffffff";

        // Horizontal beam
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.size * 3, s.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Vertical beam
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.size * 0.3, s.size * 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Soft glow
        ctx.globalAlpha = alpha * 0.3;
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 8);
        glow.addColorStop(0, "rgba(255,255,255,0.4)");
        glow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 8, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.restore();
      }

      // ─── 4. CURSOR GLOW ───
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      if (mx > 0 && my > 0 && mx < w && my < h) {
        const cg = ctx.createRadialGradient(mx, my, 0, mx, my, 130);
        cg.addColorStop(0, "rgba(255,255,255,0.06)");
        cg.addColorStop(0.5, "rgba(200,220,255,0.03)");
        cg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(mx, my, 130, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
