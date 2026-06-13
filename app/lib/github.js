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

  // 6) Build the clean profile object we actually want to use.
  //    We rename a few GitHub field names to friendlier names.
  const profile = {
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    followers: user.followers,
    location: user.location,
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

  // 8) Return both pieces together for the caller to use.
  return { profile, repos };
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
