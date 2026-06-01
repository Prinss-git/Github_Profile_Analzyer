import { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [input, setInput] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) onSearch(trimmed);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit(e);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Enter a GitHub username…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          aria-label="GitHub username"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      <button type="submit" className="search-btn" disabled={loading || !input.trim()}>
        {loading ? 'Searching…' : 'Analyze'}
      </button>
    </form>
  );
}
