'use client';
import { localStore } from '@/lib/storage';
import { Photo } from './ui';
import { StorageNotice, useLocalStore } from './local-state';
export function Wake() {
  const state = useLocalStore();
  const awake = state.data.preferences.awake;
  return (
    <section className="wake-section">
      <div className="wrap">
        <div className="wake-grid">
          <div className="wake-portrait">
            <Photo key={String(awake)} name={awake ? 'awake' : 'sleepy'} />
          </div>
          <div className="wake-copy">
            <h2>{awake ? 'I was working.' : 'Currently in a deep work session.'}</h2>
            <p>
              {awake
                ? 'My eyes were closed for strategic reasons. I am now available for a very brief discussion.'
                : 'Some call it sleeping. I call it an extended period of internal research.'}
            </p>
            <button
              className="button"
              aria-pressed={awake}
              onClick={() =>
                localStore.mutate((data) => ({
                  ...data,
                  preferences: { ...data.preferences, awake: !data.preferences.awake },
                }))
              }
            >
              {awake ? 'Let Miso nap' : 'Wake Miso'}
            </button>
            <p className="wake-reply" aria-live="polite">
              {awake ? '“This had better involve a box.”' : 'Quietly pursuing excellence.'}
            </p>
            <span className="fine-note">An authored character mood, not a live cat status.</span>
          </div>
        </div>
        <StorageNotice />
      </div>
    </section>
  );
}
