"use client";

import { useEffect, useRef } from "react";

// === ADVANCED PRO LEVEL: INTERACTIVE 3D CYBER-MESH WAVE ===
// A flying perspective wireframe terrain with data nodes, color-mapped elevation, and mouse parallax.

interface Point3D {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  rz: number;
  scale: number;
  color: string;
  isDataNode: boolean;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const mouseRef = useRef({ targetX: 0, targetY: 350, x: 0, y: 350 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // False for better performance, we'll draw a solid background
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      // Limit DPR to 1.5 for performance on extremely high-res displays while maintaining crispness
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // ═══ SETTINGS ═══
    const cols = 45;
    const rows = 45;
    const spacing = 110;
    const focalLength = 550;
    
    // Lerp color helper
    const lerpColor = (c1: number[], c2: number[], t: number) => [
      Math.round(c1[0] + (c2[0] - c1[0]) * t),
      Math.round(c1[1] + (c2[1] - c1[1]) * t),
      Math.round(c1[2] + (c2[2] - c1[2]) * t),
    ];

    const getColor = (y: number, alpha: number) => {
      // Elevation roughly ranges from -180 to 180
      let t = (y + 180) / 360;
      t = Math.max(0, Math.min(1, t));
      
      // Map elevation to brightness — low = 35% opacity, high = 100% opacity white
      const baseAlpha = 0.35 + (t * 0.65);
      const finalAlpha = baseAlpha * alpha;
      
      return `rgba(255, 255, 255, ${finalAlpha.toFixed(3)})`;
    };

    // Terrain generator
    const getElevation = (x: number, z: number, t: number) => {
      let y = 0;
      y += Math.sin(x * 0.003 + t * 1.5) * 80;
      y += Math.cos(z * 0.002 - t * 0.9) * 110;
      const d = Math.sqrt(x * x + z * z);
      y += Math.sin(d * 0.004 - t * 2.5) * 70;
      return y;
    };

    // ═══ EVENTS ═══
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      // Calculate mouse influence for camera parallax
      mouseRef.current.targetX = (e.clientX - r.left - w / 2) * 1.5;
      mouseRef.current.targetY = 350 + (e.clientY - r.top - h / 2) * 0.8;
    };
    const onLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 350;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    // ═══ RENDER LOOP ═══
    const draw = () => {
      timeRef.current += 0.015;
      const t = timeRef.current;
      
      // Smooth camera interpolation
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.05;
      m.y += (m.targetY - m.y) * 0.05;

      const camX = m.x;
      const camY = m.y;
      const camZ = -800; // Camera distance from origin
      const pitch = 0.35; // Look down angle
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      // Dark background — slightly lighter so white grid reads clearly
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);

      const points: (Point3D | null)[][] = Array.from({ length: cols }, () => new Array(rows).fill(null));

      // 1. Calculate 3D points & project
      const flySpeed = t * 250;
      const zOffset = flySpeed % spacing;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i - cols / 2) * spacing;
          // Grid shifts forward, wrapping around
          const z = (j - 5) * spacing - zOffset; 

          const y = getElevation(x, z - flySpeed, t);

          // Translate relative to camera
          const dx = x - camX;
          const dy = y - camY;
          const dz = z - camZ;

          // Rotate around X axis (pitch)
          const rx = dx;
          const ry = dy * cosP - dz * sinP;
          const rz = dy * sinP + dz * cosP;

          // Frustum culling (behind camera or too close)
          if (rz < 50) continue;

          // Project to 2D
          const scale = focalLength / rz;
          const px = w / 2 + rx * scale;
          const py = h / 2 - ry * scale;

          // Distance fade (fade out in the far horizon)
          const maxDist = 3200;
          let alpha = 1 - (rz / maxDist);
          // Keep alpha high so white is actually visible
          alpha = Math.max(0, Math.min(1, alpha)) * 0.85 + 0.15;
          alpha = Math.min(1, alpha);
          
          // Data nodes (flashing energy packets on the grid)
          // Pseudo-random fast pattern
          const isDataNode = (i * 27 + j * 19 + Math.floor(t * 15)) % 150 === 0;

          points[i][j] = {
            x, y, z, px, py, rz, scale,
            color: getColor(y, alpha * 0.8),
            isDataNode
          };
        }
      }

      // 2. Draw Wireframe & Nodes
      // We draw back-to-front by reversing the Z loop (j) for proper visual stacking of nodes
      for (let j = rows - 1; j >= 0; j--) {
        for (let i = 0; i < cols; i++) {
          const p = points[i][j];
          if (!p) continue;

          // Draw connecting lines
          // Thicker, more visible white lines
          ctx.lineWidth = Math.max(0.6, 1.8 * p.scale);
          
          // Connect to right
          if (i < cols - 1) {
            const right = points[i + 1][j];
            if (right) {
              const grad = ctx.createLinearGradient(p.px, p.py, right.px, right.py);
              grad.addColorStop(0, p.color);
              grad.addColorStop(1, right.color);
              ctx.strokeStyle = grad;
              ctx.beginPath();
              ctx.moveTo(p.px, p.py);
              ctx.lineTo(right.px, right.py);
              ctx.stroke();
            }
          }

          // Connect to bottom
          if (j < rows - 1) {
            const down = points[i][j + 1];
            if (down) {
              const grad = ctx.createLinearGradient(p.px, p.py, down.px, down.py);
              grad.addColorStop(0, p.color);
              grad.addColorStop(1, down.color);
              ctx.strokeStyle = grad;
              ctx.beginPath();
              ctx.moveTo(p.px, p.py);
              ctx.lineTo(down.px, down.py);
              ctx.stroke();
            }
          }

          // Draw intersection node
          if (p.isDataNode) {
            // Large outer white glow
            const glow = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, Math.max(6, 20 * p.scale));
            glow.addColorStop(0, "rgba(255,255,255,0.8)");
            glow.addColorStop(0.4, "rgba(255,255,255,0.3)");
            glow.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(p.px, p.py, Math.max(6, 20 * p.scale), 0, Math.PI * 2);
            ctx.fill();

            // Solid bright white core
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(p.px, p.py, Math.max(2, 5 * p.scale), 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Standard visible white node
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.px, p.py, Math.max(0.8, 2 * p.scale), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 3. Vignette Overlay (Darkens edges and horizon seamlessly)
      const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.9);
      vignette.addColorStop(0, "rgba(5,5,5,0)");
      vignette.addColorStop(1, "rgba(5,5,5,1)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // Also add a top-down linear gradient to hide the horizon cutoff line perfectly
      const horizonFade = ctx.createLinearGradient(0, 0, 0, h * 0.4);
      horizonFade.addColorStop(0, "rgba(5,5,5,1)");
      horizonFade.addColorStop(1, "rgba(5,5,5,0)");
      ctx.fillStyle = horizonFade;
      ctx.fillRect(0, 0, w, h * 0.4);

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
