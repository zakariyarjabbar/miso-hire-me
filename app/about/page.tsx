import { Photo, Arrow, HireInvite } from '@/components/ui';
import { Wake } from '@/components/wake';
import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'A little about me — Miso',
  'Confident. Curious. Affectionate on my own terms. Meet the cat behind the considerable confidence.',
  '/about/',
);
export default function AboutPage() {
  return (
    <>
      <div className="wrap">
        <section className="about-hero">
          <div>
            <h1>
              A little about me.
              <br />
              <em>A lot, if I’m honest.</em>
            </h1>
            <p>
              I’m Miso. A freelance cat with a sunny studio, a broad skill set, and no particular
              interest in being managed.
            </p>
            <p>
              I believe good work should be meaningful, comfortable, and close to a window. I have
              arranged my entire career around these principles.
            </p>
            <Link className="text-link" href="/resume/">
              Read my résumé <Arrow diagonal />
            </Link>
          </div>
          <Photo name="window-portrait" priority />
        </section>
      </div>
      <Wake />
      <div className="wrap">
        <section className="about-story">
          <div>
            <h2>
              My office has
              <br />
              excellent natural light.
            </h2>
            <p>
              It also has a human, who handles most of the typing, and an oak desk, which handles
              most of me. We have a clear division of responsibilities.
            </p>
            <p>
              My day begins with a window inspection. From there I move into keyboard warming, a
              short meeting appearance, and a longer meeting with the sofa.
            </p>
            <p>I work independently. Especially when given instructions.</p>
          </div>
          <Photo name="meeting-cameo" />
        </section>
        <section className="about-story">
          <Photo name="box-detail" />
          <div>
            <h2>
              I bring my
              <br />
              whole self to work.
            </h2>
            <p>
              Every striped inch. I am curious about anything new, deeply loyal to a good box, and
              affectionate when the timing works for both of us. Mostly me.
            </p>
            <p>
              I take the work seriously. I take myself slightly more seriously. My references are
              available from several pieces of furniture.
            </p>
            <Link href="/work/" className="text-link">
              See what that looks like <Arrow diagonal />
            </Link>
          </div>
        </section>
      </div>
      <HireInvite />
    </>
  );
}
