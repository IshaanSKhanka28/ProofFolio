"use client";

// app/u/[username]/page.js
// The LIVE portfolio: reads the username from the URL, fetches real GitHub data
// from /api/github/<username>, and renders it with the shared PortfolioView,
// plus a Save & Share button so the result can be saved + shared.

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PortfolioView from "../../components/PortfolioView";
import SaveShare from "../../components/SaveShare";

export default function PortfolioPage() {
  // Read the username from the URL, e.g. /u/torvalds -> "torvalds".
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
      actionSlot={
        <SaveShare
          username={username}
          profile={data.profile}
          languages={data.languages}
          repos={data.repos}
          stats={data.stats}
        />
      }
    />
  );
}
