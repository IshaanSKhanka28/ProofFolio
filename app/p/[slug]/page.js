// app/p/[slug]/page.js
// The SAVED portfolio, shown at /p/<slug>. This is a server component: it reads
// the saved document straight from MongoDB and renders it with the shared
// PortfolioView. (No live GitHub fetch — it shows the snapshot that was saved.)

import { connectDB } from "../../lib/db";
import Portfolio from "../../models/Portfolio";
import PortfolioView from "../../components/PortfolioView";

export default async function SavedPortfolioPage({ params }) {
  // In Next.js 16 params is a Promise, so we await it.
  const { slug } = await params;

  // Connect to the database (reused if already open) and look up the slug.
  await connectDB();
  const doc = await Portfolio.findOne({ slug }).lean();

  // If nothing was saved under this slug, show a simple not-found message.
  if (!doc) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="kicker mb-3">/p/{slug}</p>
        <p className="text-muted text-xl">Portfolio not found</p>
      </main>
    );
  }

  // Build a plain, serializable object to hand to the client component.
  // (Mongoose documents carry extra fields like _id that can't cross the
  // server -> client boundary, so we copy only the fields we need.)
  const data = {
    username: doc.username,
    profile: {
      name: doc.profile?.name ?? null,
      avatarUrl: doc.profile?.avatarUrl ?? null,
      bio: doc.profile?.bio ?? null,
      followers: doc.profile?.followers ?? 0,
      location: doc.profile?.location ?? null,
    },
    languages: (doc.languages ?? []).map((l) => ({
      name: l.name,
      percent: l.percent,
    })),
    repos: (doc.repos ?? []).map((r) => ({
      name: r.name,
      description: r.description ?? null,
      stars: r.stars ?? 0,
      repoUrl: r.repoUrl,
      liveUrl: r.liveUrl ?? null,
      language: r.language ?? null,
    })),
    // The saved stats snapshot (may be absent on older saved portfolios).
    stats: doc.stats
      ? {
          recentCommits: doc.stats.recentCommits ?? 0,
          activeDays: doc.stats.activeDays ?? 0,
          totalStars: doc.stats.totalStars ?? 0,
          totalRepos: doc.stats.totalRepos ?? 0,
          topRepoStars: doc.stats.topRepoStars ?? 0,
          followers: doc.stats.followers ?? 0,
        }
      : null,
    // Optional custom fields the user saved (shown read-only on /p).
    customDescription: doc.customDescription ?? null,
    contactPhone: doc.contactPhone ?? null,
    // The accent theme the user picked (defaults to forest).
    theme: doc.theme ?? "forest",
  };

  return (
    <PortfolioView
      username={data.username}
      profile={data.profile}
      languages={data.languages}
      repos={data.repos}
      stats={data.stats}
      customDescription={data.customDescription}
      contactPhone={data.contactPhone}
      theme={data.theme}
    />
  );
}
