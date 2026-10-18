"use client";

import { useEffect, useRef, useState } from "react";

type Form = "core" | "female" | "male";
const FORMS: { id: Form; label: string }[] = [
  { id: "core", label: "Core" },
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
];
const N = 3400;

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type P = [number, number, number];

function build(form: Form): Float32Array {
  const r = rng(form === "core" ? 11 : form === "female" ? 23 : 37);
  const pts: P[] = [];
  const dir = (): P => {
    const u = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    return [s * Math.cos(a), u, s * Math.sin(a)];
  };
  const shell = (n: number, f: (d: P) => P | null) => {
    let k = 0, guard = 0;
    while (k < n && guard++ < n * 40) { const p = f(dir()); if (p) { pts.push(p); k++; } }
  };

  if (form === "core") {
    shell(1500, (d) => { const k = 0.8 + r() * 0.05; return [d[0] * k, d[1] * k, d[2] * k]; });
    shell(500, () => { const d = dir(), k = Math.pow(r(), 1.6) * 0.45; return [d[0] * k, d[1] * k, d[2] * k]; });
    const rings: Array<[number, number, number]> = [[1.0, 0.4, 0], [1.14, -0.7, 0.5], [1.28, 1.1, -0.4]];
    rings.forEach(([rad, tx, tz]) => {
      for (let i = 0; i < 467; i++) {
        const a = (i / 467) * Math.PI * 2, x = Math.cos(a) * rad, z = Math.sin(a) * rad;
        const y1 = z * Math.sin(tx), z1 = z * Math.cos(tx);
        pts.push([x * Math.cos(tz) - y1 * Math.sin(tz), x * Math.sin(tz) + y1 * Math.cos(tz), z1]);
      }
    });
  } else {
    const f = form === "female";
    const hy = 0.62; // head centre height
    const hw = f ? 0.46 : 0.52, hh = f ? 0.62 : 0.64, hd = f ? 0.5 : 0.54;
    const exp = f ? 1 : 0.78;
    const head = f ? 1050 : 1150;
    // head with tapered jaw
    shell(head, (d) => {
      const sg = (v: number) => Math.sign(v) * Math.pow(Math.abs(v), exp);
      const x = sg(d[0]), y = sg(d[1]), z = sg(d[2]);
      const taper = y < 0 ? (f ? 0.62 + 0.38 * (1 + y) : 0.82 + 0.18 * (1 + y)) : 1;
      return [x * hw * taper, hy + y * hh, z * hd * (y < -0.6 ? 0.9 : 1)];
    });
    // face details: nose ridge, brows, eyes, lips
    for (let i = 0; i < 70; i++) { const t = r(); pts.push([(r() - 0.5) * 0.07, hy - 0.12 + t * 0.28 * -1 + 0.16, hd + 0.02 + t * 0.07]); }
    [-1, 1].forEach((sx) => {
      for (let i = 0; i < 46; i++) { const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * 0.055; pts.push([sx * 0.18 + Math.cos(a) * rr * 1.5, hy + 0.1 + Math.sin(a) * rr, hd * 0.9 + 0.02]); }
      for (let i = 0; i < 16; i++) { const t = r(); pts.push([sx * (0.08 + t * 0.2), hy + 0.2 + (f ? 0.03 : 0.0) + t * 0.01 + (r() - 0.5) * 0.015, hd * 0.86]); }
    });
    for (let i = 0; i < 40; i++) { const t = r() * 2 - 1; pts.push([t * 0.12, hy - 0.36 + t * t * 0.035, hd * 0.84]); }
    // hair
    if (f) {
      shell(520, (d) => (d[2] < 0.25 || d[1] > 0.55 ? [d[0] * 0.56, hy + 0.04 + d[1] * 0.68, d[2] * 0.58 - 0.04] : null));
      for (let i = 0; i < 640; i++) {
        const t = r(), side = r() < 0.5 ? -1 : 1, spread = (r() - 0.5) * 0.28;
        pts.push([side * (0.5 + 0.1 * t + Math.abs(spread) * 0.4), hy + 0.1 - t * 1.05, -0.12 + spread + t * 0.05]);
      }
    } else {
      shell(300, (d) => (d[1] > 0.38 && d[2] < 0.55 ? [d[0] * 0.58, hy + 0.02 + d[1] * 0.69, d[2] * 0.6 - 0.02] : null));
    }
    // neck
    const nr = f ? 0.15 : 0.21;
    for (let i = 0; i < (f ? 220 : 280); i++) { const a = r() * Math.PI * 2; pts.push([Math.cos(a) * nr, hy - 0.58 - r() * 0.42, Math.sin(a) * nr * 0.9]); }
    // shoulders and chest
    const sw = f ? 0.92 : 1.18, sd = f ? 0.4 : 0.5;
    const used = pts.length;
    shell(N - used, (d) => (d[1] > -0.2 ? [d[0] * sw, -0.38 + d[1] * 0.3 - (Math.abs(d[0]) > 0.7 ? 0.12 * (Math.abs(d[0]) - 0.7) * 3 : 0), d[2] * sd] : null));
  }
  while (pts.length < N) pts.push(pts[pts.length % 40]);
  const out = new Float32Array(N * 3);
  const cy = form === "core" ? 0 : 0.18;
  for (let i = 0; i < N; i++) { out[i * 3] = pts[i][0]; out[i * 3 + 1] = pts[i][1] - cy; out[i * 3 + 2] = pts[i][2]; }
  return out;
}

export function Avatar() {
  const [form, setForm] = useState<Form>("core");
  const canvas = useRef<HTMLCanvasElement>(null);
  const target = useRef<Form>("core");
  const api = useRef<{ morphTo: (f: Form) => void } | null>(null);

  useEffect(() => {
    const cv = canvas.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = window.innerWidth <= 640 ? 2200 : N;
    const shapes: Record<Form, Float32Array> = { core: build("core"), female: build("female"), male: build("male") };
    const from = new Float32Array(shapes.core), to = new Float32Array(shapes.core), cur = new Float32Array(shapes.core);
    const delay = new Float32Array(N); const rr = rng(5); for (let i = 0; i < N; i++) delay[i] = rr();
    let last = performance.now(), m = 1, w = 0, h = 0, raf = 0, visible = true, t0 = performance.now();
    let ink = "#0b0b0c", acc = "#c93a12";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const colors = () => { const cs = getComputedStyle(document.documentElement); ink = cs.getPropertyValue("--kd-ink").trim() || ink; acc = cs.getPropertyValue("--kd-acc").trim() || acc; };
    const size = () => { const b = cv.getBoundingClientRect(); w = b.width; h = b.height; cv.width = Math.floor(w * dpr); cv.height = Math.floor(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };

    api.current = {
      morphTo: (f) => { from.set(cur); to.set(shapes[f]); m = reduced ? 1 : 0; if (reduced) cur.set(to); },
    };

    const draw = (now: number) => {
      raf = 0;
      if (!visible) return;
      const t = (now - t0) / 1000;
      const dt = Math.min(0.25, (now - last) / 1000); last = now;
      if (m < 1) m = Math.min(1, m + dt / 1.5);
      const hero = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hero")) || 0;
      const isCore = target.current === "core";
      const ang = reduced ? -0.25 : (isCore ? t * 0.35 : Math.sin(t * 0.55) * 0.55) + hero * 0.9;
      const tilt = 0.12 - hero * 0.1;
      const ca = Math.cos(ang), sa = Math.sin(ang), ct = Math.cos(tilt), st = Math.sin(tilt);
      const S = Math.min(w, h) * 0.36, cx = w / 2, cy = h / 2, D = 3.4;
      ctx.clearRect(0, 0, w, h);
      // soft core halo behind the particle cloud for depth
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 1.5);
      halo.addColorStop(0, acc + "18");
      halo.addColorStop(0.55, acc + "0a");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < count; i++) {
        const k = i * 3;
        const e0 = Math.min(1, Math.max(0, m * 1.5 - delay[i] * 0.5)); const e = e0 * e0 * (3 - 2 * e0);
        cur[k] = from[k] + (to[k] - from[k]) * e; cur[k + 1] = from[k + 1] + (to[k + 1] - from[k + 1]) * e; cur[k + 2] = from[k + 2] + (to[k + 2] - from[k + 2]) * e;
        let x = cur[k], y = cur[k + 1], z = cur[k + 2];
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
        const pr = D / (D - z2);
        const depth = (z2 + 1.3) / 2.6;
        const d01 = Math.min(1, Math.max(0, depth));
        ctx.globalAlpha = 0.18 + d01 * 0.8;
        ctx.fillStyle = i % 19 === 0 ? acc : ink;
        const sz = 0.9 + d01 * 1.5;
        const px = cx + x1 * S * pr, py = cy - y2 * S * pr;
        ctx.beginPath();
        ctx.arc(px, py, sz * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduced || m < 1) raf = requestAnimationFrame(draw);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };

    size(); colors(); draw(performance.now());
    const mo = new MutationObserver(() => { colors(); if (reduced) kick(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) kick(); });
    io.observe(cv);
    const onResize = () => { size(); kick(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); mo.disconnect(); io.disconnect(); window.removeEventListener("resize", onResize); };
  }, []);

  const pick = (f: Form) => { target.current = f; setForm(f); api.current?.morphTo(f); };

  return (
    <div className="kd-avatar-wrap">
      <div className="kd-avatar">
        <canvas ref={canvas} role="img" aria-label={`3D particle avatar, ${form} form`} />
      </div>
      <div role="group" aria-label="Avatar form" className="kd-forms">
        {FORMS.map((f) => (
          <button key={f.id} type="button" aria-pressed={form === f.id} onClick={() => pick(f.id)}>{f.label}</button>
        ))}
      </div>
    </div>
  );
}
