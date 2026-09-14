import { ServiceLink } from '@/components/service-link';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { work } from '@/lib/content';
import { Arrow, Photo } from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';
export const dynamicParams = false;
export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = work.find((w) => w.slug === slug);
  return story
    ? pageMetadata(`${story.title} — Miso`, story.description, `/work/${story.slug}/`, story.slug)
    : {};
}
export default async function WorkStory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = work.find((w) => w.slug === slug);
  if (!story) notFound();
  return (
    <article className="wrap">
      <div className="page-intro">
        <Link href="/work/" className="text-link">
          Back to my work
        </Link>
        <h1>{story.title}</h1>
        <p>{story.description}</p>
      </div>
      <Photo name={story.image} priority className="case-hero" sizes="100vw" />
      <div className="case-summary">
        <div>
          <span>My role</span>
          <strong>{story.category}</strong>
        </div>
        <div>
          <span>My workplace</span>
          <strong>The home studio</strong>
        </div>
        <div>
          <span>A note on scope</span>
          <strong>{story.note}</strong>
        </div>
      </div>
      <div className="case-copy">
        {[
          ['The brief', story.brief],
          ['My approach', story.approach],
          ['The outcome', story.outcome],
        ].map(([title, copy]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{copy}</p>
          </section>
        ))}
      </div>
      <div className="case-gallery">
        {story.details.map((image) => (
          <Photo key={image} name={image} />
        ))}
      </div>
      <div className="case-outcome">
        <h2>{story.result}</h2>
        <ServiceLink className="button primary" service={story.service}>
          Put me to work <Arrow />
        </ServiceLink>
      </div>
    </article>
  );
}
