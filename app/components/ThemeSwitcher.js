"use client";

// app/components/ThemeSwitcher.js
// A small row of theme buttons. Clicking one sets data-theme on the <html>
// element, which swaps the accent color via the CSS rules in globals.css.
// The choice is saved in localStorage so it sticks on reload.

import { useState, useEffect } from "react";

// Four accent presets, all on the same charcoal background. `color` is the
// swatch fill (matches each theme's --accent in globals.css).
const THEMES = [
  { id: "forest", label: "Forest", color: "#5e9c78" },
  { id: "slate", label: "Slate", color: "#748ba0" },
  { id: "amber", label: "Amber", color: "#c79a5b" },
  { id: "plum", label: "Plum", color: "#9a7fa6" },
];

export default function ThemeSwitcher({ onChange }) {
  const [theme, setTheme] = useState("forest");

  // On first load, apply whatever theme was saved last time.
  useEffect(() => {
    const saved = localStorage.getItem("pf-theme") || "forest";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
    onChange?.(saved);
    // onChange is from the parent and stable; we only want this on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch theme: update the page, the button state, remember it, and tell
  // the parent (so the 3D object can re-color live).
  function pick(id) {
    setTheme(id);
    document.documentElement.dataset.theme = id;
    localStorage.setItem("pf-theme", id);
    onChange?.(id);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <span className="kicker mr-1">Theme</span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => pick(t.id)}
          aria-label={t.label}
          title={t.label}
          className="flex flex-col items-center gap-1.5"
        >
          {/* The color swatch; the selected one gets a ring. */}
          <span
            className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
              theme === t.id ? "border-foreground" : "border-transparent"
            }`}
            style={{ backgroundColor: t.color }}
          />
          <span
            className={`text-[10px] ${
              theme === t.id ? "text-foreground" : "text-muted"
            }`}
          >
            {t.label}
          </span>
        </button>
      ))}
    </div>
  );
}
