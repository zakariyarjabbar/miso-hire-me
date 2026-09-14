'use client';
import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { localStore } from '@/lib/storage';
export function useLocalStore() {
  return useSyncExternalStore(
    localStore.subscribe,
    localStore.getSnapshot,
    localStore.getServerSnapshot,
  );
}
export function StorageNotice() {
  const state = useLocalStore();
  if (state.temporary)
    return (
      <div className="storage-notice" role="status">
        <p>
          <strong>Temporary session only.</strong> Changes live in this open tab’s memory and
          disappear on refresh or close. They are not saved to your browser history.
        </p>
      </div>
    );
  if (!state.problem) return null;
  return (
    <div className="storage-notice" role="alert">
      <p>{state.problem}</p>
      <button className="button small" onClick={localStore.enableTemporary}>
        Use temporary session
      </button>
      <p>
        <Link href="/demo/">Local data and scoped reset</Link>
      </p>
    </div>
  );
}
