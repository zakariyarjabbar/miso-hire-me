'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import {
  acceptOffer,
  draftFromOffer,
  evaluateOffer,
  withdrawOffer,
  type Envelope,
} from '@/lib/offers';
import { localStore } from '@/lib/storage';
import { StorageNotice, useLocalStore } from './local-state';
import { OfferSummary } from './offer-builder';
import { Souvenir } from './souvenir';
export function OfferDetail() {
  const params = useSearchParams();
  const router = useRouter();
  const state = useLocalStore();
  const [error, setError] = useState('');
  const ref = params.get('ref');
  const offer = state.data.offers.find((o) => o.id === ref);
  if (!state.ready)
    return (
      <p className="wrap section" role="status">
        Looking for this offer in your browser…
      </p>
    );
  if (!offer)
    return (
      <div className="wrap">
        <StorageNotice />
        <div className="empty-state">
          <h1>
            I can’t find that
            <br />
            in my paperwork.
          </h1>
          <p>
            This offer isn’t stored in this browser. It may belong to another device or profile, or
            have been deleted. A local offer link does not carry the offer data with it.
          </p>
          <div className="button-row">
            <Link className="button primary" href="/">
              Meet Miso
            </Link>
            <Link className="button" href="/my-offers/">
              My local offers
            </Link>
          </div>
        </div>
      </div>
    );
  const decision = evaluateOffer(offer.currentOffer);
  const finalTreats = Math.max(offer.currentOffer.treats, decision.required.treats);
  function mutate(fn: (data: Envelope) => Envelope) {
    setError('');
    try {
      const result = localStore.mutate((data) => {
        const current = data.offers.find((o) => o.id === offer!.id);
        if (
          !current ||
          current.updatedAt !== offer!.updatedAt ||
          JSON.stringify(current.currentOffer) !== JSON.stringify(offer!.currentOffer)
        )
          throw new Error(
            'This offer changed in another tab. Review its latest terms before continuing.',
          );
        return fn(data);
      });
      if (!result)
        setError(
          'This change was not saved. Resolve browser storage above, or explicitly use a temporary session and try again.',
        );
      return result;
    } catch (e) {
      localStore.refresh();
      setError(e instanceof Error ? e.message : 'This change could not be saved.');
      return false;
    }
  }
  return (
    <div className="wrap">
      <StorageNotice />
      <div className="page-intro">
        <Link href="/my-offers/" className="text-link">
          Back to my offers
        </Link>
        <h1>
          {offer.status === 'accepted'
            ? 'An excellent decision.'
            : offer.status === 'counteroffer'
              ? 'A few small demands.'
              : 'No hard feelings.'}
        </h1>
        <p>
          {offer.status === 'accepted'
            ? 'I knew we would see things my way.'
            : offer.status === 'counteroffer'
              ? 'I’ve considered the role. And my considerable value.'
              : 'I have returned to my previous engagement: the sofa.'}
        </p>
      </div>
      <p className="offer-ref">{offer.id}</p>
      <p className="local-label">
        {state.temporary
          ? 'Temporary-session offer. It will disappear on refresh.'
          : 'Saved in this browser.'}{' '}
        Last updated {new Date(offer.updatedAt).toLocaleString()}.
      </p>
      <div className="offer-layout offer-detail">
        <div>
          <section
            className={`offer-response ${offer.status === 'accepted' ? 'accepted-stamp' : ''}`}
          >
            <span className={`status-label ${offer.status}`}>
              {offer.status === 'counteroffer'
                ? 'Counteroffer'
                : offer.status === 'accepted'
                  ? 'Accepted'
                  : 'Withdrawn'}
            </span>
            <h2>
              {offer.status === 'accepted'
                ? 'You’re hired. Wait. I’m hired.'
                : offer.status === 'counteroffer'
                  ? 'Promising. With revisions.'
                  : 'This offer is withdrawn.'}
            </h2>
            <p>
              {offer.status === 'withdrawn'
                ? 'The fictional engagement is closed. No money was paid, so there is nothing to refund. I will recover with considerable sleep.'
                : offer.response}
            </p>
            {offer.status === 'counteroffer' && (
              <>
                <ul className="terms-list">
                  {decision.missing.map((term) => (
                    <li key={term}>{term}</li>
                  ))}
                </ul>
                <div className="accept-terms">
                  <h3>The terms you’ll accept</h3>
                  <p>
                    <strong>{finalTreats} imaginary treats</strong>
                    {finalTreats !== offer.currentOffer.treats
                      ? ` (changed from ${offer.currentOffer.treats}).`
                      : ' (unchanged).'}
                  </p>
                  {offer.currentOffer.serviceId === 'box-inspection' && (
                    <p>
                      <strong>I may keep the empty box</strong>
                      {offer.currentOffer.keepBox
                        ? ' (unchanged).'
                        : ' (changed from returning it).'}
                    </p>
                  )}
                  <p>All other terms below stay as you proposed.</p>
                  <div className="button-row">
                    <button
                      className="button primary"
                      onClick={() => mutate((data) => acceptOffer(data, offer.id))}
                    >
                      Accept Miso’s terms
                    </button>
                    <button
                      className="text-link link-button"
                      onClick={() => {
                        if (mutate((data) => ({ ...data, draft: draftFromOffer(offer) })))
                          router.push('/hire/');
                      }}
                    >
                      Edit my offer
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
          <h2 className="form-title">
            {offer.status === 'accepted'
              ? 'Our agreed imaginary job'
              : 'Your proposed imaginary job'}
          </h2>
          <OfferSummary input={offer.acceptedTerms || offer.currentOffer} />
          {offer.status !== 'withdrawn' && (
            <div className="button-row">
              <button
                className="link-button"
                onClick={() => {
                  if (
                    window.confirm(
                      offer.status === 'counteroffer'
                        ? 'Decline Miso’s terms and withdraw this fictional offer?'
                        : 'Withdraw this fictional offer? The record will remain in your history.',
                    )
                  )
                    mutate((data) => withdrawOffer(data, offer.id));
                }}
              >
                {offer.status === 'counteroffer' ? 'Decline and withdraw' : 'Withdraw offer'}
              </button>
            </div>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <details className="fine-note">
            <summary>Original offer and event history</summary>
            <p>
              Original compensation: {offer.originalOffer.treats} imaginary treats.{' '}
              {offer.originalOffer.serviceId === 'box-inspection'
                ? offer.originalOffer.keepBox
                  ? 'Box could be kept.'
                  : 'Box had to be returned.'
                : ''}
            </p>
            <ul>
              {offer.events.map((event, i) => (
                <li key={`${event.at}-${i}`}>
                  {event.type} · {new Date(event.at).toLocaleString()}
                </li>
              ))}
            </ul>
          </details>
        </div>
        {offer.status === 'accepted' ? (
          <Souvenir offer={offer} />
        ) : (
          <aside className="offer-aside">
            <h2>
              I negotiate
              <br />
              with confidence.
            </h2>
            <p>Mostly because I have never checked the market rate.</p>
            <p className="aside-note">
              Authored fiction. No message was sent to a person or an animal.
            </p>
            <Link className="text-link" href="/the-fine-print/">
              The fine print
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}
