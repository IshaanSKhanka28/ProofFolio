"use client";

// app/page.js
// The landing page. A centered hero with the ProofFolio wordmark, a framed
// username input (prefixed with "github.com/"), a Generate button, and three
// feature cards. Typing a username and submitting sends you to /u/<username>.

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "./components/ThemeSwitcher";

// The three feature cards shown below the input.
const features = [
  {
    num: "01",
    title: "Bento Grid Layout",
    body:
      "Beautifully structured layout tailored to highlight your profile info, projects, and tech stack in a modern layout.",
  },
  {
    num: "02",
    title: "Stack Analysis",
    body:
      "Automatically parses your languages and aggregates repository data to compute code distribution percentages.",
  },
  {
    num: "03",
    title: "No Authentication",
    body:
      "Enter any public GitHub username to generate their portfolio instantly. All data is fetched on-the-fly.",
  },
];

export default function HomePage() {
  // Track what the user types in the username box.
  const [username, setUsername] = useState("");
  const router = useRouter();

  // True when the box is empty (after trimming spaces).
  const isEmpty = username.trim() === "";

  // Send the user to their portfolio page.
  function handleGenerate() {
    const name = username.trim();
    if (name === "") return;
    router.push(`/u/${encodeURIComponent(name)}`);
  }

  // Pressing Enter inside the input also generates.
  function handleKeyDown(event) {
    if (event.key === "Enter") handleGenerate();
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-16 sm:py-24">
      {/* ---------- Hero ---------- */}
      <div className="text-center">
        {/* Pill badge. */}
        <span className="animate-fade-up inline-block rounded-full border border-border bg-card px-4 py-1.5">
          <span className="kicker">Next-Gen Portfolio Generator</span>
        </span>

        {/* The ProofFolio wordmark with a forest-green gradient. */}
        <h1
          className="animate-fade-up brand-grad font-display text-6xl sm:text-7xl font-bold mt-6"
          style={{ animationDelay: "0.08s" }}
        >
          ProofFolio
        </h1>

        {/* Subtitle. */}
        <p
          className="animate-fade-up text-muted mt-5 max-w-2xl mx-auto leading-relaxed"
          style={{ animationDelay: "0.16s" }}
        >
          Generate a premium, developer-focused portfolio page directly from
          your GitHub profile. No configuration. No signups. Pure proof of work.
        </p>
      </div>

      {/* ---------- Input card ---------- */}
      <div
        className="animate-fade-up bg-card border border-border rounded-2xl p-6 mt-12 max-w-xl mx-auto"
        style={{ animationDelay: "0.24s" }}
      >
        <label className="kicker block mb-3">GitHub Username</label>

        {/* Input row: a static "github.com/" prefix + the real input. */}
        <div className="flex items-center bg-surface border border-border rounded-xl px-4 py-3 focus-within:border-accent transition-colors">
          <span className="font-mono text-muted text-sm select-none">
            github.com/
          </span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="username"
            className="flex-1 ml-2 bg-transparent text-sm placeholder:text-muted outline-none"
          />
        </div>

        {/* Generate button: full-width forest green, faded when empty. */}
        <button
          onClick={handleGenerate}
          disabled={isEmpty}
          className="w-full mt-4 bg-accent text-background font-semibold rounded-xl py-3 text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Generate Portfolio
        </button>

        {/* Theme picker — the choice carries through to the generated portfolio
            (and its PDF + saved page) via localStorage. */}
        <div className="mt-6 border-t border-border pt-5">
          <ThemeSwitcher />
        </div>
      </div>

      {/* ---------- Feature cards ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
        {features.map((f, index) => (
          <div
            key={f.num}
            className="animate-fade-up bg-card border border-border rounded-2xl p-6 transition-colors hover:border-accent"
            style={{ animationDelay: `${0.32 + index * 0.08}s` }}
          >
            {/* Number badge. */}
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-surface text-accent font-mono text-sm border border-border">
              {f.num}
            </span>
            <h3 className="font-semibold mt-4">{f.title}</h3>
            <p className="text-muted text-sm mt-2 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
