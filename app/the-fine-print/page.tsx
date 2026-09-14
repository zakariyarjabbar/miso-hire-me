import Link from 'next/link';
import { disclosure } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'The fine print — Miso',
  'Fictional working terms and an honest explanation of this local portfolio demo.',
  '/the-fine-print/',
);
export default function FinePrint() {
  return (
    <div className="wrap reading-page">
      <div className="page-intro">
        <h1>
          The fine print.
          <br />
          <em>I sat on the rest.</em>
        </h1>
        <p>{disclosure}</p>
      </div>
      <section>
        <h2>First, the actual explanation.</h2>
        <p>
          This is a web agency portfolio concept about one invented cat. The photographs are
          original generated fictional imagery. Work stories, references, interviews, and offer
          responses are authored fiction. No real animal is represented, booked, or available for
          hire.
        </p>
        <p>
          Imaginary treats are game points. They are not money, a purchase, food, or suggested
          feeding quantities. No payments, reservations, messages, or employment relationships are
          created.
        </p>
      </section>
      <section>
        <h2>My fictional working terms.</h2>
        <ul>
          <li>An inspected box becomes part of my workspace. The contents remain your problem.</li>
          <li>A sunny spot earns a discount. Clouds are an external dependency.</li>
          <li>I reserve the right to consider a closed laptop an open invitation.</li>
          <li>A meeting cameo may become a close-up of my nose.</li>
          <li>All deadlines are subject to a brief but necessary stretch.</li>
        </ul>
        <p>These are jokes, not a legal contract or an animal-hire service.</p>
      </section>
      <section>
        <h2>Your browser is the filing cabinet.</h2>
        <p>
          Drafts and offers stay in localStorage on this site’s origin, in this browser profile.
          Same-origin tabs can see them. Another device cannot. Records are user-editable and can
          disappear when site data is cleared. The app re-reads storage before changes and listens
          for other tabs, but it is not a database and does not promise transactional consistency.
        </p>
        <p>
          I do not request an email, address, password, or payment details. The site has no
          analytics, external lead forms, email delivery, live chat, application backend, or cloud
          synchronization.
        </p>
        <p>
          <Link href="/demo/">View local data and reset Miso’s demo</Link>. The reset removes only
          this app’s namespaced keys after confirmation.
        </p>
      </section>
      <section>
        <h2>A note about sharing.</h2>
        <p>
          Your accepted offer can generate a real PNG souvenir, marked “Fictional demo.” Share the
          file if you want someone else to see it. An offer link only looks up a record in the
          current browser and cannot publicly verify an agreement.
        </p>
        <p>
          Public page previews use bundled public content only. Your personal offer name and terms
          are never added to social metadata.
        </p>
      </section>
    </div>
  );
}
