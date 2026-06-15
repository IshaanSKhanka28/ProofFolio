# ProofFolio — Proof-of-Work Portfolio Generator

> Your GitHub is your résumé. Generate a beautiful, shareable developer
> portfolio from any GitHub username in seconds.

## 🔗 Live Demo
https://proof-folio.vercel.app/

Try it: enter any GitHub username and click Generate.

---

## ✨ What it does

Most developers' best work lives on GitHub — but raw GitHub profiles
don't tell a story. ProofFolio fetches real commit activity, top
languages, and live project links to auto-generate a responsive,
visually stunning portfolio. One username. One click. Real proof.

---

## 🎯 Features

- **Instant generation** — type any GitHub username, get a full portfolio
- **Real data only** — profile, languages, repos, stars, activity stats
  all pulled live from GitHub's API
- **Save & Share** — permanent shareable link (`/p/username`) backed
  by MongoDB, loads instantly for anyone anywhere
- **Featured repos** — curate up to 6 repositories to highlight
- **4 dark theme presets** — Forest, Slate, Amber, Plum
- **Custom fields** — add a personal headline and contact phone
- **PDF download** — one-click browser PDF export
- **Activity stats** — recent commits, total stars, forks, followers
- **Auto-pulled socials** — email, website, Twitter from GitHub profile
- **Responsive** — works on every screen size

---

## 🏗️ Architecture
[Architecture](architecture.png)

USER (browser)

↓  types username

NEXT.JS FRONTEND (Vercel)

↓  calls our own API route

NEXT.JS API ROUTE /api/github/[username]

↓                    ↓

GITHUB REST API      Returns structured JSON

(token server-side,  { profile, languages,

never in browser)     repos, stats }

↓

PORTFOLIO PAGE renders with

ProfileHeader + LanguageBars +

ProjectCards + ActivityStats

↓

USER clicks Save & Share

↓

POST /api/portfolio

↓

MONGODB ATLAS (Mongoose)

stores complete snapshot

↓

/p/[slug] — permanent public page

loads from DB, not GitHub

**Why server-side API calls?**
The GitHub token lives in server environment variables only —
never exposed to the browser. This prevents token theft and is
standard production security practice.

**Why store a DB snapshot on Save?**
The saved portfolio loads instantly from our database, never
re-fetching from GitHub. It can't break during evaluation even
if GitHub rate-limits us. It also captures the user's theme
choice and featured repo selection permanently.

---

## 🛠️ Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend + Backend | Next.js 15 (App Router) | One codebase, one deploy, API routes built-in |
| Styling | Tailwind CSS v4 | Design tokens, utility-first, fast iteration |
| Animations | Framer Motion | Smooth, performant, no 3D overhead |
| Database | MongoDB Atlas + Mongoose | Flexible JSON documents match GitHub's data shape |
| Deployment | Vercel | Auto-deploys on every git push |
| Data source | GitHub REST API | Free, no OAuth, 5000 req/hr with token |

---

## 🚀 Run Locally

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/prooffolio
cd prooffolio

# 2. Install
npm install

# 3. Environment variables
# Create .env.local in the project root:
GITHUB_TOKEN=your_github_personal_access_token
MONGODB_URI=your_mongodb_atlas_connection_string

# 4. Run
npm run dev
# Open http://localhost:3000
```

**Get a GitHub token:** GitHub → Settings → Developer settings →
Personal access tokens (classic) → scope: `public_repo`

**Get MongoDB URI:** MongoDB Atlas → Connect → Drivers →
copy the connection string, replace `<password>`, add your DB name

---

## 📁 Project Structure
prooffolio/

├── app/

│   ├── api/

│   │   ├── github/[username]/route.js  ← fetches GitHub data

│   │   └── portfolio/route.js          ← saves to MongoDB

│   ├── lib/

│   │   ├── github.js                   ← GitHub API helper + language math

│   │   └── db.js                       ← MongoDB connection (cached)

│   ├── models/

│   │   └── Portfolio.js                ← Mongoose schema

│   ├── components/

│   │   ├── ProfileHeader.js

│   │   ├── LanguageBars.js

│   │   ├── ProjectCard.js

│   │   └── ActivityStats.js

│   ├── u/[username]/page.js            ← live generated portfolio

│   ├── p/[slug]/page.js                ← saved shareable portfolio

│   └── page.js                         ← landing page

├── .env.local                          ← secrets (gitignored)

└── CLAUDE.md                           ← agent instructions

---

## 🔐 Security Notes

- GitHub token stored server-side only (never in client code)
- MongoDB connection string in environment variables
- No user authentication required (portfolios are public data)
- `.env.local` is gitignored — never committed

---

## 🏆 Built for Devlynix Buildathon 2.0

**Track 5:** Personal Branding — The Dynamic Proof-of-Work Generator

72-hour solo MVP sprint. June 12–15, 2026.

**Stack chosen for:**
- Beginner-explainability (every line understood, not just generated)
- Deployment simplicity (one `git push` = deployed)
- Rubric alignment (Next.js + MongoDB named in the track spec)
