# GitHub Profile Analyzer

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Chart.js](https://img.shields.io/badge/Chart.js-4-ff6384?style=flat-square&logo=chartdotjs)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

A full-stack web application that visualizes any public GitHub profile — languages, commit activity, top repositories, and key stats — in a sleek dark-mode UI.

---

## Screenshots

> _Add screenshots here after running the app._

---

## Features

- **Profile Overview** — Avatar, bio, location, company, follower/following/repo counts, and member since date
- **Top Languages Chart** — Doughnut chart of aggregated language usage across all public repos (top 6 + Other)
- **Commit Activity** — Bar chart of push events per month for the last 12 months via the GitHub Events API
- **Repository Cards** — Top 6 repos by stars with name, description, language, star/fork counts, and last updated
- **Stats Summary** — Total stars, top language, public repo count, and most starred repo at a glance
- **Dark Mode UI** — GitHub-inspired `#0d1117` theme with card-based responsive layout

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + Vite 5                   |
| Styling   | Plain CSS (CSS custom properties)   |
| Charts    | Chart.js 4 + react-chartjs-2        |
| Backend   | Node.js + Express                   |
| HTTP      | Axios (backend proxy to GitHub API) |
| Font      | Inter (Google Fonts)                |

---

## Setup

### Prerequisites

- Node.js 18+
- A GitHub Personal Access Token _(optional but recommended to avoid rate limits)_

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/github-profile-analyzer.git
cd github-profile-analyzer
```

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and paste your GitHub token:

```
GITHUB_TOKEN=ghp_your_token_here
PORT=3001
```

> **Get a token:** GitHub → Settings → Developer settings → Personal access tokens → Generate new token  
> Required scopes: none (public data only)

### 3. Install dependencies

```bash
# From the project root:
cd backend && npm install
cd ../frontend && npm install
```

Or use the root convenience scripts (see below).

### 4. Run the development servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Starts on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and enter any GitHub username.

---

## Project Structure

```
github-profile-analyzer/
├── backend/
│   ├── server.js          # Express proxy — 3 routes wrapping GitHub REST API
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── LanguageChart.jsx  # Doughnut chart
│   │   │   ├── CommitChart.jsx    # Bar chart
│   │   │   ├── RepoCard.jsx
│   │   │   ├── StatsSummary.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   ├── index.html
│   ├── vite.config.js     # Proxies /api → localhost:3001
│   └── package.json
└── README.md
```

---

## API Routes (Backend)

| Method | Path                        | Description                              |
|--------|-----------------------------|------------------------------------------|
| GET    | `/api/user/:username`       | GitHub user profile object               |
| GET    | `/api/repos/:username`      | Up to 100 public repos (sorted updated)  |
| GET    | `/api/events/:username`     | Last 100 public events (for commit chart)|
| GET    | `/health`                   | Health check                             |

---

## Live Demo

> _Add your deployment URL here (Vercel, Render, Railway, etc.)_

---

## License

MIT
