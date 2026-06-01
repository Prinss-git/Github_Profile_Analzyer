const { githubRequest, handleError } = require('../_github');

module.exports = async function handler(req, res) {
  const { username } = req.query;
  try {
    const { status, headers, body } = await githubRequest(
      `/users/${username}/events/public?per_page=100`
    );
    if (status !== 200) return handleError(res, status, headers);
    res.status(200).json(JSON.parse(body));
  } catch (err) {
    res.status(500).json({ error: 'Failed to reach GitHub API.' });
  }
};
