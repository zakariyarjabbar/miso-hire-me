import type { Metadata } from 'next';
export const origin = new URL(process.env.NEXT_PUBLIC_SITE_ORIGIN || 'http://localhost:3005');
if (
  !['http:', 'https:'].includes(origin.protocol) ||
  origin.pathname !== '/' ||
  origin.search ||
  origin.hash
)
  throw new Error('NEXT_PUBLIC_SITE_ORIGIN must be an HTTP(S) origin without a path.');
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  cover = 'home',
): Metadata {
  const image = new URL(`/social/${cover}.png`, origin).href;
  return {
    title,
    description,
    alternates: { canonical: new URL(path, origin).href },
    openGraph: {
      type: 'website',
      siteName: 'Miso — Freelance Cat',
      title,
      description,
      url: new URL(path, origin).href,
      images: [
        { url: image, width: 1200, height: 630, alt: `${title} — Miso's fictional portfolio` },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image, alt: `${title} — Miso's fictional portfolio` }],
    },
  };
}
