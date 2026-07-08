"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  opacity: number;
  opacitySpeed: number;
}

const COLORS = ["#D2042D", "#10b981", "#3b82f6", "#a855f7", "#f59e0b", "#ffffff"];

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const NUM_PARTICLES = 100;
    const particles: Particle[] = [];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: rand(0, width),
        y: rand(0, height),
        z: rand(0.1, 1),
        vx: rand(-0.4, 0.4),
        vy: rand(-0.4, 0.4),
        vz: rand(-0.003, 0.003),
        size: rand(1, 3.5),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: rand(0.1, 0.6),
        opacitySpeed: rand(0.003, 0.008),
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineOpacity = (1 - dist / 130) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      for (const p of particles) {
        // 3D depth effect: deeper = smaller, more transparent
        const depthScale = 0.4 + p.z * 0.6;
        const drawSize = p.size * depthScale;
        const drawOpacity = p.opacity * depthScale;

        // Mouse repulsion
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const dx = p.x - mx;
        const dy = p.y - my;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);
        if (mouseDist < 100 && mouseDist > 0) {
          const force = (100 - mouseDist) / 100;
          p.vx += (dx / mouseDist) * force * 0.3;
          p.vy += (dy / mouseDist) * force * 0.3;
        }

        // Clamp velocity
        p.vx = Math.max(-1.5, Math.min(1.5, p.vx));
        p.vy = Math.max(-1.5, Math.min(1.5, p.vy));

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Dampen
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Bounce walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        if (p.z < 0.1 || p.z > 1) p.vz *= -1;

        // Opacity pulse
        p.opacity += p.opacitySpeed;
        if (p.opacity > 0.6 || p.opacity < 0.1) p.opacitySpeed *= -1;

        // Draw glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawSize * 3);
        gradient.addColorStop(0, p.color + "88");
        gradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = drawOpacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
