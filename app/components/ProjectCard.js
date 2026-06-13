// app/components/ProjectCard.js
// A single repository card for the portfolio grid. Shows the repo name (with
// an accent "/" prefix for a code-like feel), description, and a footer with
// the language pill, star count, and Code / Live links.

export default function ProjectCard({ repo }) {
  return (
    // "card" adds the hover lift + green glow (defined in globals.css).
    // h-full makes every card fill its grid cell so rows line up evenly.
    <div className="card group flex flex-col h-full bg-card border border-border rounded-2xl p-5 hover:border-accent">
      {/* Repo name, mono + semibold, with a forest-green slash prefix. */}
      <h3 className="font-mono font-semibold tracking-tight">
        <span className="text-accent">/</span>
        {repo.name}
      </h3>

      {/* Description: muted, smaller, capped at 2 lines so cards stay tidy. */}
      <p className="text-muted text-sm mt-2 leading-relaxed line-clamp-2">
        {repo.description}
      </p>

      {/* Footer pinned to the bottom of the card (mt-auto). */}
      <div className="flex items-center gap-3 text-xs text-muted mt-auto pt-5">
        {/* Language shown as a small pill, only if the repo has one. */}
        {repo.language && (
          <span className="border border-border rounded-full px-2 py-0.5">
            {repo.language}
          </span>
        )}

        {/* Star count. */}
        <span className="text-accent">★</span>
        <span>{repo.stars}</span>

        {/* Links pushed to the right (ml-auto). */}
        <div className="ml-auto flex items-center gap-3">
          {/* "Code" always links to the GitHub repo. */}
          <a
            href={repo.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Code
          </a>

          {/* "Live" only appears when liveUrl is not null. Accent green. */}
          {repo.liveUrl && (
            <a
              href={repo.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Live ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
