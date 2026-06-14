"use client";

// app/components/SaveShare.js
// A "Save & Share" button. When clicked it POSTs the current portfolio data to
// /api/portfolio, then shows the shareable link plus a "Copy to Clipboard"
// button. Handles the saving, success, and error states.

import { useState } from "react";

export default function SaveShare({
  username,
  profile,
  languages,
  repos,
  stats,
  customDescription,
  contactPhone,
  featuredRepos,
}) {
  // status moves through: idle -> saving -> saved (or error).
  const [status, setStatus] = useState("idle");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Send the current data to our API to be saved.
  async function handleSave() {
    setStatus("saving");
    try {
      // The chosen theme is kept in localStorage by the theme switcher; save it
      // too so the shared /p page shows the same theme.
      const theme = localStorage.getItem("pf-theme") || "forest";

      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          profile,
          languages,
          repos,
          stats,
          customDescription,
          contactPhone,
          theme,
          featuredRepos,
        }),
      });

      // If the server returned an error status, show the error state.
      if (!res.ok) {
        setStatus("error");
        return;
      }

      // Build the share link from the slug the server sent back.
      const data = await res.json();
      setShareUrl(`${window.location.origin}/p/${data.slug}`);
      setStatus("saved");
    } catch {
      // Network failure, etc.
      setStatus("error");
    }
  }

  // Copy the link to the clipboard and briefly show "Copied!".
  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // --- Success: show the link + copy button ---
  if (status === "saved") {
    return (
      <div className="bg-card border border-border rounded-2xl p-5 text-center">
        <p className="text-accent text-sm font-semibold">Portfolio saved!</p>
        <div className="mt-3 flex flex-col sm:flex-row items-stretch gap-2">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 text-sm text-muted outline-none"
          />
          <button
            onClick={handleCopy}
            className="bg-accent text-background font-semibold rounded-xl px-5 py-2 text-sm transition-opacity hover:opacity-90"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      </div>
    );
  }

  // --- Default / saving / error states ---
  return (
    <div className="text-center">
      <button
        onClick={handleSave}
        disabled={status === "saving"}
        className="bg-accent text-background font-semibold rounded-full px-6 py-3 text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "saving" ? "Saving..." : "Save & Share"}
      </button>

      {status === "error" && (
        <p className="mt-3 text-sm text-muted">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
