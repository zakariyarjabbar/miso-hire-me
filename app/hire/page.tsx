import { Suspense } from 'react';
import { OfferBuilder } from '@/components/offer-builder';
import { FormLoading } from '@/components/form-loading';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Make me an offer — Miso',
  'A fictional job offer. A very real amount of consideration. Everything stays in your browser.',
  '/hire/',
);
export default function HirePage() {
  return (
    <>
      <div className="wrap">
        <div className="page-intro">
          <h1>
            Let’s discuss
            <br />
            <em>my next nap. Job.</em>
          </h1>
          <p>Tell me what you need. I’ll tell you what I deserve.</p>
        </div>
      </div>
      <Suspense fallback={<FormLoading />}>
        <OfferBuilder />
      </Suspense>
    </>
  );
}
