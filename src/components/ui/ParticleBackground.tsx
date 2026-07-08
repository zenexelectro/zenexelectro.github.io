"use client";

import { useEffect, useRef } from "react";

interface Orb {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  size: number;
  color: [number, number, number];
  phase: number;
  speed: number;
  orbitRadius: number;
  orbitSpeed: number;
  pulseSpeed: number;
  pulsePhase: number;
  glowIntensity: number;
}

interface Streamer {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  color: [number, number, number];
  width: number;
  life: number;
  maxLife: number;
}

// Premium color palette — deep cosmic tones
const PALETTE: [number, number, number][] = [
  [220, 20, 60],   // Crimson cherry
  [139, 0, 40],    // Dark cherry
  [16, 185, 129],  // Emerald
  [6, 182, 212],   // Cyan
  [99, 102, 241],  // Indigo
  [168, 85, 247],  // Purple
  [59, 130, 246],  // Blue
  [14, 165, 233],  // Sky
];

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;

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
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    // === FLOATING ORBS (large glowing spheres in background) ===
    const NUM_ORBS = 6;
    const orbs: Orb[] = Array.from({ length: NUM_ORBS }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      z: rand(0.2, 0.6),
      baseX: rand(0, w),
      baseY: rand(0, h),
      size: rand(80, 220),
      color: pick(PALETTE),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.0003, 0.0008),
      orbitRadius: rand(40, 120),
      orbitSpeed: rand(0.0002, 0.0006),
      pulseSpeed: rand(0.001, 0.003),
      pulsePhase: rand(0, Math.PI * 2),
      glowIntensity: rand(0.03, 0.08),
    }));

    // === MICRO PARTICLES (tiny floating specs) ===
    const NUM_PARTICLES = 70;
    interface MicroParticle {
      x: number; y: number; z: number;
      vx: number; vy: number;
      size: number; color: [number, number, number];
      opacity: number; phase: number; drift: number;
    }
    const particles: MicroParticle[] = Array.from({ length: NUM_PARTICLES }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      z: rand(0.1, 1),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.3, -0.05),
      size: rand(1, 2.5),
      color: pick(PALETTE),
      opacity: rand(0.15, 0.5),
      phase: rand(0, Math.PI * 2),
      drift: rand(0.3, 1.2),
    }));

    // === LIGHT STREAMERS (shooting star-like streaks) ===
    const streamers: Streamer[] = [];
    const spawnStreamer = () => {
      if (streamers.length > 3) return;
      const angle = rand(-0.8, -0.3);
      streamers.push({
        x: rand(w * 0.2, w * 1.2),
        y: rand(-50, h * 0.3),
        length: rand(60, 180),
        speed: rand(2, 5),
        opacity: rand(0.1, 0.3),
        angle,
        color: pick(PALETTE),
        width: rand(0.5, 1.5),
        life: 0,
        maxLife: rand(80, 160),
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);

    // === RENDER LOOP ===
    const draw = () => {
      timeRef.current++;
      const t = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      // --- 1. BACKGROUND ORBS (soft aurora blobs) ---
      for (const orb of orbs) {
        const pulse = Math.sin(t * orb.pulseSpeed + orb.pulsePhase) * 0.5 + 0.5;
        orb.x = orb.baseX + Math.sin(t * orb.orbitSpeed + orb.phase) * orb.orbitRadius;
        orb.y = orb.baseY + Math.cos(t * orb.orbitSpeed * 0.7 + orb.phase) * orb.orbitRadius * 0.6;

        // Slow drift
        orb.baseX += Math.sin(t * orb.speed) * 0.3;
        orb.baseY += Math.cos(t * orb.speed * 0.8) * 0.2;

        // Wrap
        if (orb.baseX < -orb.size) orb.baseX = w + orb.size;
        if (orb.baseX > w + orb.size) orb.baseX = -orb.size;
        if (orb.baseY < -orb.size) orb.baseY = h + orb.size;
        if (orb.baseY > h + orb.size) orb.baseY = -orb.size;

        const s = orb.size * (0.8 + pulse * 0.4);
        const alpha = orb.glowIntensity * (0.6 + pulse * 0.4);

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, s);
        const [r, g, b] = orb.color;
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, s, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // --- 2. CONSTELLATION LINES ---
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.07;
            const grad = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            const [r1, g1, b1] = particles[i].color;
            const [r2, g2, b2] = particles[j].color;
            grad.addColorStop(0, `rgba(${r1},${g1},${b1},${lineAlpha})`);
            grad.addColorStop(1, `rgba(${r2},${g2},${b2},${lineAlpha})`);
            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.4;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // --- 3. MICRO PARTICLES ---
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        // Organic sine-wave drift
        const drift = Math.sin(t * 0.008 + p.phase) * p.drift;
        p.x += p.vx + drift * 0.05;
        p.y += p.vy;

        // Mouse attraction (gentle pull instead of repulse)
        const dx = mx - p.x;
        const dy = my - p.y;
        const md = Math.sqrt(dx * dx + dy * dy);
        if (md < 150 && md > 0) {
          const pull = (150 - md) / 150 * 0.15;
          p.x += (dx / md) * pull;
          p.y += (dy / md) * pull;
        }

        // Wrap around
        if (p.y < -10) { p.y = h + 10; p.x = rand(0, w); }
        if (p.y > h + 10) { p.y = -10; p.x = rand(0, w); }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const depthScale = 0.3 + p.z * 0.7;
        const twinkle = Math.sin(t * 0.02 + p.phase) * 0.3 + 0.7;
        const drawSize = p.size * depthScale;
        const drawAlpha = p.opacity * depthScale * twinkle;

        const [r, g, b] = p.color;

        // Outer glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawSize * 6);
        glow.addColorStop(0, `rgba(${r},${g},${b},${drawAlpha * 0.3})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize * 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${drawAlpha})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${drawAlpha * 0.6})`;
        ctx.fill();
      }

      // --- 4. LIGHT STREAMERS ---
      if (t % 120 === 0) spawnStreamer();

      for (let i = streamers.length - 1; i >= 0; i--) {
        const s = streamers[i];
        s.life++;
        const progress = s.life / s.maxLife;
        const fadeIn = Math.min(progress * 5, 1);
        const fadeOut = Math.max(1 - (progress - 0.7) / 0.3, 0);
        const alpha = s.opacity * fadeIn * (progress > 0.7 ? fadeOut : 1);

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const endX = s.x - Math.cos(s.angle) * s.length;
        const endY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
        const [r, g, b] = s.color;
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.lineCap = "round";
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Head glow
        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6);
        hg.addColorStop(0, `rgba(255,255,255,${alpha * 0.8})`);
        hg.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();

        if (s.life >= s.maxLife) streamers.splice(i, 1);
      }

      // --- 5. MOUSE CURSOR GLOW ---
      if (mx > 0 && my > 0) {
        const cursorGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
        cursorGlow.addColorStop(0, "rgba(220,20,60,0.04)");
        cursorGlow.addColorStop(0.5, "rgba(99,102,241,0.02)");
        cursorGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(mx, my, 120, 0, Math.PI * 2);
        ctx.fillStyle = cursorGlow;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
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
