import { githubRequest, handleError } from '../_github.js';

export default async function handler(req, res) {
  const { username } = req.query;
  try {
    const { status, headers, body } = await githubRequest(
      `/users/${username}/repos?per_page=100&sort=updated`
    );
    if (status !== 200) return handleError(res, status, headers);
    res.status(200).json(JSON.parse(body));
  } catch (err) {
    res.status(500).json({ error: 'Failed to reach GitHub API.' });
  }
}
