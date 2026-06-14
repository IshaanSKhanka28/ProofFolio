"use client";

// app/components/FeaturedPicker.js
// Lists every repo as a row with an Enable toggle. Used on /u only, below the
// projects grid, to pick up to 6 repos to feature first. Selection is capped
// at 6: once 6 are chosen, the remaining Enable buttons are disabled until one
// is removed.

const MAX_FEATURED = 6;

export default function FeaturedPicker({ repos, featured, onToggle }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="brand-grad font-display text-3xl font-bold sm:text-4xl">
        Featured Repositories
      </h2>
      <p className="mt-2 text-sm text-muted">
        Pick up to {MAX_FEATURED} to feature first — {featured.length}/
        {MAX_FEATURED} selected.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        {repos.map((repo) => {
          const selected = featured.includes(repo.name);
          // At the limit, non-selected rows can't be enabled.
          const atLimit = featured.length >= MAX_FEATURED && !selected;

          return (
            <div
              key={repo.name}
              className="flex items-center justify-between gap-3 bg-card border border-border rounded-xl px-4 py-3"
            >
              <span className="truncate font-mono text-sm">{repo.name}</span>
              <button
                type="button"
                onClick={() => onToggle(repo.name)}
                disabled={atLimit}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs transition-colors ${
                  selected
                    ? "border-accent text-accent"
                    : atLimit
                    ? "cursor-not-allowed border-border text-muted opacity-40"
                    : "border-border text-muted hover:border-accent"
                }`}
              >
                {selected ? "Enabled" : "Enable"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
