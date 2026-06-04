import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ProfileCard from './components/ProfileCard';
import LanguageChart from './components/LanguageChart';
import CommitChart from './components/CommitChart';
import RepoCard from './components/RepoCard';
import StatsSummary from './components/StatsSummary';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

async function apiFetch(path) {
  const res = await fetch(path);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}


function formatCommitBuckets(buckets) {
  const labels = Object.keys(buckets).map((k) => {
    const [year, month] = k.split('-');
    return new Date(year, month - 1, 1).toLocaleString('default', { month: 'short', year: '2-digit' });
  });
  return { labels, data: Object.values(buckets) };
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  async function handleSearch(username) {
    setLoading(true);
    setError(null);
    setProfileData(null);

    try {
      const [user, repos, languages, commitBuckets] = await Promise.all([
        apiFetch(`/api/user/${username}`),
        apiFetch(`/api/repos/${username}`),
        apiFetch(`/api/languages/${username}`),
        apiFetch(`/api/commits/${username}`),
      ]);

      const commitActivity = formatCommitBuckets(commitBuckets);

      const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);

      const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
      const mostStarred = topRepos[0] || null;
      const mostUsedLang = languages[0]?.name || 'N/A';

      setProfileData({ user, repos, topRepos, languages, commitActivity, totalStars, mostStarred, mostUsedLang });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub Profile Analyzer</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="hero">
          <h1>Explore Any <span>GitHub</span> Profile</h1>
          <p>Visualize languages, commit activity, top repositories, and more.</p>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </section>

        {loading && <Loader />}
        {error && !loading && <ErrorMessage message={error} />}

        {profileData && !loading && (
          <div className="results fade-in">
            <ProfileCard user={profileData.user} />
            <StatsSummary
              totalStars={profileData.totalStars}
              mostUsedLang={profileData.mostUsedLang}
              mostStarred={profileData.mostStarred}
              repoCount={profileData.repos.length}
            />
            <div className="charts-grid">
              <LanguageChart languages={profileData.languages} />
              <CommitChart commitActivity={profileData.commitActivity} />
            </div>
            <section className="repos-section">
              <h2 className="section-title">Top Repositories</h2>
              <div className="repos-grid">
                {profileData.topRepos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built with React &amp; Express &nbsp;·&nbsp; Powered by{' '}
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer">
            GitHub REST API
          </a>
        </p>
        <p className="footer-credit">Made by Prince Christian Parnada</p>
      </footer>
    </div>
  );
}
