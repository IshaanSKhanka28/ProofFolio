// app/components/LanguageBars.js
// A simple language breakdown: one row per language with its name on the
// left, percent on the right, and a slim forest-green bar underneath.
// No chart library — each bar is just two divs (a track and a fill).

export default function LanguageBars({ languages }) {
  return (
    <div className="flex flex-col gap-4">
      {languages.map((lang, index) => (
        <div key={lang.name}>
          {/* Top row: language name on the left, percent (muted) on the right. */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono">{lang.name}</span>
            <span className="text-muted">{lang.percent}%</span>
          </div>

          {/* The track: a slim rounded bar background. overflow-hidden keeps
              the green fill inside the rounded corners. */}
          <div className="mt-2 h-2 w-full bg-surface rounded-full overflow-hidden">
            {/* The fill: green bar whose width equals the percent.
                --bar-w is the target width; the animate-bar keyframe sweeps
                it out from 0 on load. The stagger delay makes each bar start
                a moment after the one above it. */}
            <div
              className="h-full bg-accent rounded-full animate-bar"
              style={{ "--bar-w": `${lang.percent}%`, animationDelay: `${index * 0.08}s` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
