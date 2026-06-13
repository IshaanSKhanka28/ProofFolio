// app/components/mockData.js
// Fake portfolio data that matches our API's exact shape:
// { profile, languages, repos }.
// We use this to build and style the UI without calling GitHub every time.

const mockData = {
  // Same fields our API returns for profile.
  profile: {
    name: "Ada Lovelace",
    avatarUrl: "https://avatars.githubusercontent.com/u/583231",
    bio: "Full-stack developer who loves clean APIs and good coffee.",
    followers: 1287,
    location: "London, UK",
  },

  // Each percent is a whole number; together they add up to 100.
  languages: [
    { name: "JavaScript", percent: 34 },
    { name: "TypeScript", percent: 25 },
    { name: "Python", percent: 18 },
    { name: "CSS", percent: 12 },
    { name: "Go", percent: 7 },
    { name: "Shell", percent: 4 },
  ],

  // Six repos. Two of them have liveUrl set to null (no live site).
  repos: [
    {
      name: "portfolio-engine",
      description: "Turns a GitHub username into a polished portfolio page.",
      stars: 342,
      repoUrl: "https://github.com/adalovelace/portfolio-engine",
      liveUrl: "https://portfolio-engine.vercel.app",
      language: "TypeScript",
    },
    {
      name: "task-flow",
      description: "Minimal kanban board with drag-and-drop and keyboard shortcuts.",
      stars: 198,
      repoUrl: "https://github.com/adalovelace/task-flow",
      liveUrl: "https://task-flow.vercel.app",
      language: "JavaScript",
    },
    {
      name: "weather-cli",
      description: "Fast terminal weather tool with colorful forecasts.",
      stars: 87,
      repoUrl: "https://github.com/adalovelace/weather-cli",
      liveUrl: null,
      language: "Go",
    },
    {
      name: "data-cleaner",
      description: "Small Python library for tidying messy CSV files.",
      stars: 64,
      repoUrl: "https://github.com/adalovelace/data-cleaner",
      liveUrl: null,
      language: "Python",
    },
    {
      name: "ui-snippets",
      description: "Reusable Tailwind component blocks for quick prototyping.",
      stars: 521,
      repoUrl: "https://github.com/adalovelace/ui-snippets",
      liveUrl: "https://ui-snippets.vercel.app",
      language: "CSS",
    },
    {
      name: "api-playground",
      description: "Browser-based tool to test REST endpoints without a login.",
      stars: 153,
      repoUrl: "https://github.com/adalovelace/api-playground",
      liveUrl: "https://api-playground.vercel.app",
      language: "JavaScript",
    },
  ],
};

// Default export so other files can import it with any name.
export default mockData;
