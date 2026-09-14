import { isServiceId } from './content';
import {
  emptyEnvelope,
  validateOffer,
  type Draft,
  type DraftFields,
  type Envelope,
  type OfferInput,
  type OfferRecord,
} from './offers';
export const STORAGE_KEY = 'miso-hire-me:demo:v1';
export const STORAGE_PREFIX = 'miso-hire-me:demo:';
type StoragePort = Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'>;
export type Snapshot = {
  data: Envelope;
  ready: boolean;
  temporary: boolean;
  problem: string | null;
};
const object = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const iso = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{4}-\d\d-\d\dT/.test(v) && Number.isFinite(Date.parse(v));
const id = (v: unknown): v is string =>
  typeof v === 'string' && /^MISO-[a-zA-Z0-9-]{8,80}$/.test(v);
function validInput(v: unknown): v is OfferInput {
  return object(v) && Object.keys(validateOffer(v as OfferInput)).length === 0;
}
function validFields(v: unknown): v is DraftFields {
  return (
    object(v) &&
    isServiceId(v.serviceId) &&
    [15, 30, 60].includes(v.duration as number) &&
    typeof v.displayName === 'string' &&
    v.displayName.length <= 60 &&
    typeof v.job === 'string' &&
    v.job.length <= 240 &&
    typeof v.sunny === 'boolean' &&
    typeof v.keepBox === 'boolean' &&
    typeof v.treats === 'string' &&
    v.treats.length <= 10
  );
}
function validDraft(v: unknown): v is Draft {
  return (
    object(v) &&
    id(v.id) &&
    v.status === 'draft' &&
    iso(v.createdAt) &&
    iso(v.updatedAt) &&
    [1, 2, 3].includes(v.step as number) &&
    validFields(v.fields) &&
    (v.editingRef === undefined || v.editingRef === v.id) &&
    (v.prefillService === undefined || isServiceId(v.prefillService))
  );
}
function validRecord(v: unknown): v is OfferRecord {
  return (
    object(v) &&
    id(v.id) &&
    iso(v.createdAt) &&
    iso(v.updatedAt) &&
    validInput(v.originalOffer) &&
    validInput(v.currentOffer) &&
    object(v.requiredTerms) &&
    Number.isInteger(v.requiredTerms.treats) &&
    (v.requiredTerms.treats as number) >= 1 &&
    (v.requiredTerms.treats as number) <= 50 &&
    typeof v.requiredTerms.keepBox === 'boolean' &&
    typeof v.response === 'string' &&
    v.response.length <= 1000 &&
    ['counteroffer', 'accepted', 'withdrawn'].includes(v.status as string) &&
    (v.status !== 'accepted' || validInput(v.acceptedTerms)) &&
    (v.acceptedTerms === undefined || validInput(v.acceptedTerms)) &&
    Array.isArray(v.events) &&
    v.events.length <= 500 &&
    v.events.every(
      (e) =>
        object(e) &&
        ['submitted', 'revised', 'accepted', 'withdrawn'].includes(e.type as string) &&
        iso(e.at),
    )
  );
}
export function parseEnvelope(raw: string | null): { data: Envelope; problem: string | null } {
  if (raw === null) return { data: emptyEnvelope(), problem: null };
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return {
      data: emptyEnvelope(),
      problem:
        'Saved data could not be read. Nothing has been overwritten. Reset Miso’s data or explicitly use this temporary session.',
    };
  }
  if (!object(value) || value.version !== 1)
    return {
      data: emptyEnvelope(),
      problem:
        'This saved-data version is not supported. It has been preserved. Use a temporary session or reset Miso’s data.',
    };
  const source = Array.isArray(value.offers) ? value.offers : [];
  const offers: OfferRecord[] = [];
  const seen = new Set<string>();
  for (const entry of source) {
    if (validRecord(entry) && !seen.has(entry.id)) {
      offers.push(entry);
      seen.add(entry.id);
    }
  }
  const draft = validDraft(value.draft) ? value.draft : null;
  const preferences = {
    awake:
      object(value.preferences) && typeof value.preferences.awake === 'boolean'
        ? value.preferences.awake
        : false,
  };
  const damaged =
    !Array.isArray(value.offers) ||
    offers.length !== source.length ||
    (value.draft !== null && !draft) ||
    !object(value.preferences) ||
    typeof value.preferences.awake !== 'boolean';
  return {
    data: { version: 1, draft, offers, preferences },
    problem: damaged
      ? 'Some saved data is damaged. Readable records are shown; the original data has not been overwritten. Reset or use a temporary session to continue.'
      : null,
  };
}
export class LocalStore {
  private listeners = new Set<() => void>();
  private started = false;
  private snapshot: Snapshot = {
    data: emptyEnvelope(),
    ready: false,
    temporary: false,
    problem: null,
  };
  private serverSnapshot = this.snapshot;
  constructor(private port: () => StoragePort) {}
  getSnapshot = () => this.snapshot;
  getServerSnapshot = () => this.serverSnapshot;
  private emit() {
    for (const listener of this.listeners) listener();
  }
  private read() {
    const port = this.port();
    const parsed = parseEnvelope(port.getItem(STORAGE_KEY));
    if (port.getItem(STORAGE_KEY) === null) {
      for (let i = 0; i < port.length; i++) {
        const key = port.key(i);
        if (key?.startsWith(STORAGE_PREFIX) && key !== STORAGE_KEY)
          return {
            ...parsed,
            problem:
              'An older or newer Miso data version exists. It is preserved; automatic migration is unavailable. Reset Miso’s data or use a temporary session.',
          };
      }
    }
    return parsed;
  }
  refresh = () => {
    if (this.snapshot.temporary) return;
    try {
      this.snapshot = { ...this.snapshot, ...this.read(), ready: true };
    } catch {
      this.snapshot = {
        ...this.snapshot,
        ready: true,
        problem:
          'Browser storage is unavailable. Nothing new has been saved. You can explicitly continue for this temporary session.',
      };
    }
    this.emit();
  };
  initialize() {
    if (this.started) return;
    this.started = true;
    this.refresh();
  }
  subscribe = (listener: () => void) => {
    const reconnecting = this.started && this.listeners.size === 0;
    this.listeners.add(listener);
    this.initialize();
    if (reconnecting) this.refresh();
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key.startsWith(STORAGE_PREFIX)) this.refresh();
    };
    if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);
    return () => {
      this.listeners.delete(listener);
      if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
    };
  };
  mutate = (change: (data: Envelope) => Envelope): boolean => {
    this.initialize();
    if (this.snapshot.temporary) {
      this.snapshot = { ...this.snapshot, data: change(this.snapshot.data) };
      this.emit();
      return true;
    }
    let base: Envelope;
    try {
      const fresh = this.read();
      if (fresh.problem) {
        this.snapshot = { ...this.snapshot, ...fresh, ready: true };
        this.emit();
        return false;
      }
      base = fresh.data;
    } catch {
      this.snapshot = {
        ...this.snapshot,
        problem:
          'Browser storage is unavailable. This change was not saved. Choose temporary-session mode to continue without saving.',
      };
      this.emit();
      return false;
    }
    const next = change(base);
    try {
      this.port().setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      this.snapshot = {
        ...this.snapshot,
        data: base,
        problem:
          'Browser storage could not save this change. It may be full or blocked. Your offer was not saved. Choose temporary-session mode to continue without saving.',
      };
      this.emit();
      return false;
    }
    this.snapshot = { data: next, ready: true, temporary: false, problem: null };
    this.emit();
    return true;
  };
  enableTemporary = () => {
    this.initialize();
    this.snapshot = { ...this.snapshot, temporary: true, problem: null };
    this.emit();
  };
  reset = (): boolean => {
    try {
      const port = this.port();
      const keys: string[] = [];
      for (let i = 0; i < port.length; i++) {
        const key = port.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) keys.push(key);
      }
      for (const key of keys) port.removeItem(key);
    } catch {
      this.snapshot = {
        ...this.snapshot,
        problem:
          'Miso’s stored data could not be removed. No unrelated keys were touched. Check your browser’s site-data settings.',
      };
      this.emit();
      return false;
    }
    this.snapshot = { data: emptyEnvelope(), ready: true, temporary: false, problem: null };
    this.emit();
    return true;
  };
}
export const localStore = new LocalStore(() => window.localStorage);
