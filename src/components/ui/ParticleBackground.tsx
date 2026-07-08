"use client";

import { useEffect, useRef } from "react";

// === PREMIUM ANIMATED GRADIENT MESH ===
// Pure, clean, professional gradients - Stripe/Vercel/Linear style
// No particles, no dots - just flowing light blobs and film grain

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
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
    window.addEventListener("resize", resize);
    
    // Generate subtle film grain pattern
    const grainCanvas = document.createElement("canvas");
    grainCanvas.width = 128;
    grainCanvas.height = 128;
    const gCtx = grainCanvas.getContext("2d");
    if (gCtx) {
      const imgData = gCtx.createImageData(128, 128);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const v = Math.random() * 255;
        imgData.data[i] = v;
        imgData.data[i+1] = v;
        imgData.data[i+2] = v;
        imgData.data[i+3] = 12; // Very subtle noise
      }
      gCtx.putImageData(imgData, 0, 0);
    }
    
    // Define flowing color blobs (RGB values)
    // Cherry Red, Emerald, Indigo, Purple, Cyan
    const blobs = [
      { color: "210, 4, 45", rMult: 1.4, speed: 0.0008, offset: 0, tx: 0, ty: 0, x: 0, y: 0 },
      { color: "16, 185, 129", rMult: 1.2, speed: 0.0011, offset: Math.PI / 2, tx: 0, ty: 0, x: 0, y: 0 },
      { color: "79, 70, 229", rMult: 1.5, speed: 0.0009, offset: Math.PI, tx: 0, ty: 0, x: 0, y: 0 },
      { color: "147, 51, 234", rMult: 1.3, speed: 0.0013, offset: Math.PI * 1.5, tx: 0, ty: 0, x: 0, y: 0 },
      { color: "6, 182, 212", rMult: 1.1, speed: 0.001, offset: Math.PI / 4, tx: 0, ty: 0, x: 0, y: 0 },
    ];
    
    let mouseX = w / 2;
    let mouseY = h / 2;
    
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMove);
    
    let animId: number;
    let time = 0;
    
    const draw = () => {
      time += 1;
      
      // Deep dark background
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#020203"; 
      ctx.fillRect(0, 0, w, h);
      
      // Blend colors like light
      ctx.globalCompositeOperation = "screen";
      
      const maxDim = Math.max(w, h);
      
      blobs.forEach((b) => {
        const radius = maxDim * b.rMult;
        
        // Base orbit motion
        const cx = w / 2 + Math.cos(time * b.speed + b.offset) * (w * 0.35);
        const cy = h / 2 + Math.sin(time * b.speed * 0.8 + b.offset) * (h * 0.35);
        
        // Gentle pull towards cursor
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        b.tx = cx + (dx * 0.15);
        b.ty = cy + (dy * 0.15);
        
        // Smooth interpolation
        if (!b.x) { b.x = b.tx; b.y = b.ty; }
        b.x += (b.tx - b.x) * 0.02;
        b.y += (b.ty - b.y) * 0.02;
        
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, radius);
        grad.addColorStop(0, `rgba(${b.color}, 0.5)`);
        grad.addColorStop(0.5, `rgba(${b.color}, 0.15)`);
        grad.addColorStop(1, `rgba(${b.color}, 0)`);
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Cursor Spotlight (Soft crimson/white glow)
      const spotlightRadius = maxDim * 0.4;
      const spotlight = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, spotlightRadius);
      spotlight.addColorStop(0, "rgba(255, 255, 255, 0.06)");
      spotlight.addColorStop(0.2, "rgba(220, 20, 60, 0.03)");
      spotlight.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = spotlight;
      ctx.fillRect(0, 0, w, h);
      
      // Reset composite for overlays
      ctx.globalCompositeOperation = "source-over";
      
      // Vignette (Dark frame)
      const vig = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.9);
      vig.addColorStop(0, "rgba(2,2,3,0)");
      vig.addColorStop(1, "rgba(2,2,3,0.95)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
      
      // Film Grain Overlay
      ctx.fillStyle = ctx.createPattern(grainCanvas, "repeat")!;
      ctx.fillRect(0, 0, w, h);
      
      animId = requestAnimationFrame(draw);
    };
    draw();
    
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
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
