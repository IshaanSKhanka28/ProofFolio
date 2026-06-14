"use client";

// TiltCard: tilts in 3D toward the cursor and lifts with a neon glow on hover.
// Uses Framer Motion springs so the motion stays smooth. Wraps a project card.

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function TiltCard({ children, className = "" }) {
  // Raw pointer position within the card (-0.5 .. 0.5 on each axis).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Smooth the values with springs.
  const sx = useSpring(mx, { stiffness: 150, damping: 15 });
  const sy = useSpring(my, { stiffness: 150, damping: 15 });

  // Map position to rotation degrees.
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`h-full glow-green ${className}`}
    >
      {children}
    </motion.div>
  );
}
