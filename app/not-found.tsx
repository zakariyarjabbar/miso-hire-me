import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="wrap empty-state">
      <h1>
        I looked everywhere.
        <br />
        <em>Even in the box.</em>
      </h1>
      <p>This page does not exist. I would help further, but I am now in the box.</p>
      <div className="button-row">
        <Link className="button primary" href="/">
          Back to Miso
        </Link>
        <Link className="button" href="/work/">
          See my work
        </Link>
      </div>
    </div>
  );
}
