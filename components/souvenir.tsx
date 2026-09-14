'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { OfferRecord } from '@/lib/offers';
export function Souvenir({ offer }: { offer: OfferRecord }) {
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  async function create() {
    setBusy(true);
    setMessage('Loading my portrait and fonts…');
    try {
      const { renderCard, downloadBlob } = await import('@/lib/card-export');
      const blob = await renderCard(offer);
      setPreview(URL.createObjectURL(blob));
      downloadBlob(blob, `i-hired-miso-${offer.id.slice(-8)}.png`);
      setMessage(
        'Your 1080 × 1350 PNG is ready. Download requested; check your browser’s downloads.',
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'The card could not be created. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <aside className="souvenir-panel">
      <h2>
        A little proof
        <br />
        of excellent judgment.
      </h2>
      <p>A keepsake with my face, your name, and our entirely imaginary agreement.</p>
      {preview ? (
        <Image
          className="card-preview"
          src={preview}
          alt={`I hired Miso souvenir for ${offer.acceptedTerms?.displayName}`}
          width={1080}
          height={1350}
          unoptimized
        />
      ) : (
        <p className="fine-note">A portrait card, made right here in your browser.</p>
      )}
      <button className="button primary" onClick={create} disabled={busy}>
        {busy ? 'Making your card…' : 'Download “I hired Miso” PNG'}
      </button>
      <p className="download-status" role="status">
        {message}
      </p>
      <p className="fine-note">
        Share the PNG file. This offer’s link can only open the record in the browser where it is
        stored.
      </p>
    </aside>
  );
}
