'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { newDraft, sampleFields } from '@/lib/offers';
import { localStore } from '@/lib/storage';
import { StorageNotice, useLocalStore } from './local-state';
export function DemoControls() {
  const state = useLocalStore();
  const router = useRouter();
  const [message, setMessage] = useState('');
  function sample() {
    if (
      state.data.draft &&
      !window.confirm('Replace your current draft with the sample? Submitted offers will remain.')
    )
      return;
    const draft = { ...newDraft(), fields: { ...sampleFields } };
    if (localStore.mutate((data) => ({ ...data, draft }))) router.push('/hire/');
    else
      setMessage(
        'The sample draft was not saved. Resolve storage or choose a temporary session above, then try again.',
      );
  }
  function reset() {
    if (
      !window.confirm(
        'Delete Miso’s drafts, offers, and preferences in this browser? This cannot be undone. Data belonging to other apps will remain.',
      )
    )
      return;
    setMessage(
      localStore.reset()
        ? 'Miso’s local data has been reset. Other apps’ storage was left untouched.'
        : 'Miso’s data could not be reset. See the storage notice above.',
    );
  }
  return (
    <>
      <StorageNotice />
      <section>
        <h2>Try one small negotiation.</h2>
        <p>
          The sample asks me to inspect a box for 30 minutes in a sunny spot. It offers 2 imaginary
          treats and asks me to return the box. My terms are 4 imaginary treats and keeping the
          empty box.
        </p>
        <p>
          You can review the draft, send it, accept my terms, and download your souvenir. Nothing
          appears in your history until you choose to send the demo offer.
        </p>
        <button className="button primary" disabled={!state.ready} onClick={sample}>
          Load sample offer
        </button>
      </section>
      <section>
        <h2>My entire filing cabinet.</h2>
        <p>
          {state.ready
            ? `${state.data.offers.length} submitted offer${state.data.offers.length === 1 ? '' : 's'} and ${state.data.draft ? 'one draft' : 'no drafts'} in ${state.temporary ? 'this temporary session' : 'this browser'}.`
            : 'Checking this browser…'}
        </p>
        <p>
          The reset below removes only Miso’s namespaced demo keys. It does not clear the rest of
          your browser storage. Reset cannot recover deleted offers.
        </p>
        <button className="button danger" disabled={!state.ready} onClick={reset}>
          Reset Miso’s local data
        </button>
      </section>
      <p className="download-status" role="status">
        {message}
      </p>
    </>
  );
}
