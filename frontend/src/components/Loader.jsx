export default function Loader() {
  return (
    <div className="loader-wrapper" role="status" aria-label="Loading profile data">
      <div className="loader-ring">
        <div />
        <div />
        <div />
        <div />
      </div>
      <p className="loader-text">Fetching GitHub data…</p>
    </div>
  );
}
