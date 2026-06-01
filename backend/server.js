require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const githubAxios = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  },
});

function handleGitHubError(err, res) {
  if (err.response) {
    const status = err.response.status;
    if (status === 404) {
      return res.status(404).json({ error: 'User not found on GitHub.' });
    }
    if (status === 403) {
      const rateLimitReset = err.response.headers['x-ratelimit-reset'];
      const resetTime = rateLimitReset
        ? new Date(rateLimitReset * 1000).toLocaleTimeString()
        : 'soon';
      return res.status(403).json({
        error: `GitHub API rate limit exceeded. Resets at ${resetTime}. Add a GITHUB_TOKEN to increase limits.`,
      });
    }
    if (status === 401) {
      return res.status(401).json({ error: 'Invalid GitHub token. Check your GITHUB_TOKEN in .env.' });
    }
    return res.status(status).json({ error: err.response.data.message || 'GitHub API error.' });
  }
  console.error('Network error:', err.message);
  return res.status(500).json({ error: 'Failed to reach GitHub API. Check your internet connection.' });
}

app.get('/user/:username', async (req, res) => {
  try {
    const { data } = await githubAxios.get(`/users/${req.params.username}`);
    res.json(data);
  } catch (err) {
    handleGitHubError(err, res);
  }
});

app.get('/repos/:username', async (req, res) => {
  try {
    const { data } = await githubAxios.get(`/users/${req.params.username}/repos`, {
      params: { per_page: 100, sort: 'updated' },
    });
    res.json(data);
  } catch (err) {
    handleGitHubError(err, res);
  }
});

app.get('/events/:username', async (req, res) => {
  try {
    const { data } = await githubAxios.get(`/users/${req.params.username}/events/public`, {
      params: { per_page: 100 },
    });
    res.json(data);
  } catch (err) {
    handleGitHubError(err, res);
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// In serverless (Vercel) the file is imported, not run directly — skip listen().
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GitHub Profile Analyzer API running on http://localhost:${PORT}`);
    if (process.env.GITHUB_TOKEN) {
      console.log('GitHub token loaded — higher rate limits active.');
    } else {
      console.log('No GITHUB_TOKEN found — using unauthenticated rate limits (60 req/hr).');
    }
  });
}

module.exports = app;
