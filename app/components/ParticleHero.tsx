"use client";

import { useEffect, useRef } from "react";

type P3 = { x: number; y: number; z: number };

/**
 * Pseudo-3D hero: rotating point sphere with perspective projection and
 * neighbor linking. Pure canvas, no WebGL dependency. Honors reduced motion.
 */
export function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let W = 0;
    let H = 0;
    let R = 1; // sphere radius
    let cx = 0;
    let cy = 0;

    // Fibonacci sphere for even point distribution
    const N = 220;
    const pts: P3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r });
    }

    let rotY = 0;
    const rotX = -0.35;
    let mx = 0;
    let my = 0; // normalized mouse offset for parallax
    let targetMx = 0;
    let targetMy = 0;

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) return;
      W = canvas.width = w;
      H = canvas.height = h;
      cx = W / 2;
      cy = H / 2;
      R = Math.min(W, H) * 0.32;
    };

    const ro = new ResizeObserver(() => {
      const prevW = W;
      resize();
      if (W !== prevW && W > 0 && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    });
    ro.observe(canvas);

    const project = (p: P3, rotYv: number, rotXv: number) => {
      // rotate around Y then X
      const cosY = Math.cos(rotYv);
      const sinY = Math.sin(rotYv);
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const cosX = Math.cos(rotXv);
      const sinX = Math.sin(rotXv);
      const y1 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;
      // perspective
      const fov = 2.2;
      const scale = fov / (fov + z2);
      return {
        sx: cx + (x1 + mx * 0.3) * R * scale,
        sy: cy + (y1 + my * 0.3) * R * scale,
        depth: (z2 + 1) / 2, // 0 back, 1 front
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      rotY += 0.0022;

      // ease mouse parallax
      mx += (targetMx - mx) * 0.05;
      my += (targetMy - my) * 0.05;

      const projected = pts.map((p) => project(p, rotY, rotX));

      // links (neighbors on the sphere surface)
      for (let i = 0; i < N; i++) {
        const a = projected[i];
        for (let j = i + 1; j < N; j++) {
          const b = projected[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const d2 = dx * dx + dy * dy;
          const maxLink = R * 0.34;
          if (d2 < maxLink * maxLink) {
            const alpha = 0.10 * (1 - Math.sqrt(d2) / maxLink) * Math.min(a.depth, b.depth);
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // points, back to front
      for (const s of projected) {
        const size = 0.6 + s.depth * 1.6;
        const alpha = 0.15 + s.depth * 0.65;
        ctx.beginPath();
        ctx.arc(s.sx, s.sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      // core glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.55);
      glow.addColorStop(0, "rgba(0, 229, 255, 0.10)");
      glow.addColorStop(1, "rgba(0, 229, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      targetMx = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMy = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    resize();
    // draw after layout settles (first paint)
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    if (!reduced) window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="kd-hero-canvas" aria-hidden="true" />;
}
