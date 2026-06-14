"use client";

// app/components/ActivityStats.js
// A row of bold stat blocks in our Bento style: charcoal cards with
// forest-green accent numbers. Shows Repositories, Total Stars, Total Forks,
// Followers, and Recent Commits. Wraps to 2 columns on mobile, 5 across on
// wider screens. The blocks stagger in on scroll (Framer Motion).

import { motion } from "framer-motion";

export default function ActivityStats({ stats }) {
  // Read each number from the stats object, defaulting to 0 if missing.
  const blocks = [
    { value: stats?.totalRepos ?? 0, label: "Repositories" },
    { value: stats?.totalStars ?? 0, label: "Total Stars" },
    { value: stats?.totalForks ?? 0, label: "Total Forks" },
    { value: stats?.followers ?? 0, label: "Followers" },
    { value: stats?.recentCommits ?? 0, label: "Recent Commits" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {blocks.map((block, i) => (
        <motion.div
          key={block.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          // Each block enters a beat after the previous one (the stagger).
          transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.06 }}
          className="bg-card border border-border rounded-2xl p-6 text-center"
        >
          {/* Big number on top (forest-green gradient). */}
          <div className="brand-grad font-display text-3xl font-bold sm:text-4xl">
            {block.value.toLocaleString()}
          </div>
          {/* Small muted label below. */}
          <div className="mt-2 text-sm text-muted">{block.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
