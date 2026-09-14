import { Suspense } from 'react';
import { OfferDetail } from '@/components/offer-detail';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Your browser-local offer — Miso',
  'A fictional offer saved only in the browser where it was made. Meet Miso and create your own.',
  '/offer/',
);
export default function OfferPage() {
  return (
    <Suspense fallback={<p className="wrap section">Getting my paperwork…</p>}>
      <OfferDetail />
    </Suspense>
  );
}
