// app/api/portfolio/route.js
// POST handler that saves a generated portfolio to MongoDB and returns the
// slug used in its share link (/p/<slug>).

import { connectDB } from "../../lib/db";
import Portfolio from "../../models/Portfolio";

export async function POST(request) {
  try {
    // 1) Read the data the browser sent.
    const { username, profile, languages, repos, stats } = await request.json();

    // 2) Make sure we have a database connection (reused if already open).
    await connectDB();

    // 3) Build the slug from the username: trimmed and lowercased.
    const slug = username.trim().toLowerCase();

    // 4) Upsert: if a portfolio with this slug already exists, update it;
    //    otherwise create a new one. upsert:true means re-saving the same
    //    username won't error on the unique slug.
    await Portfolio.findOneAndUpdate(
      { slug },
      { slug, username, profile, languages, repos, stats },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 5) Success — send back the slug so the page can build the share URL.
    return Response.json({ success: true, slug }, { status: 200 });
  } catch (error) {
    // 6) On any failure: log it and return a 500 with the message.
    console.error("Failed to save portfolio:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
