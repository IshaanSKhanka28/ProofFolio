# ProofFolio — Agent Instructions
72-hour hackathon MVP: GitHub username → auto-generated portfolio page.
Stack (do not deviate): Next.js App Router + Tailwind CSS + MongoDB via
Mongoose, deployed on Vercel. NO auth, NO new libraries without asking,
NO chart libraries.
Style mandate: deep charcoal backgrounds, subtle forest green accents,
Bento-grid layouts, no neon or bright colors.
Architecture: frontend pages call only OUR OWN API routes. API routes
call the GitHub REST API using GITHUB_TOKEN from environment variables —
the token never appears in client code. One MongoDB collection:
portfolios {slug, username, profile, languages, repos, createdAt}.
Solo build: one developer owns the whole codebase. Working rules: one
small feature per task; never refactor unrelated files; simple readable
code over clever code (the author is a beginner who must explain every
line on video); after every change list the files you touched and what
each does; never commit secrets.
