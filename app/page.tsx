import { ServiceLink } from '@/components/service-link';
import Link from 'next/link';
import { Arrow, HireInvite, Photo, ServiceIcon, WorkGrid } from '@/components/ui';
import { Interview } from '@/components/interview';
import { services } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Miso — Freelance Cat. Available for Hire.',
  'Box inspector. Keyboard warmer. Occasional meeting guest. Meet Miso, a fictional cat with a very serious portfolio.',
  '/',
);
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <h1>
              Hire me.
              <br />
              I’m very
              <br />
              <em>employable.</em>
            </h1>
            <p>
              I inspect boxes, warm keyboards, and bring a strong presence to meetings I was not
              invited to.
            </p>
            <div className="hero-actions">
              <Link href="/hire/" className="button primary">
                Make me an offer <Arrow />
              </Link>
              <Link href="/work/" className="text-link">
                See my work <Arrow diagonal />
              </Link>
            </div>
            <span className="hero-footnote">Available for meaningful work. And boxes.</span>
          </div>
          <div className="hero-art">
            <div className="cat-seal">
              PROFESSIONALLY
              <br />
              <strong>unbothered.</strong>
              <span>Since my first nap</span>
            </div>
            <Photo name="hero" priority sizes="(max-width: 700px) 65vw, 45vw" />
            <span className="photo-note">
              Miso. Freelance Cat.<small>Independent. Especially when given instructions.</small>
            </span>
          </div>
        </div>
        <div className="hero-bottom wrap">
          <span>A small cat. A considerable skill set.</span>
          <a href="#what-i-do" className="text-link">
            Scroll to meet me{' '}
            <svg
              viewBox="0 0 20 20"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M10 3v14m-5-5 5 5 5-5" />
            </svg>
          </a>
        </div>
      </section>
      <section id="what-i-do" className="wrap section services-section">
        <div className="section-heading">
          <h2>
            A few things
            <br />I take <em>very seriously.</em>
          </h2>
          <p>
            Specialist work. Natural talent.
            <br />
            Extremely flexible interpretation of the brief.
          </p>
        </div>
        <div className="service-grid">
          {services.map((s) => (
            <ServiceLink className="service-item" service={s.id} key={s.id}>
              <ServiceIcon name={s.icon} />
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <span>
                From {s.baseFee} imaginary treats <Arrow diagonal />
              </span>
            </ServiceLink>
          ))}
        </div>
      </section>
      <section className="wrap section selected-work">
        <div className="section-heading">
          <div>
            <h2>
              Less talk.
              <br />
              More sitting on things.
            </h2>
          </div>
          <Link className="text-link" href="/work/">
            All my work <Arrow diagonal />
          </Link>
        </div>
        <WorkGrid />
      </section>
      <section className="why-section">
        <div className="wrap why-grid">
          <div className="why-photo">
            <Photo name="window-portrait" />
            <span className="caption-label">Deep in a strategic thinking session.</span>
          </div>
          <div>
            <h2>
              Small colleague.
              <br />
              Big contribution.
            </h2>
            <p className="lead">
              I’ve been doing this my entire life.
              <br />I just recently started calling it work.
            </p>
            <dl className="strengths">
              <div>
                <dt>Excellent attention to detail.</dt>
                <dd>I can hear a treat bag from three rooms away.</dd>
              </div>
              <div>
                <dt>A calming presence.</dt>
                <dd>I make even your busiest day look overcomplicated.</dd>
              </div>
              <div>
                <dt>Real commitment.</dt>
                <dd>Once I choose a box, I see it through.</dd>
              </div>
              <div>
                <dt>One area for development.</dt>
                <dd>I have never used a spreadsheet correctly.</dd>
              </div>
            </dl>
            <Link className="text-link" href="/about/">
              A little more about me <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
      <Interview />
      <section className="wrap section references">
        <div className="section-heading">
          <h2>
            Don’t take
            <br />
            my word for it.
          </h2>
          <p>
            References from things
            <br />I have personally sat on.
          </p>
        </div>
        <div className="reference-grid">
          <figure>
            <blockquote>“He showed up, sat down, and never really left.”</blockquote>
            <figcaption>
              The Sofa <span>Long-term collaborator</span>
            </figcaption>
          </figure>
          <figure>
            <blockquote>“My fan has never worked harder. His has never been larger.”</blockquote>
            <figcaption>
              The Laptop <span>Formerly portable</span>
            </figcaption>
          </figure>
          <figure>
            <blockquote>
              “I was going to be recycled. He gave me a purpose. And tooth marks.”
            </blockquote>
            <figcaption>
              A Cardboard Box <span>Retained on a permanent basis</span>
            </figcaption>
          </figure>
        </div>
        <p className="fine-note">
          Fictional references. Actual furniture would have more complaints.
        </p>
      </section>
      <HireInvite />
    </>
  );
}
