import { Photo } from '@/components/ui';
import { PrintButton } from '@/components/print-button';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'My résumé — Miso, Freelance Cat',
  'An impressive career in sitting, observing, and occupying useful surfaces. Download Miso’s fictional résumé.',
  '/resume/',
  'resume',
);
export default function ResumePage() {
  return (
    <div className="wrap resume-page">
      <div className="page-intro">
        <h1>
          A résumé with
          <br />
          <em>very few gaps.</em>
        </h1>
        <p>The gaps were naps. I stand by them.</p>
      </div>
      <div className="resume-actions">
        <a className="button primary" href="/downloads/miso-freelance-cat-resume.pdf" download>
          Download résumé PDF
        </a>
        <PrintButton />
      </div>
      <article className="resume-sheet">
        <header className="resume-head">
          <div>
            <h1>miso.</h1>
            <p>Freelance Cat</p>
            <p className="fine-note">Remote. Mostly from your chair.</p>
          </div>
          <Photo name="resume-portrait" priority />
        </header>
        <div className="resume-body">
          <div>
            <section>
              <h2>Profile</h2>
              <p>
                I inspect boxes, warm keyboards, and contribute a strong presence to meetings I was
                not invited to. Confident, curious, and committed to occupying the most important
                part of the brief.
              </p>
            </section>
            <section>
              <h2>Selected experience</h2>
              <h3>Independent Cat · The Home Studio</h3>
              <p>Ongoing, with breaks for development and sleep.</p>
              <h3>The Laptop Warming Initiative</h3>
              <p>
                Supported a healthier work-life balance by lying across the keyboard. Delivered one
                overdue human break and several unrequested keystrokes.
              </p>
              <h3>Box 04: Quality Assurance</h3>
              <p>
                Entered, rotated, and stress-tested a delivery container. Approved it for permanent
                retention. Remained on site.
              </p>
              <h3>The Sofa Occupancy Project</h3>
              <p>
                Claimed the central cushion and directed a complete rethink of the human seating
                arrangement.
              </p>
            </section>
            <section>
              <h2>Professional development</h2>
              <p>
                Ongoing independent study in sunbeam tracking, packaging acoustics, and the sound of
                a cupboard opening.
              </p>
            </section>
          </div>
          <aside>
            <section>
              <h2>Core skills</h2>
              <ul>
                <li>Box Inspection</li>
                <li>Keyboard Warming</li>
                <li>Meeting Cameo</li>
                <li>Creative Supervision</li>
                <li>Excellent eye contact</li>
                <li>Strategic stillness</li>
              </ul>
            </section>
            <section>
              <h2>Availability</h2>
              <p>Between naps. My hours depend on the sun, which has not shared its calendar.</p>
              <p className="resume-tagline">Available for meaningful work. And boxes.</p>
            </section>
            <section>
              <h2>References</h2>
              <p>
                <strong>The Sofa</strong>
                <br />
                “He showed up, sat down, and never really left.”
              </p>
              <p>
                <strong>A Cardboard Box</strong>
                <br />
                “A strong commitment to staying.”
              </p>
              <p className="fine-note">Fictional household objects.</p>
            </section>
          </aside>
        </div>
        <p className="resume-disclosure">
          Fictional portfolio demo. Miso is an invented character. No real animal is available for
          hire. No money or treats change paws.
        </p>
      </article>
    </div>
  );
}
