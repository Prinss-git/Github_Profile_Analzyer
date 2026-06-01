export default function ProfileCard({ user }) {
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <section className="profile-card card" aria-label="Profile overview">
      <div className="profile-avatar-wrapper">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="profile-avatar"
          width="96"
          height="96"
        />
      </div>

      <div className="profile-info">
        <div className="profile-name-row">
          <h2 className="profile-name">{user.name || user.login}</h2>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="profile-github-link"
            aria-label="Open GitHub profile"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            @{user.login}
          </a>
        </div>

        {user.bio && <p className="profile-bio">{user.bio}</p>}

        <div className="profile-meta">
          {user.location && (
            <span className="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {user.location}
            </span>
          )}
          {user.company && (
            <span className="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              {user.company.replace(/^@/, '')}
            </span>
          )}
          {user.blog && (
            <a
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="meta-item meta-link"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              {user.blog.replace(/^https?:\/\//, '')}
            </a>
          )}
          <span className="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Member since {memberSince}
          </span>
        </div>

        <div className="profile-stats">
          <div className="stat-pill">
            <span className="stat-value">{user.followers.toLocaleString()}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value">{user.following.toLocaleString()}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value">{user.public_repos.toLocaleString()}</span>
            <span className="stat-label">Repos</span>
          </div>
          {user.public_gists > 0 && (
            <div className="stat-pill">
              <span className="stat-value">{user.public_gists.toLocaleString()}</span>
              <span className="stat-label">Gists</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
