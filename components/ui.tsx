import Image from 'next/image';
import Link from 'next/link';
import { assetAlt, work } from '@/lib/content';

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      {diagonal ? <path d="M5 19 19 5M5 5h14v14" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  );
}
export function Mark() {
  return (
    <svg
      viewBox="0 0 40 40"
      width="34"
      height="34"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 29V13l8 9 6-9 6 9 8-9v16" />
      <path d="M14 32h12" />
      <path d="M11 6v2m9-4v3m9-1v2" />
    </svg>
  );
}
export function ServiceIcon({ name }: { name: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === 'box' ? (
        <>
          <path d="m4 11 12 6 12-6-12-6-12 6Zm0 0v14l12 5 12-5V11M16 17v13M10 8l12 6" />
          <path d="m4 11-3 4 11 6 4-4 4 4 11-6-3-4" />
        </>
      ) : name === 'keyboard' ? (
        <>
          <rect x="2" y="8" width="28" height="18" rx="3" />
          <path d="M7 13h1m5 0h1m5 0h1m5 0h1M7 18h1m5 0h1m5 0h1m5 0h1M10 22h12" />
        </>
      ) : name === 'camera' ? (
        <>
          <rect x="3" y="7" width="18" height="19" rx="3" />
          <path d="m21 13 8-4v15l-8-4" />
        </>
      ) : (
        <>
          <path d="M2 16s5-9 14-9 14 9 14 9-5 9-14 9S2 16 2 16Z" />
          <circle cx="16" cy="16" r="4" />
        </>
      )}
    </svg>
  );
}
export function Photo({
  name,
  className = '',
  priority = false,
  sizes = '(max-width: 700px) 100vw, 50vw',
}: {
  name: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [width, height] =
    name === 'hero'
      ? [900, 1350]
      : name === 'resume-portrait'
        ? [1254, 1254]
        : name === 'window-portrait'
          ? [1024, 1536]
          : [1440, 960];
  const photo = (
    <Image
      className={`photo ${className}`}
      src={`/images/${name}.webp`}
      alt={assetAlt[name] || 'Miso in his sunny home studio.'}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      sizes={sizes}
    />
  );
  return name === 'hero' ? (
    <picture className="hero-source">
      <source media="(max-width: 600px)" srcSet="/images/hero-mobile.webp" />
      {photo}
    </picture>
  ) : (
    photo
  );
}
export function WorkGrid({ limit = 3 }: { limit?: number }) {
  return (
    <div className="work-grid">
      {work.slice(0, limit).map((item, i) => (
        <Link key={item.slug} className="work-item" href={`/work/${item.slug}/`}>
          <div className="work-photo">
            <Photo name={item.image} sizes="(max-width: 700px) 100vw, 33vw" />
            <span className="work-open">
              <Arrow diagonal />
            </span>
          </div>
          <div className="work-meta">
            <span>{item.category}</span>
            <span>Case study {String(i + 1).padStart(2, '0')}</span>
          </div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </Link>
      ))}
    </div>
  );
}
export function HireInvite() {
  return (
    <section className="hire-invite">
      <div className="wrap invite-inner">
        <div>
          <h2>
            Let’s make
            <br />
            something <em>work.</em>
          </h2>
          <p>I bring the presence. You bring the imaginary treats.</p>
          <Link className="button primary" href="/hire/">
            Make me an offer <Arrow />
          </Link>
        </div>
        <div className="invite-aside">
          <Mark />
          <p>
            Available for meaningful work.
            <br />
            And boxes.
          </p>
          <span>Remote. Mostly from your chair.</span>
        </div>
      </div>
    </section>
  );
}
