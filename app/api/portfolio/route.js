// app/api/portfolio/route.js
// Our own API route. The browser calls THIS, and this calls GitHub.
// That way the GitHub token stays on the server and never reaches the browser.

import { fetchGitHubData, calculateLanguages } from "../../lib/github";

// Handles GET requests like: /api/portfolio?username=torvalds
export async function GET(request) {
  // 1) Read the "username" value from the URL's query string.
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  // 2) If no username was given, reply with a 400 (bad request).
  if (!username) {
    return Response.json({ error: "Username is required" }, { status: 400 });
  }

  // 3) Try to fetch and shape the data. We wrap this in try/catch
  //    so a "User not found" error becomes a clean 404 reply.
  try {
    // Get the profile and repos from GitHub (via our helper).
    const { profile, repos } = await fetchGitHubData(username);

    // Work out the top languages from those repos.
    const languages = calculateLanguages(repos);

    // 4) Send everything back to the browser as JSON.
    return Response.json({ profile, languages, repos });
  } catch (error) {
    // 5) If the helper threw "User not found", reply with 404.
    //    Any other error becomes a generic 500 (server error).
    if (error.message === "User not found") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
