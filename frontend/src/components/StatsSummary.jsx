export default function StatsSummary({ totalStars, mostUsedLang, mostStarred, repoCount }) {
  return (
    <section className="stats-summary" aria-label="Profile statistics">
      <div className="stat-card">
        <div className="stat-card-icon stat-card-icon--stars">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div className="stat-card-body">
          <span className="stat-card-value">{totalStars.toLocaleString()}</span>
          <span className="stat-card-label">Total Stars</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-icon stat-card-icon--lang">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <div className="stat-card-body">
          <span className="stat-card-value">{mostUsedLang}</span>
          <span className="stat-card-label">Top Language</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-icon stat-card-icon--repo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div className="stat-card-body">
          <span className="stat-card-value">{repoCount}</span>
          <span className="stat-card-label">Public Repos</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-icon stat-card-icon--trophy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="8 6 2 12 8 18" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M16 6l4 6-4 6" />
          </svg>
        </div>
        <div className="stat-card-body">
          <span className="stat-card-value stat-card-value--small">
            {mostStarred ? mostStarred.name : 'N/A'}
          </span>
          <span className="stat-card-label">Most Starred Repo</span>
        </div>
      </div>
    </section>
  );
}
