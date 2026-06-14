"use client";

// app/u/[username]/page.js
// The LIVE portfolio: reads the username from the URL, fetches real GitHub data
// from /api/github/<username>, and renders it with the shared PortfolioView,
// plus a Save & Share button so the result can be saved + shared.

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PortfolioView from "../../components/PortfolioView";
import SaveShare from "../../components/SaveShare";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import FeaturedPicker from "../../components/FeaturedPicker";

export default function PortfolioPage() {
  // Read the username from the URL, e.g. /u/torvalds -> "torvalds".
  const params = useParams();
  const username = params.username;

  // Data, loading flag, and error message.
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Optional custom fields the user can fill in before saving. These show as
  // inputs here on /u and are saved with the portfolio for the /p page.
  const [customDescription, setCustomDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // The live theme (kept in sync with the theme switcher) so the 3D object
  // can re-color as the user switches themes.
  const [theme, setTheme] = useState("forest");

  // Featured repo names (max 6) — selected ones show first in the grid.
  const [featuredRepos, setFeaturedRepos] = useState([]);

  // Toggle a repo in/out of the featured list, capped at 6.
  function toggleFeatured(name) {
    setFeaturedRepos((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 6) return prev; // at the cap: ignore new picks
      return [...prev, name];
    });
  }

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
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </main>
    );
  }

  // --- Error state (e.g. "User not found") ---
  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="kicker mb-3">@{username}</p>
        <p className="text-muted text-xl">{error}</p>
      </main>
    );
  }

  // --- Success: render the shared view, with the Save & Share button. ---
  return (
    <PortfolioView
      username={username}
      profile={data.profile}
      languages={data.languages}
      repos={data.repos}
      stats={data.stats}
      theme={theme}
      featuredRepos={featuredRepos}
      repoPickerSlot={
        <FeaturedPicker
          repos={data.repos}
          featured={featuredRepos}
          onToggle={toggleFeatured}
        />
      }
      actionSlot={
        <div className="flex flex-col items-center gap-5">
          <ThemeSwitcher onChange={setTheme} />

          {/* Customize card: optional fields saved with the portfolio.
              These appear ONLY here on /u (as inputs), never on /p. */}
          <div className="w-full bg-card border border-border rounded-2xl p-5">
            <p className="kicker mb-4">Customize (optional)</p>

            <label className="block text-sm text-muted mb-1">
              Headline / Description
            </label>
            <textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              rows={2}
              placeholder="A short tagline about you..."
              className="w-full resize-none bg-surface border border-border rounded-xl px-3 py-2 text-sm placeholder:text-muted outline-none focus:border-accent transition-colors"
            />

            <label className="block text-sm text-muted mt-3 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="e.g. +1 555 123 4567"
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm placeholder:text-muted outline-none focus:border-accent transition-colors"
            />
          </div>

          <SaveShare
            username={username}
            profile={data.profile}
            languages={data.languages}
            repos={data.repos}
            stats={data.stats}
            customDescription={customDescription}
            contactPhone={contactPhone}
            featuredRepos={featuredRepos}
          />
        </div>
      }
    />
  );
}
