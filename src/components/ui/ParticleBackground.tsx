"use client";

import { useEffect, useRef } from "react";

// === TYPES ===
type RGB = [number, number, number];
type ShapeType = "chip" | "diode" | "led" | "capacitor" | "resistor" | "dot";

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  size: number;
  color: RGB;
  shape: ShapeType;
  opacity: number;
  phase: number;
  drift: number;
  rotation: number;
  rotSpeed: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface Orb {
  x: number; y: number;
  baseX: number; baseY: number;
  size: number; color: RGB;
  phase: number; speed: number;
  orbitR: number; orbitS: number;
  pulseS: number; pulseP: number;
  glow: number;
}

interface Streamer {
  x: number; y: number;
  length: number; speed: number;
  opacity: number; angle: number;
  color: RGB; width: number;
  life: number; maxLife: number;
}

// Premium electronics palette
const COLORS: RGB[] = [
  [220, 20, 60],   // Cherry Red
  [16, 185, 129],  // Emerald
  [59, 130, 246],  // Blue
  [168, 85, 247],  // Purple
  [245, 158, 11],  // Gold
  [255, 255, 255], // White
  [6, 182, 212],   // Cyan
  [99, 102, 241],  // Indigo
];

const SHAPES: ShapeType[] = ["chip", "diode", "led", "capacitor", "resistor", "dot"];

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
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const rand = (a: number, b: number) => Math.random() * (b - a) + a;
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

    // ═══ AURORA ORBS ═══
    const orbs: Orb[] = Array.from({ length: 5 }, () => ({
      x: rand(0, w), y: rand(0, h),
      baseX: rand(0, w), baseY: rand(0, h),
      size: rand(100, 250), color: pick(COLORS),
      phase: rand(0, Math.PI * 2), speed: rand(0.0003, 0.0008),
      orbitR: rand(40, 100), orbitS: rand(0.0002, 0.0005),
      pulseS: rand(0.001, 0.003), pulseP: rand(0, Math.PI * 2),
      glow: rand(0.03, 0.07),
    }));

    // ═══ ELECTRONICS PARTICLES ═══
    const NUM = 85;
    const particles: Particle[] = Array.from({ length: NUM }, () => ({
      x: rand(0, w), y: rand(0, h), z: rand(0.15, 1),
      vx: rand(-0.2, 0.2), vy: rand(-0.15, 0.15), vz: rand(-0.002, 0.002),
      size: rand(3, 8),
      color: pick(COLORS),
      shape: pick(SHAPES),
      opacity: rand(0.2, 0.6),
      phase: rand(0, Math.PI * 2),
      drift: rand(0.3, 1),
      rotation: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.005, 0.005),
      pulsePhase: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.01, 0.03),
    }));

    // ═══ STREAMERS ═══
    const streamers: Streamer[] = [];
    const spawnStreamer = () => {
      if (streamers.length > 3) return;
      streamers.push({
        x: rand(w * 0.2, w * 1.2), y: rand(-50, h * 0.3),
        length: rand(60, 160), speed: rand(2.5, 5),
        opacity: rand(0.12, 0.3), angle: rand(-0.8, -0.3),
        color: pick(COLORS), width: rand(0.5, 1.5),
        life: 0, maxLife: rand(80, 150),
      });
    };

    // ═══ SHAPE DRAWING FUNCTIONS ═══
    const drawChip = (x: number, y: number, s: number, rot: number, r: number, g: number, b: number, a: number) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      // Body
      ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.8})`;
      ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
      ctx.lineWidth = 0.5;
      const bw = s * 1.6, bh = s * 1.2;
      ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
      ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
      // Pins
      const pins = 3;
      for (let i = 0; i < pins; i++) {
        const px = -bw / 2 + (bw / (pins + 1)) * (i + 1);
        ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.6})`;
        ctx.fillRect(px - 0.5, -bh / 2 - s * 0.5, 1, s * 0.5);
        ctx.fillRect(px - 0.5, bh / 2, 1, s * 0.5);
      }
      // Center dot
      ctx.fillStyle = `rgba(255,255,255,${a * 0.3})`;
      ctx.beginPath(); ctx.arc(-bw / 4, -bh / 4, s * 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    const drawDiode = (x: number, y: number, s: number, rot: number, r: number, g: number, b: number, a: number) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.7})`;
      ctx.lineWidth = 0.6;
      // Triangle
      ctx.beginPath();
      ctx.moveTo(-s, -s * 0.7);
      ctx.lineTo(s * 0.5, 0);
      ctx.lineTo(-s, s * 0.7);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Cathode line
      ctx.beginPath();
      ctx.moveTo(s * 0.5, -s * 0.7);
      ctx.lineTo(s * 0.5, s * 0.7);
      ctx.stroke();
      // Leads
      ctx.beginPath(); ctx.moveTo(-s * 1.5, 0); ctx.lineTo(-s, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s * 0.5, 0); ctx.lineTo(s * 1.5, 0); ctx.stroke();
      ctx.restore();
    };

    const drawLED = (x: number, y: number, s: number, _rot: number, r: number, g: number, b: number, a: number) => {
      // Outer glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, s * 5);
      glow.addColorStop(0, `rgba(${r},${g},${b},${a * 0.35})`);
      glow.addColorStop(0.5, `rgba(${r},${g},${b},${a * 0.1})`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath(); ctx.arc(x, y, s * 5, 0, Math.PI * 2);
      ctx.fillStyle = glow; ctx.fill();
      // Core
      const core = ctx.createRadialGradient(x, y, 0, x, y, s);
      core.addColorStop(0, `rgba(255,255,255,${a * 0.9})`);
      core.addColorStop(0.4, `rgba(${r},${g},${b},${a})`);
      core.addColorStop(1, `rgba(${r},${g},${b},${a * 0.3})`);
      ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2);
      ctx.fillStyle = core; ctx.fill();
    };

    const drawCapacitor = (x: number, y: number, s: number, rot: number, r: number, g: number, b: number, a: number) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
      ctx.lineWidth = 0.8;
      // Plates
      ctx.beginPath(); ctx.moveTo(-s * 0.2, -s); ctx.lineTo(-s * 0.2, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s * 0.2, -s); ctx.lineTo(s * 0.2, s); ctx.stroke();
      // Leads
      ctx.beginPath(); ctx.moveTo(-s * 1.2, 0); ctx.lineTo(-s * 0.2, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s * 0.2, 0); ctx.lineTo(s * 1.2, 0); ctx.stroke();
      ctx.restore();
    };

    const drawResistor = (x: number, y: number, s: number, rot: number, r: number, g: number, b: number, a: number) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.3})`;
      ctx.lineWidth = 0.6;
      // Body
      ctx.fillRect(-s * 0.8, -s * 0.4, s * 1.6, s * 0.8);
      ctx.strokeRect(-s * 0.8, -s * 0.4, s * 1.6, s * 0.8);
      // Color bands
      const bands: RGB[] = [pick(COLORS), pick(COLORS), pick(COLORS)];
      for (let i = 0; i < 3; i++) {
        const bx = -s * 0.5 + i * s * 0.45;
        ctx.fillStyle = `rgba(${bands[i][0]},${bands[i][1]},${bands[i][2]},${a * 0.7})`;
        ctx.fillRect(bx, -s * 0.4, s * 0.12, s * 0.8);
      }
      // Leads
      ctx.beginPath(); ctx.moveTo(-s * 1.5, 0); ctx.lineTo(-s * 0.8, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s * 0.8, 0); ctx.lineTo(s * 1.5, 0); ctx.stroke();
      ctx.restore();
    };

    const drawDot = (x: number, y: number, s: number, _rot: number, r: number, g: number, b: number, a: number) => {
      // Glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, s * 4);
      glow.addColorStop(0, `rgba(${r},${g},${b},${a * 0.25})`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath(); ctx.arc(x, y, s * 4, 0, Math.PI * 2);
      ctx.fillStyle = glow; ctx.fill();
      // Core
      ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fill();
      // Bright center
      ctx.beginPath(); ctx.arc(x, y, s * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a * 0.5})`;
      ctx.fill();
    };

    const drawShape = (p: Particle, scale: number, alpha: number) => {
      const [r, g, b] = p.color;
      const s = p.size * scale;
      switch (p.shape) {
        case "chip": drawChip(p.x, p.y, s, p.rotation, r, g, b, alpha); break;
        case "diode": drawDiode(p.x, p.y, s, p.rotation, r, g, b, alpha); break;
        case "led": drawLED(p.x, p.y, s, p.rotation, r, g, b, alpha); break;
        case "capacitor": drawCapacitor(p.x, p.y, s, p.rotation, r, g, b, alpha); break;
        case "resistor": drawResistor(p.x, p.y, s, p.rotation, r, g, b, alpha); break;
        default: drawDot(p.x, p.y, s, p.rotation, r, g, b, alpha); break;
      }
    };

    // ═══ EVENTS ═══
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    // ═══ RENDER LOOP ═══
    const draw = () => {
      tRef.current++;
      const t = tRef.current;
      ctx.clearRect(0, 0, w, h);

      // ─── 1. AURORA ORBS ───
      for (const o of orbs) {
        const pulse = Math.sin(t * o.pulseS + o.pulseP) * 0.5 + 0.5;
        o.x = o.baseX + Math.sin(t * o.orbitS + o.phase) * o.orbitR;
        o.y = o.baseY + Math.cos(t * o.orbitS * 0.7 + o.phase) * o.orbitR * 0.6;
        o.baseX += Math.sin(t * o.speed) * 0.25;
        o.baseY += Math.cos(t * o.speed * 0.8) * 0.15;
        if (o.baseX < -o.size) o.baseX = w + o.size;
        if (o.baseX > w + o.size) o.baseX = -o.size;
        if (o.baseY < -o.size) o.baseY = h + o.size;
        if (o.baseY > h + o.size) o.baseY = -o.size;

        const s = o.size * (0.8 + pulse * 0.4);
        const alpha = o.glow * (0.6 + pulse * 0.4);
        const [r, g, b] = o.color;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, s);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.35})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(o.x, o.y, s, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
      }

      // ─── 2. CIRCUIT TRACE LINES (gradient constellation) ───
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const la = (1 - dist / 120) * 0.1;
            const [r1, g1, b1] = particles[i].color;
            const [r2, g2, b2] = particles[j].color;

            // Draw as right-angle PCB traces
            const midX = (particles[i].x + particles[j].x) / 2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r1},${g1},${b1},${la})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(midX, particles[i].y);
            ctx.strokeStyle = `rgba(${r2},${g2},${b2},${la})`;
            ctx.lineTo(midX, particles[j].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();

            // Junction dots
            ctx.beginPath();
            ctx.arc(midX, particles[i].y, 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r1},${g1},${b1},${la * 2})`;
            ctx.fill();
          }
        }
      }

      // ─── 3. ELECTRONICS PARTICLES ───
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      for (const p of particles) {
        // Organic drift
        const driftX = Math.sin(t * 0.006 + p.phase) * p.drift * 0.06;
        const driftY = Math.cos(t * 0.004 + p.phase * 1.3) * p.drift * 0.04;
        p.x += p.vx + driftX;
        p.y += p.vy + driftY;
        p.z += p.vz;
        p.rotation += p.rotSpeed;

        // Mouse repulsion
        const dx = p.x - mx, dy = p.y - my;
        const md = Math.sqrt(dx * dx + dy * dy);
        if (md < 120 && md > 0) {
          const force = (120 - md) / 120 * 0.4;
          p.vx += (dx / md) * force;
          p.vy += (dy / md) * force;
        }

        // Dampen & clamp
        p.vx *= 0.985; p.vy *= 0.985;
        p.vx = Math.max(-1.5, Math.min(1.5, p.vx));
        p.vy = Math.max(-1.5, Math.min(1.5, p.vy));

        // Wrap
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
        if (p.z < 0.15 || p.z > 1) p.vz *= -1;

        // 3D depth
        const depthScale = 0.3 + p.z * 0.7;
        const twinkle = Math.sin(t * p.pulseSpeed + p.pulsePhase) * 0.25 + 0.75;
        const alpha = p.opacity * depthScale * twinkle;

        drawShape(p, depthScale, alpha);
      }

      // ─── 4. SHOOTING STREAMERS ───
      if (t % 90 === 0) spawnStreamer();
      for (let i = streamers.length - 1; i >= 0; i--) {
        const s = streamers[i];
        s.life++;
        const prog = s.life / s.maxLife;
        const fade = Math.min(prog * 5, 1) * (prog > 0.7 ? Math.max(1 - (prog - 0.7) / 0.3, 0) : 1);
        const alpha = s.opacity * fade;

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const ex = s.x - Math.cos(s.angle) * s.length;
        const ey = s.y - Math.sin(s.angle) * s.length;

        const [r, g, b] = s.color;
        const grad = ctx.createLinearGradient(s.x, s.y, ex, ey);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},${alpha * 0.35})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.strokeStyle = grad;
        ctx.lineWidth = s.width; ctx.lineCap = "round";
        ctx.moveTo(s.x, s.y); ctx.lineTo(ex, ey); ctx.stroke();

        // Head glow
        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
        hg.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
        hg.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = hg; ctx.fill();

        if (s.life >= s.maxLife) streamers.splice(i, 1);
      }

      // ─── 5. CURSOR GLOW ───
      if (mx > 0 && my > 0 && mx < w && my < h) {
        const cg = ctx.createRadialGradient(mx, my, 0, mx, my, 100);
        cg.addColorStop(0, "rgba(220,20,60,0.05)");
        cg.addColorStop(0.4, "rgba(99,102,241,0.03)");
        cg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(mx, my, 100, 0, Math.PI * 2);
        ctx.fillStyle = cg; ctx.fill();
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
