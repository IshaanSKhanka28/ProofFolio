// app/api/portfolio/route.js
// Saves a generated portfolio to MongoDB so it can be shared via a link.
// The browser POSTs the current data here; we store (or update) it and return
// the slug used in the share URL (/p/<slug>).

import { connectDB } from "../../lib/db";
import Portfolio from "../../models/Portfolio";

export async function POST(request) {
  try {
    // 1) Read the data the browser sent.
    const body = await request.json();
    const { username, profile, languages, repos } = body;

    // 2) A username is required to build the slug / share link.
    if (!username) {
      return Response.json({ error: "Username is required" }, { status: 400 });
    }

    // 3) Make sure we have a database connection (reused if already open).
    await connectDB();

    // 4) Use the lowercased username as the slug so the link is /p/<username>.
    const slug = username.toLowerCase();

    // 5) Save it. findOneAndUpdate with upsert means: if this slug already
    //    exists, update it; otherwise create a new document. This lets a user
    //    re-save without hitting the "unique slug" error.
    const portfolio = await Portfolio.findOneAndUpdate(
      { slug },
      { slug, username, profile, languages, repos },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 6) Send back the slug so the page can build the share URL.
    return Response.json({ slug: portfolio.slug });
  } catch (error) {
    // Any failure (bad data, DB down) becomes a 500 with a clear message.
    return Response.json({ error: "Failed to save portfolio" }, { status: 500 });
  }
}
