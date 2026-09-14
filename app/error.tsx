'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="wrap empty-state">
      <h1>A small interruption.</h1>
      <p>
        This page could not finish loading. Try again; your browser’s saved offers have not been
        intentionally removed.
      </p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
