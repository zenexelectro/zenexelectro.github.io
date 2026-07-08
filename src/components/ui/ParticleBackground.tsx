"use client";

import { useEffect, useRef } from "react";

/*
 * Premium Animated Gradient Mesh — inspired by Stripe, Linear, Vercel.
 * No particles. Just smooth, flowing color gradients that morph and blend.
 * Subtle film-grain overlay for depth.
 */

interface GradientBlob {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  radiusX: number;
  radiusY: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999, targetX: -9999, targetY: -9999 });
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
      // Update blob base positions on resize
      if (blobs.length > 0) {
        blobs[0].baseX = w * 0.15; blobs[0].baseY = h * 0.3;
        blobs[1].baseX = w * 0.7;  blobs[1].baseY = h * 0.2;
        blobs[2].baseX = w * 0.5;  blobs[2].baseY = h * 0.7;
        blobs[3].baseX = w * 0.85; blobs[3].baseY = h * 0.6;
        blobs[4].baseX = w * 0.3;  blobs[4].baseY = h * 0.8;
      }
    };

    // ═══ GRADIENT MESH BLOBS ═══
    const blobs: GradientBlob[] = [
      {
        x: 0, y: 0, baseX: 0, baseY: 0,
        size: 350,
        color: "rgba(220, 20, 60, 0.08)",  // Cherry red
        phaseX: 0, phaseY: 0.5,
        speedX: 0.0004, speedY: 0.0003,
        radiusX: 80, radiusY: 60,
      },
      {
        x: 0, y: 0, baseX: 0, baseY: 0,
        size: 400,
        color: "rgba(99, 102, 241, 0.07)",  // Indigo
        phaseX: 1.2, phaseY: 2.1,
        speedX: 0.0003, speedY: 0.0005,
        radiusX: 100, radiusY: 70,
      },
      {
        x: 0, y: 0, baseX: 0, baseY: 0,
        size: 320,
        color: "rgba(16, 185, 129, 0.06)",  // Emerald
        phaseX: 2.5, phaseY: 0.8,
        speedX: 0.0005, speedY: 0.0004,
        radiusX: 90, radiusY: 80,
      },
      {
        x: 0, y: 0, baseX: 0, baseY: 0,
        size: 280,
        color: "rgba(168, 85, 247, 0.06)",  // Purple
        phaseX: 3.8, phaseY: 1.5,
        speedX: 0.0003, speedY: 0.0006,
        radiusX: 70, radiusY: 90,
      },
      {
        x: 0, y: 0, baseX: 0, baseY: 0,
        size: 300,
        color: "rgba(6, 182, 212, 0.05)",   // Cyan
        phaseX: 5.0, phaseY: 3.2,
        speedX: 0.0004, speedY: 0.0003,
        radiusX: 85, radiusY: 65,
      },
    ];

    resize();

    // ═══ GRAIN TEXTURE (pre-rendered for performance) ═══
    const grainCanvas = document.createElement("canvas");
    grainCanvas.width = 256;
    grainCanvas.height = 256;
    const grainCtx = grainCanvas.getContext("2d")!;
    const generateGrain = () => {
      const imageData = grainCtx.createImageData(256, 256);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 8; // Very subtle
      }
      grainCtx.putImageData(imageData, 0, 0);
    };
    generateGrain();

    // ═══ EVENTS ═══
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - r.left;
      mouseRef.current.targetY = e.clientY - r.top;
    };
    const onLeave = () => {
      mouseRef.current.targetX = -9999;
      mouseRef.current.targetY = -9999;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    // ═══ RENDER ═══
    const draw = () => {
      tRef.current++;
      const t = tRef.current;

      // Smooth mouse interpolation
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.05;
      m.y += (m.targetY - m.y) * 0.05;

      ctx.clearRect(0, 0, w, h);

      // ─── 1. GRADIENT MESH ───
      ctx.globalCompositeOperation = "screen";

      for (const blob of blobs) {
        // Organic orbit motion
        blob.x = blob.baseX + Math.sin(t * blob.speedX + blob.phaseX) * blob.radiusX;
        blob.y = blob.baseY + Math.cos(t * blob.speedY + blob.phaseY) * blob.radiusY;

        // Mouse influence — blobs drift toward cursor
        if (m.x > 0 && m.y > 0) {
          const dx = m.x - blob.x;
          const dy = m.y - blob.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 400) {
            const pull = (400 - dist) / 400 * 15;
            blob.x += (dx / dist) * pull * 0.02;
            blob.y += (dy / dist) * pull * 0.02;
          }
        }

        // Breathing size
        const breathe = Math.sin(t * 0.002 + blob.phaseX) * 0.1 + 1;
        const s = blob.size * breathe;

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, s);
        grad.addColorStop(0, blob.color);
        grad.addColorStop(0.5, blob.color.replace(/[\d.]+\)$/, (parseFloat(blob.color.match(/[\d.]+\)$/)?.[0] || "0") * 0.4).toFixed(3) + ")"));
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, s, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      // ─── 2. CURSOR SPOTLIGHT ───
      if (m.x > 0 && m.y > 0 && m.x < w && m.y < h) {
        const spotlight = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 200);
        spotlight.addColorStop(0, "rgba(255,255,255,0.03)");
        spotlight.addColorStop(0.5, "rgba(220,20,60,0.015)");
        spotlight.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(m.x, m.y, 200, 0, Math.PI * 2);
        ctx.fillStyle = spotlight;
        ctx.fill();
      }

      // ─── 3. FILM GRAIN OVERLAY ───
      if (t % 4 === 0) generateGrain(); // Refresh grain every 4 frames
      ctx.globalAlpha = 0.4;
      const pattern = ctx.createPattern(grainCanvas, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalAlpha = 1;

      // ─── 4. SUBTLE VIGNETTE ───
      const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.9);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.15)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

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
