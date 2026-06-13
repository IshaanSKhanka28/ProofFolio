// app/components/ProfileHeader.js
// The hero card at the top of a portfolio: a small kicker label, the avatar
// with a soft green ring, the name in a display serif, the bio, and a thin
// meta row with followers + location.

export default function ProfileHeader({ profile }) {
  return (
    // Hero card. "animate-fade-up" makes it rise + fade in on load.
    // bg-card is translucent so the grain/aurora shows through for depth.
    <header className="animate-fade-up bg-card border border-border rounded-3xl p-8 sm:p-10">
      {/* Small accent label above everything. */}
      <p className="kicker mb-6">Proof of Work</p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Avatar, ~88px, circular, with a faint forest-green ring. */}
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="w-22 h-22 sm:w-24 sm:h-24 rounded-full object-cover ring-1 ring-accent/40 shrink-0"
          style={{ width: 88, height: 88 }}
        />

        <div>
          {/* Name in the display serif, large. */}
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">
            {profile.name}
          </h1>

          {/* Bio, muted, only if present. */}
          {profile.bio && (
            <p className="text-muted mt-2 max-w-xl text-sm leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Meta row: followers (count in accent) and location, dot-separated. */}
          <div className="flex items-center gap-3 text-sm text-muted mt-4">
            <span>
              <span className="text-accent">{profile.followers}</span> followers
            </span>
            {profile.location && (
              <>
                <span className="text-border">•</span>
                <span>{profile.location}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
