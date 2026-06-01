const https = require('https');

function githubRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method: 'GET',
      headers: {
        'User-Agent': 'github-profile-analyzer',
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function handleError(res, status, headers) {
  if (status === 404) {
    return res.status(404).json({ error: 'User not found on GitHub.' });
  }
  if (status === 403) {
    const reset = headers['x-ratelimit-reset'];
    const time = reset ? new Date(reset * 1000).toLocaleTimeString() : 'soon';
    return res.status(403).json({
      error: `GitHub API rate limit exceeded. Resets at ${time}. Add a GITHUB_TOKEN to increase limits.`,
    });
  }
  if (status === 401) {
    return res.status(401).json({ error: 'Invalid GitHub token.' });
  }
  return res.status(status).json({ error: `GitHub API error (${status}).` });
}

module.exports = { githubRequest, handleError };
