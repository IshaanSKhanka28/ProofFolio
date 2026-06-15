"use client";

// app/components/PortfolioView.js
// The visual portfolio: hero (with the floating 3D object), an optional action
// slot (used for the Save & Share button), a stats row, the language bars, and
// the project tilt cards. Shared by /u/<username> (live data) and /p/<slug>
// (saved data) so the look stays identical in both places.

import dynamic from "next/dynamic";
import TiltCard from "./TiltCard";
import LanguageBars from "./LanguageBars";
import ProjectCard from "./ProjectCard";
import Connect from "./Connect";
import ActivityStats from "./ActivityStats";
import Reveal from "./Reveal";

// The 3D scene is loaded client-only so Three.js never runs on the server.
const HeroScene3D = dynamic(() => import("./HeroScene3D"), { ssr: false });

// Per-theme colors for the floating 3D object (base color + glow), so it
// matches whichever accent theme is active.
const THEME_3D = {
  forest: { color: "#33543f", emissive: "#5e9c78" },
  slate: { color: "#3a4654", emissive: "#748ba0" },
  amber: { color: "#5a472d", emissive: "#c79a5b" },
  plum: { color: "#4a3d52", emissive: "#9a7fa6" },
};

export default function PortfolioView({
  username,
  profile,
  languages,
  repos,
  stats,
  actionSlot,
  customDescription,
  contactPhone,
  theme,
  featuredRepos,
  repoPickerSlot,
}) {
  // Fall back to the username if GitHub has no display name.
  const displayName = profile.name || username;
  // Add up the stars across all repos.
  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);

  // Order the projects: featured repos first (in the order they were picked),
  // then the rest. If nothing is featured, fall back to top repos by stars.
  const featuredList = featuredRepos ?? [];
  const orderedRepos =
    featuredList.length > 0
      ? [
          ...featuredList
            .map((name) => repos.find((r) => r.name === name))
            .filter(Boolean),
          ...repos.filter((r) => !featuredList.includes(r.name)),
        ]
      : [...repos].sort((a, b) => (b.stars || 0) - (a.stars || 0));

  // Numbers for the ActivityStats card. Prefer the stats from the API; fall
  // back to values we can derive from the profile + repos (used on the saved
  // /p page, which doesn't carry a stats object — recentCommits is 0 there).
  const activityStats = {
    recentCommits: stats?.recentCommits ?? 0,
    totalStars: stats?.totalStars ?? totalStars,
    totalRepos: stats?.totalRepos ?? repos.length,
    totalForks: stats?.totalForks ?? 0,
    followers: stats?.followers ?? profile.followers,
  };

  return (
    // data-theme applies the saved accent on /p (the live /u page sets it on
    // <html> via the theme switcher instead, so theme is undefined there).
    <main className="relative" data-theme={theme}>
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

        {/* Left: identity. Entrance uses CSS animate-fade-up (SSR-safe). */}
        <div className="flex-1">
          <img
            src={profile.avatarUrl}
            alt={displayName}
            className="animate-fade-up h-20 w-20 rounded-full object-cover ring-2 ring-accent/50"
          />

          <p className="animate-fade-up kicker mt-6" style={{ animationDelay: "0.06s" }}>
            @{username}
          </p>

          <h1
            className="animate-fade-up brand-grad font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl mt-3"
            style={{ animationDelay: "0.12s" }}
          >
            {displayName}
          </h1>

          {profile.bio && (
            <p
              className="animate-fade-up mt-5 max-w-md text-muted leading-relaxed"
              style={{ animationDelay: "0.2s" }}
            >
              {profile.bio}
            </p>
          )}

          {profile.location && (
            <p className="mt-3 text-sm text-muted">📍 {profile.location}</p>
          )}

          {/* Custom headline/description (saved on /p only). */}
          {customDescription && (
            <p className="animate-fade-up mt-5 max-w-md border-l-2 border-accent pl-3 leading-relaxed text-foreground/90">
              {customDescription}
            </p>
          )}

          <div
            className="animate-fade-up no-print mt-8 flex flex-wrap gap-4"
            style={{ animationDelay: "0.28s" }}
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
            {/* Native browser print -> "Save as PDF". Hidden in the PDF itself. */}
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-border rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:border-accent"
            >
              Download as PDF
            </button>
          </div>

          {/* Connect links (email / website / X) — only the ones that exist. */}
          <div className="animate-fade-up mt-6" style={{ animationDelay: "0.34s" }}>
            <Connect
              email={profile.email}
              blog={profile.blog}
              twitterUsername={profile.twitterUsername}
              socials={profile.socials}
            />
          </div>

          {/* Contact phone (saved on /p only). */}
          {contactPhone && (
            <p className="mt-4 text-sm text-muted">
              <span className="text-accent">Contact:</span> {contactPhone}
            </p>
          )}
        </div>

        {/* Right: the floating 3D object, colored to match the active theme. */}
        <div className="relative h-72 w-full flex-1 sm:h-96 no-print">
          <HeroScene3D
            color={(THEME_3D[theme] || THEME_3D.forest).color}
            emissive={(THEME_3D[theme] || THEME_3D.forest).emissive}
          />
        </div>
      </section>

      {/* ---------- Optional action (e.g. Save & Share) ---------- */}
      {actionSlot && (
        <section className="mx-auto max-w-md px-6 pt-8 no-print">{actionSlot}</section>
      )}

      {/* ---------- Stats ---------- */}
      {/* ---------- Activity stats ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <ActivityStats stats={activityStats} />
      </section>

      {/* ---------- Languages ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="animate-fade-up brand-grad font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Languages
        </h2>
        <Reveal className="bg-card border border-border rounded-3xl p-8 mt-8">
          <LanguageBars languages={languages} />
        </Reveal>
      </section>

      {/* ---------- Projects ---------- */}
      <section id="projects" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-12">
        <h2 className="animate-fade-up brand-grad font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Projects
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orderedRepos.map((repo, index) => (
            // Each card scroll-reveals, staggered within its row.
            <Reveal key={repo.name} delay={(index % 3) * 0.06}>
              <TiltCard>
                <ProjectCard repo={repo} />
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Featured repositories picker (only on /u) ---------- */}
      {repoPickerSlot}

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
