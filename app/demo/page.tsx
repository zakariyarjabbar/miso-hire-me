import { DemoControls } from '@/components/demo-controls';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Try the demo — Miso',
  'A sample negotiation and a clear guide to browser-local data.',
  '/demo/',
);
export default function DemoPage() {
  return (
    <div className="wrap reading-page">
      <div className="page-intro">
        <h1>
          Try my
          <br />
          <em>negotiating face.</em>
        </h1>
        <p>A quick way to see the whole fictional offer journey.</p>
      </div>
      <DemoControls />
      <section>
        <h2>Where your offer lives</h2>
        <p>
          Your drafts, offers, and selected nap state are stored in this browser’s localStorage.
          They are shared between tabs on this same origin in this browser profile. They are not
          synchronized across devices.
        </p>
        <p>
          These are user-editable local records, not contracts or verifiable hiring certificates.
          Clearing site data, changing browser profiles, or using another device can make them
          unavailable. A link to an offer cannot transmit its data; share the downloaded souvenir
          PNG instead.
        </p>
        <p>
          If storage is blocked, full, or damaged, the site tells you it has not saved the change.
          You can explicitly choose temporary-session mode. That mode only lasts in the current
          tab’s memory and is lost on refresh or close.
        </p>
      </section>
    </div>
  );
}
