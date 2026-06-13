"use client";

// app/components/PortfolioView.js
// The visual portfolio: hero (with the floating 3D object), an optional action
// slot (used for the Save & Share button), a stats row, the language bars, and
// the project tilt cards. Shared by /u/<username> (live data) and /p/<slug>
// (saved data) so the look stays identical in both places.

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";
import LanguageBars from "./LanguageBars";
import ProjectCard from "./ProjectCard";

// The 3D scene is loaded client-only so Three.js never runs on the server.
const HeroScene3D = dynamic(() => import("./HeroScene3D"), { ssr: false });

export default function PortfolioView({
  username,
  profile,
  languages,
  repos,
  actionSlot,
}) {
  // Fall back to the username if GitHub has no display name.
  const displayName = profile.name || username;
  // Add up the stars across all repos.
  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);

  const stats = [
    { value: profile.followers, label: "Followers" },
    { value: repos.length, label: "Repositories" },
    { value: totalStars, label: "Total Stars" },
  ];

  return (
    <main className="relative">
      {/* ---------- Hero ---------- */}
      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center gap-8 px-6 pt-24 md:flex-row md:pt-0">
        {/* Soft forest-green glow behind the hero. */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--accent-soft), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Left: identity. */}
        <div className="flex-1">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            src={profile.avatarUrl}
            alt={displayName}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-accent/50"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06 }}
            className="kicker mt-6"
          >
            @{username}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="brand-grad font-display text-5xl font-bold leading-tight sm:text-6xl mt-3"
          >
            {displayName}
          </motion.h1>

          {profile.bio && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 max-w-md text-muted leading-relaxed"
            >
              {profile.bio}
            </motion.p>
          )}

          {profile.location && (
            <p className="mt-3 text-sm text-muted">📍 {profile.location}</p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-background rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              View GitHub
            </a>
            <a
              href="#projects"
              className="border border-border rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:border-accent"
            >
              View projects
            </a>
          </motion.div>
        </div>

        {/* Right: the floating 3D object. */}
        <div className="relative h-72 w-full flex-1 sm:h-96">
          <HeroScene3D />
        </div>
      </section>

      {/* ---------- Optional action (e.g. Save & Share) ---------- */}
      {actionSlot && (
        <section className="mx-auto max-w-md px-6 pt-8">{actionSlot}</section>
      )}

      {/* ---------- Stats ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="animate-fade-up bg-card border border-border rounded-2xl p-6 text-center"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="brand-grad font-display text-3xl font-bold sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Languages ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="animate-fade-up brand-grad font-display text-3xl font-bold sm:text-4xl">
          Languages
        </h2>
        <div className="animate-fade-up bg-card border border-border rounded-3xl p-8 mt-8">
          <LanguageBars languages={languages} />
        </div>
      </section>

      {/* ---------- Projects ---------- */}
      <section id="projects" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-12">
        <h2 className="animate-fade-up brand-grad font-display text-3xl font-bold sm:text-4xl">
          Projects
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo, index) => (
            <div
              key={repo.name}
              className="animate-fade-up"
              style={{ animationDelay: `${0.1 + (index % 3) * 0.08}s` }}
            >
              <TiltCard>
                <ProjectCard repo={repo} />
              </TiltCard>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="mx-auto max-w-5xl px-6 py-16 text-center text-sm text-muted">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          github.com/{username}
        </a>
        <p className="mt-3">Generated by ProofFolio</p>
      </footer>
    </main>
  );
}
