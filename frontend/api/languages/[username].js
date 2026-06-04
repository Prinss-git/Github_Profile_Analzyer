import { githubRequest, handleError } from '../_github.js';

export default async function handler(req, res) {
  const { username } = req.query;

  try {
    const reposRes = await githubRequest(`/users/${username}/repos?per_page=100&sort=pushed`);
    if (reposRes.status !== 200) return handleError(res, reposRes.status, reposRes.headers);
    const repos = JSON.parse(reposRes.body);

    // Fetch language breakdown for every repo in parallel
    const results = await Promise.allSettled(
      repos.map((repo) => githubRequest(`/repos/${username}/${repo.name}/languages`))
    );

    const totals = {};
    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      const { status, body } = result.value;
      if (status !== 200) continue;
      let langMap;
      try { langMap = JSON.parse(body); } catch { continue; }
      for (const [lang, bytes] of Object.entries(langMap)) {
        totals[lang] = (totals[lang] || 0) + bytes;
      }
    }

    const total = Object.values(totals).reduce((s, v) => s + v, 0);
    const sorted = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([name, bytes]) => ({
        name,
        bytes,
        percent: total > 0 ? ((bytes / total) * 100).toFixed(1) : '0.0',
      }));

    res.status(200).json(sorted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch language data.' });
  }
}
