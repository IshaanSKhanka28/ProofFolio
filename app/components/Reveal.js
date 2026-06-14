"use client";

// Reveal: fades + slides its children up as they scroll into view (Framer
// Motion). Fast and subtle. `once` means it only plays the first time, and
// `amount: 0.15` triggers as soon as ~15% is visible (reliable firing).

import { motion } from "framer-motion";

export default function Reveal({ children, delay = 0, y = 16, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
