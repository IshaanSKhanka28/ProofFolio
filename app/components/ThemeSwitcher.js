"use client";

// app/components/ThemeSwitcher.js
// A small row of theme buttons. Clicking one sets data-theme on the <html>
// element, which swaps the accent color via the CSS rules in globals.css.
// The choice is saved in localStorage so it sticks on reload.

import { useState, useEffect } from "react";

const THEMES = [
  { id: "forest", label: "Forest" },
  { id: "ocean", label: "Ocean" },
  { id: "sunset", label: "Sunset" },
  { id: "violet", label: "Violet" },
  { id: "mono", label: "Mono" },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("forest");

  // On first load, apply whatever theme was saved last time.
  useEffect(() => {
    const saved = localStorage.getItem("pf-theme") || "forest";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  // Switch theme: update the page, the button state, and remember the choice.
  function pick(id) {
    setTheme(id);
    document.documentElement.dataset.theme = id;
    localStorage.setItem("pf-theme", id);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="kicker mr-1">Theme</span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => pick(t.id)}
          className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
            theme === t.id
              ? "border-accent text-accent"
              : "border-border text-muted hover:border-accent"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
