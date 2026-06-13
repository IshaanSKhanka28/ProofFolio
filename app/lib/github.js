// app/lib/github.js
// Server-side helper that fetches a GitHub user's profile + repositories.
// This runs ONLY on the server (API routes), so the token stays private.

// Fetch a GitHub user's data by their username.
export async function fetchGitHubData(username) {
  // The same Authorization header is reused for both requests.
  // process.env.GITHUB_TOKEN comes from .env.local and is never sent to the browser.
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "prooffolio",
  };

  // 1) Request the user's profile.
  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers,
  });

  // 2) If GitHub says the user doesn't exist (404), stop and throw a clear error.
  if (userRes.status === 404) {
    throw new Error("User not found");
  }

  // 3) Turn the profile response into a JavaScript object.
  const user = await userRes.json();

  // 4) Request the user's repositories (up to 100, newest updates first).
  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers }
  );

  // 5) Turn the repos response into an array of repo objects.
  const reposData = await reposRes.json();

  // 5b) Fetch the user's linked social accounts (LinkedIn, Instagram, YouTube,
  //     etc.). These live in a separate endpoint, not the main user object.
  const socialsRes = await fetch(
    `https://api.github.com/users/${username}/social_accounts`,
    { headers }
  );
  // If it fails for any reason, just treat it as "no socials".
  const socialsData = socialsRes.ok ? await socialsRes.json() : [];

  // 6) Build the clean profile object we actually want to use.
  //    We rename a few GitHub field names to friendlier names.
  const profile = {
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    followers: user.followers,
    location: user.location,
    email: user.email,
    blog: user.blog,
    twitterUsername: user.twitter_username,
    // Linked social accounts as { provider, url }. We skip "twitter" here
    // because we already show X via twitterUsername above.
    socials: socialsData
      .filter((account) => account.provider !== "twitter")
      .map((account) => ({ provider: account.provider, url: account.url })),
  };

  // 7) Reshape each repo into just the fields we need for the portfolio.
  const repos = reposData.map((repo) => ({
    name: repo.name,
    description: repo.description,
    stars: repo.stargazers_count,
    repoUrl: repo.html_url,
    liveUrl: repo.homepage,
    language: repo.language,
  }));

  // 8) Aggregate some stats from the repos we already fetched.
  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);
  const totalRepos = repos.length;
  const topRepoStars = repos.reduce((max, r) => Math.max(max, r.stars || 0), 0);

  // 9) Pull recent commit activity from the public events feed.
  const activity = await fetchActivity(username);

  // 10) Bundle the stats together (followers comes from the profile).
  const stats = {
    recentCommits: activity.recentCommits,
    activeDays: activity.activeDays,
    totalStars,
    totalRepos,
    topRepoStars,
    followers: profile.followers,
  };

  // 11) Return everything. `stats` is additive — the existing shape is unchanged.
  return { profile, repos, stats };
}

// Fetch a user's recent public activity and summarize their push activity:
// how many commits they pushed recently, and on how many distinct days.
export async function fetchActivity(username) {
  // Same auth header pattern as above. The token stays on the server.
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "prooffolio",
  };

  // The public events feed returns the user's most recent activity.
  const res = await fetch(
    `https://api.github.com/users/${username}/events/public`,
    { headers }
  );

  // If the request failed, treat it as no activity.
  if (!res.ok) {
    return { recentCommits: 0, activeDays: 0 };
  }

  const events = await res.json();

  // If there are no events, return zeros.
  if (!Array.isArray(events) || events.length === 0) {
    return { recentCommits: 0, activeDays: 0 };
  }

  let recentCommits = 0;
  const activeDays = new Set();

  for (const event of events) {
    // Only PushEvents contain commits.
    if (event.type === "PushEvent") {
      // Add the number of commits in this push. Prefer the commits array
      // length; fall back to payload.size (also the commit count) when GitHub
      // returns an abbreviated payload without the commits array.
      recentCommits += event.payload?.commits?.length ?? event.payload?.size ?? 0;
      // Record the day (the YYYY-MM-DD part of the timestamp) so we can
      // count how many distinct days had push activity.
      const day = event.created_at ? event.created_at.slice(0, 10) : null;
      if (day) activeDays.add(day);
    }
  }

  return { recentCommits, activeDays: activeDays.size };
}

// Work out which languages a user codes in most, as percentages.
// Example: if 10 repos have a language and 5 are JavaScript,
// then JavaScript is 5 / 10 = 50%.
export function calculateLanguages(repos) {
  // 1) Tally how many repos use each language.
  //    counts looks like { JavaScript: 5, Python: 3, ... }.
  const counts = {};
  let total = 0;

  for (const repo of repos) {
    // Skip repos with no detected language (language is null).
    if (!repo.language) continue;

    // Add 1 to this language's count (start at 0 the first time we see it).
    counts[repo.language] = (counts[repo.language] || 0) + 1;

    // Keep a running total of repos that DID have a language.
    total += 1;
  }

  // 2) Turn each { language: count } into { name, percent }.
  //    percent = count out of the total, as a rounded whole number.
  const languages = Object.entries(counts).map(([name, count]) => ({
    name,
    percent: Math.round((count / total) * 100),
  }));

  // 3) Sort from highest percent to lowest, then keep only the top 6.
  languages.sort((a, b) => b.percent - a.percent);
  return languages.slice(0, 6);
}
