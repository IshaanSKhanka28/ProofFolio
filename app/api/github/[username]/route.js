// app/api/github/[username]/route.js
// A dynamic API route. The [username] folder name means the username
// comes from the URL path itself, e.g. /api/github/torvalds.
// The browser calls THIS route, and this route calls GitHub on the server,
// so the GITHUB_TOKEN never reaches the browser.

import { fetchGitHubData, calculateLanguages } from "../../../lib/github";

// Handles GET requests like: /api/github/torvalds
// The second argument holds the route params. In Next.js 16, params is a
// Promise, so we await it to read the username from the URL path.
export async function GET(request, { params }) {
  // 1) Read the "username" value from the route params.
  const { username } = await params;

  // 2) Try to fetch and shape the data. The try/catch lets us turn a
  //    thrown "User not found" error into a clean 404 reply.
  try {
    // Get the profile and repos from GitHub (via our helper).
    const { profile, repos } = await fetchGitHubData(username);

    // Work out the top languages from those repos.
    const languages = calculateLanguages(repos);

    // 3) Send everything back to the browser as JSON.
    return Response.json({ profile, languages, repos });
  } catch (error) {
    // 4) If the user does not exist, reply with 404.
    if (error.message === "User not found") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    // 5) Any other problem becomes a generic 500 (server error).
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
