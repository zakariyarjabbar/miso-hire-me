'use client';
import { useState } from 'react';
import Link from 'next/link';
import { getService } from '@/lib/content';
import { withdrawOffer } from '@/lib/offers';
import { localStore } from '@/lib/storage';
import { StorageNotice, useLocalStore } from './local-state';
export function History() {
  const state = useLocalStore();
  const [message, setMessage] = useState('');
  if (!state.ready) return <p role="status">Reading this browser’s offer history…</p>;
  function remove(id: string) {
    if (!window.confirm('Delete this offer from this browser? This cannot be undone.')) return;
    const ok = localStore.mutate((data) => ({
      ...data,
      offers: data.offers.filter((o) => o.id !== id),
      draft: data.draft?.id === id ? null : data.draft,
    }));
    setMessage(
      ok
        ? state.temporary
          ? 'Offer removed from this temporary session.'
          : 'Offer deleted from this browser.'
        : 'The offer was not deleted. Resolve storage above and try again.',
    );
  }
  return (
    <>
      <StorageNotice />
      <p className="local-label">
        Only offers stored in this browser profile appear here. Nothing synchronizes across devices.
      </p>
      {state.data.draft && (
        <article className="history-item">
          <div>
            <span className="status-label">Draft</span>
            <h2>{getService(state.data.draft.fields.serviceId).name}</h2>
            <p>
              {state.data.draft.fields.displayName || 'An introduction in progress'} · Step{' '}
              {state.data.draft.step} of 3
            </p>
          </div>
          <div className="history-actions">
            <Link className="button" href="/hire/">
              Resume draft
            </Link>
            <button
              className="link-button"
              onClick={() => {
                if (window.confirm('Delete this unfinished draft?')) {
                  const ok = localStore.mutate((data) => ({ ...data, draft: null }));
                  setMessage(
                    ok ? 'Draft deleted.' : 'Draft was not deleted. Resolve storage above.',
                  );
                }
              }}
            >
              Delete draft
            </button>
          </div>
        </article>
      )}
      {!state.data.offers.length && !state.data.draft ? (
        <div className="empty-state">
          <h2>
            Nobody has hired me yet.
            <br />
            I’m handling it with
            <br />
            <em>considerable sleep.</em>
          </h2>
          <p>
            Your offers will appear here after you create one. No suspiciously impressive sample
            history has been added.
          </p>
          <div className="button-row">
            <Link className="button primary" href="/hire/">
              Make my first offer
            </Link>
            <Link className="text-link" href="/demo/">
              Try a sample scenario
            </Link>
          </div>
        </div>
      ) : (
        state.data.offers.map((offer) => (
          <article className="history-item" key={offer.id}>
            <div>
              <span className={`status-label ${offer.status}`}>
                {offer.status === 'counteroffer'
                  ? 'Counteroffer'
                  : offer.status === 'accepted'
                    ? 'Accepted'
                    : 'Withdrawn'}
              </span>
              <h2>
                <Link href={`/offer/?ref=${encodeURIComponent(offer.id)}`}>
                  {getService(offer.currentOffer.serviceId).name}
                </Link>
              </h2>
              <p>
                {offer.currentOffer.displayName} ·{' '}
                {(offer.acceptedTerms || offer.currentOffer).treats} imaginary treats ·{' '}
                {new Date(offer.updatedAt).toLocaleDateString()}
              </p>
              <p className="offer-ref">{offer.id}</p>
            </div>
            <div className="history-actions">
              <Link className="button" href={`/offer/?ref=${encodeURIComponent(offer.id)}`}>
                {offer.status === 'counteroffer' ? 'Review response' : 'View offer'}
              </Link>
              {offer.status !== 'withdrawn' && (
                <button
                  className="link-button"
                  onClick={() => {
                    if (window.confirm('Withdraw this fictional offer? Its record will remain.')) {
                      const ok = localStore.mutate((data) => withdrawOffer(data, offer.id));
                      setMessage(
                        ok ? 'Offer withdrawn.' : 'Offer was not withdrawn. Resolve storage above.',
                      );
                    }
                  }}
                >
                  Withdraw
                </button>
              )}
              <button className="link-button" onClick={() => remove(offer.id)}>
                Delete
              </button>
            </div>
          </article>
        ))
      )}
      <p role="status" className="download-status">
        {message}
      </p>
    </>
  );
}
