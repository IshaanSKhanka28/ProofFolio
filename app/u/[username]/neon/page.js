"use client";

// app/u/[username]/neon/page.js
// PRESERVED neon / 3D portfolio (not the on-mandate entry). Driven by real
// GitHub data. Viewable at /u/<username>/neon. The main /u/<username> page is
// the charcoal, on-mandate version.

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import NeonBackground from "../../../components/NeonBackground";
import Reveal from "../../../components/Reveal";
import TiltCard from "../../../components/TiltCard";

// The 3D scene is loaded client-only so Three.js never runs on the server.
const NeonHeroScene = dynamic(() => import("../../../components/NeonHeroScene"), {
  ssr: false,
});

export default function NeonPortfolioPage() {
  // Read the username from the URL, e.g. /u/torvalds/neon -> "torvalds".
  const params = useParams();
  const username = params.username;

  // Data, loading flag, and error message.
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch once when the page loads (or when the username changes).
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/github/${encodeURIComponent(username)}`);
      if (res.status === 404) {
        setError("User not found");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Something went wrong");
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    loadData();
  }, [username]);

  // --- Loading state ---
  if (loading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center font-neon">
        <NeonBackground />
        <p className="text-[var(--muted)] animate-pulse">Loading...</p>
      </main>
    );
  }

  // --- Error state (e.g. "User not found") ---
  if (error) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 font-neon">
        <NeonBackground />
        <p className="font-mono text-sm tracking-widest text-[var(--cyan)]">
          @{username}
        </p>
        <p className="mt-3 text-2xl font-bold">{error}</p>
      </main>
    );
  }

  // --- Success: real data ---
  const { profile, languages, repos } = data;
  const displayName = profile.name || username;
  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);

  const stats = [
    { value: profile.followers, label: "Followers" },
    { value: repos.length, label: "Repositories" },
    { value: totalStars, label: "Total Stars" },
  ];

  return (
    <main className="relative font-neon">
      <NeonBackground />

      {/* ---------- Hero ---------- */}
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-8 px-6 pt-24 md:flex-row md:pt-0">
        {/* Rotating aura behind the hero. */}
        <div className="aura pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60" />

        {/* Left: identity. */}
        <div className="flex-1">
          {/* Avatar with a neon ring. */}
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            src={profile.avatarUrl}
            alt={displayName}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-[var(--cyan)]/50"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06 }}
            className="mt-6 font-mono text-sm tracking-widest text-[var(--cyan)]"
          >
            @{username}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-3 text-5xl font-extrabold leading-tight sm:text-6xl"
          >
            <span className="neon-text">{displayName}</span>
          </motion.h1>

          {profile.bio && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 max-w-md text-lg text-[var(--muted)]"
            >
              {profile.bio}
            </motion.p>
          )}

          {profile.location && (
            <p className="mt-3 text-sm text-[var(--muted)]">📍 {profile.location}</p>
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
              className="btn-neon rounded-full px-6 py-3 text-sm font-semibold"
            >
              View GitHub
            </a>
            <a
              href="#projects"
              className="btn-ghost rounded-full px-6 py-3 text-sm font-semibold"
            >
              View projects
            </a>
          </motion.div>
        </div>

        {/* Right: the floating 3D object. */}
        <div className="relative h-72 w-full flex-1 sm:h-96">
          <NeonHeroScene />
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl font-extrabold sm:text-4xl">
                  <span className="neon-text">{s.value}</span>
                </div>
                <div className="mt-2 text-sm text-[var(--muted)]">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Languages ---------- */}
      <section className="mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
        <Reveal>
          <h2 className="text-3xl font-bold sm:text-4xl">
            <span className="neon-text">Languages</span>
          </h2>
        </Reveal>
        <div className="glass mt-8 rounded-3xl p-8">
          <div className="flex flex-col gap-5">
            {languages.map((lang, i) => (
              <div key={lang.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{lang.name}</span>
                  <span className="font-mono text-xs text-[var(--cyan)]">
                    {lang.percent}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.06 }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--cyan), var(--violet))",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Projects ---------- */}
      <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
        <Reveal>
          <h2 className="text-3xl font-bold sm:text-4xl">
            <span className="neon-text">Projects</span>
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo, i) => (
            <Reveal key={repo.name} delay={(i % 3) * 0.08}>
              <TiltCard>
                <a
                  href={repo.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass flex h-full flex-col rounded-3xl p-6"
                >
                  <h3 className="text-lg font-bold">{repo.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="mt-5 flex items-center gap-3 text-xs text-[var(--muted)]">
                    {repo.language && (
                      <span className="rounded-full border border-white/10 px-2.5 py-1">
                        {repo.language}
                      </span>
                    )}
                    <span className="text-[var(--cyan)]">★ {repo.stars}</span>
                    {repo.liveUrl && (
                      <span className="ml-auto text-[var(--cyan)]">Live ↗</span>
                    )}
                  </div>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="mx-auto max-w-6xl px-6 py-16 text-center text-sm text-[var(--muted)]">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          github.com/{username}
        </a>
        <p className="mt-3">Generated by ProofFolio · live GitHub data</p>
      </footer>
    </main>
  );
}
