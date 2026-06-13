"use client";

// NeonBackground: a fixed full-screen layer for the generated portfolio.
// A dark base, two blurred neon blobs, and a light drifting particle field
// drawn on a <canvas> (no extra library). Used only on /u/<username>.

import { useEffect, useRef } from "react";

export default function NeonBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Skip the animation for users who prefer reduced motion.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // A small particle count keeps this cheap on low-end devices.
    const count = Math.min(60, Math.floor(width / 26));
    const colors = ["#22d3ee", "#a855f7", "#3b82f6"];
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));

    let raf = 0;
    function frame() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.55;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function onResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", onResize);
    if (!reduce) frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 50% 0%, #0a0c18, #05060c 70%)" }}
      />
      <div
        className="absolute -top-32 -left-24 h-96 w-96 rounded-full opacity-40"
        style={{ background: "#22d3ee", filter: "blur(120px)" }}
      />
      <div
        className="absolute top-1/3 -right-24 h-96 w-96 rounded-full opacity-30"
        style={{ background: "#a855f7", filter: "blur(120px)" }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
