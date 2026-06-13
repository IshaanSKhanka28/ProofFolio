// app/models/Portfolio.js
// Mongoose model for the "portfolios" collection. One document = one saved
// portfolio that we generated from a GitHub username.

import mongoose from "mongoose";

// The shape of a portfolio document.
const PortfolioSchema = new mongoose.Schema({
  // A unique, shareable identifier used in the URL (e.g. /p/<slug>).
  slug: { type: String, unique: true, required: true },

  // The GitHub username this portfolio was built from.
  username: { type: String, required: true },

  // The basic profile info we show at the top of the portfolio.
  profile: {
    name: String,
    avatarUrl: String,
    bio: String,
    followers: Number,
    location: String,
  },

  // The language breakdown: a list of { name, percent }.
  languages: [
    {
      name: String,
      percent: Number,
    },
  ],

  // The repositories: a list of { name, description, stars, repoUrl, liveUrl, language }.
  repos: [
    {
      name: String,
      description: String,
      stars: Number,
      repoUrl: String,
      liveUrl: String,
      language: String,
    },
  ],

  // When this portfolio was saved. Defaults to the current time.
  createdAt: { type: Date, default: Date.now },
});

// On hot-reload Mongoose would try to recompile the model and throw, so reuse
// the already-compiled model if it exists.
const Portfolio =
  mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);

export default Portfolio;
