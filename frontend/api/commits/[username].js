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

async function fetchAllCommits(username, repoName, since) {
  const commits = [];
  let page = 1;
  while (page <= 5) {
    const res = await githubRequest(
      `/repos/${username}/${repoName}/commits?author=${username}&since=${since}&per_page=100&page=${page}`
    );
    if (res.status !== 200) break;
    let batch;
    try { batch = JSON.parse(res.body); } catch { break; }
    if (!Array.isArray(batch) || batch.length === 0) break;
    commits.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return commits;
}

export default async function handler(req, res) {
  const { username } = req.query;

  try {
    const reposRes = await githubRequest(`/users/${username}/repos?per_page=100&sort=pushed`);
    if (reposRes.status !== 200) return handleError(res, reposRes.status, reposRes.headers);
    const repos = JSON.parse(reposRes.body);

    const since = new Date();
    since.setFullYear(since.getFullYear() - 1);
    const sinceISO = since.toISOString();

    const results = await Promise.allSettled(
      repos.map((repo) => fetchAllCommits(username, repo.name, sinceISO))
    );

    const buckets = buildMonthBuckets();

    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      for (const commit of result.value) {
        const dateStr = commit.commit?.author?.date || commit.commit?.committer?.date;
        if (!dateStr) continue;
        const d = new Date(dateStr);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (key in buckets) buckets[key]++;
      }
    }

    res.status(200).json({ buckets, repoCount: repos.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch commit data.' });
  }
}
