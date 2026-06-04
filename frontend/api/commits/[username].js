import { githubRequest, handleError } from '../_github.js';

function buildMonthBuckets() {
  const now = new Date();
  const buckets = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    buckets[key] = 0;
  }
  return buckets;
}

export default async function handler(req, res) {
  const { username } = req.query;

  try {
    // Fetch repos
    const reposRes = await githubRequest(`/users/${username}/repos?per_page=100&sort=pushed`);
    if (reposRes.status !== 200) return handleError(res, reposRes.status, reposRes.headers);
    const repos = JSON.parse(reposRes.body);

    const since = new Date();
    since.setFullYear(since.getFullYear() - 1);
    const sinceISO = since.toISOString();

    // Top 30 repos by push date (already sorted), fetch commits in parallel
    const top = repos.slice(0, 30);

    const results = await Promise.allSettled(
      top.map((repo) =>
        githubRequest(
          `/repos/${username}/${repo.name}/commits?author=${username}&since=${sinceISO}&per_page=100`
        )
      )
    );

    const buckets = buildMonthBuckets();

    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      const { status, body } = result.value;
      if (status !== 200) continue;
      let commits;
      try { commits = JSON.parse(body); } catch { continue; }
      if (!Array.isArray(commits)) continue;

      for (const commit of commits) {
        const dateStr = commit.commit?.author?.date || commit.commit?.committer?.date;
        if (!dateStr) continue;
        const d = new Date(dateStr);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (key in buckets) buckets[key]++;
      }
    }

    res.status(200).json(buckets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch commit data.' });
  }
}
