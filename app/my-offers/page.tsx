import { History } from '@/components/history';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'My offers — Miso',
  'Your fictional drafts and offers, stored only in this browser.',
  '/my-offers/',
);
export default function MyOffersPage() {
  return (
    <div className="wrap offer-history">
      <div className="page-intro">
        <h1>
          My very local
          <br />
          <em>paperwork.</em>
        </h1>
        <p>Your drafts, my responses, and the occasional agreement.</p>
      </div>
      <History />
    </div>
  );
}
