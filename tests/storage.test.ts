import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyEnvelope, newDraft, sampleFields, submitDraft } from '../lib/offers';
import { LocalStore, parseEnvelope, STORAGE_KEY } from '../lib/storage';
class MemoryStorage {
  data = new Map<string, string>();
  writes = 0;
  failWrite = false;
  failRead = false;
  failDelete = false;
  get length() {
    return this.data.size;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  getItem(key: string) {
    if (this.failRead) throw new Error('SecurityError');
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    if (this.failWrite) throw new Error('QuotaExceededError');
    this.writes++;
    this.data.set(key, value);
  }
  removeItem(key: string) {
    if (this.failDelete) throw new Error('SecurityError');
    this.data.delete(key);
  }
}
const fixture = () => {
  const draft = newDraft();
  draft.fields = { ...sampleFields };
  return submitDraft(emptyEnvelope(), draft);
};
test('hydration reads without overwriting saved offers; server snapshot is browser independent', () => {
  const storage = new MemoryStorage(),
    data = fixture();
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
  const writes = storage.writes;
  const store = new LocalStore(() => storage);
  assert.equal(store.getServerSnapshot().ready, false);
  store.initialize();
  assert.equal(store.getSnapshot().data.offers[0].id, data.offers[0].id);
  assert.equal(storage.writes, writes);
});
test('mutations re-read latest storage so sequential tabs retain both records', () => {
  const storage = new MemoryStorage(),
    first = new LocalStore(() => storage),
    second = new LocalStore(() => storage);
  first.initialize();
  second.initialize();
  const one = fixture().offers[0],
    two = fixture().offers[0];
  first.mutate((data) => ({ ...data, offers: [...data.offers, one] }));
  second.mutate((data) => ({ ...data, offers: [...data.offers, two] }));
  assert.equal(parseEnvelope(storage.getItem(STORAGE_KEY)).data.offers.length, 2);
  first.refresh();
  assert.equal(first.getSnapshot().data.offers.length, 2);
});
test('reconnecting a local surface re-reads storage even if no listener was mounted', () => {
  const storage = new MemoryStorage(),
    store = new LocalStore(() => storage);
  const unsub = store.subscribe(() => {});
  unsub();
  storage.setItem(STORAGE_KEY, JSON.stringify(fixture()));
  store.subscribe(() => {});
  assert.equal(store.getSnapshot().data.offers.length, 1);
});
test('failed write reports no durable success; temporary mode needs explicit opt-in', () => {
  const storage = new MemoryStorage(),
    store = new LocalStore(() => storage);
  storage.failWrite = true;
  const data = fixture();
  assert.equal(
    store.mutate(() => data),
    false,
  );
  assert.equal(store.getSnapshot().temporary, false);
  assert.equal(store.getSnapshot().data.offers.length, 0);
  assert.match(store.getSnapshot().problem!, /not saved/);
  assert.equal(storage.getItem(STORAGE_KEY), null);
  store.enableTemporary();
  assert.equal(
    store.mutate(() => data),
    true,
  );
  assert.equal(store.getSnapshot().data.offers.length, 1);
  assert.equal(storage.getItem(STORAGE_KEY), null);
  const fresh = new LocalStore(() => storage);
  fresh.initialize();
  assert.equal(fresh.getSnapshot().data.offers.length, 0);
});
test('blocked reads do not crash and unsupported versions stay intact', () => {
  const storage = new MemoryStorage();
  storage.failRead = true;
  const store = new LocalStore(() => storage);
  store.initialize();
  assert.match(store.getSnapshot().problem!, /unavailable/);
  assert.equal(
    store.mutate((data) => data),
    false,
  );
  for (const raw of ['{broken', JSON.stringify({ version: 0 }), JSON.stringify({ version: 2 })]) {
    storage.failRead = false;
    storage.setItem(STORAGE_KEY, raw);
    const instance = new LocalStore(() => storage);
    instance.initialize();
    assert.ok(instance.getSnapshot().problem);
    assert.equal(
      instance.mutate(() => emptyEnvelope()),
      false,
    );
    assert.equal(storage.getItem(STORAGE_KEY), raw);
  }
});
test('partially corrupt envelopes preserve recoverable records and do not auto-write', () => {
  const data = fixture();
  const raw = JSON.stringify({ ...data, offers: [data.offers[0], { id: 'bad' }, data.offers[0]] });
  const parsed = parseEnvelope(raw);
  assert.equal(parsed.data.offers.length, 1);
  assert.ok(parsed.problem);
  const storage = new MemoryStorage();
  storage.setItem(STORAGE_KEY, raw);
  const store = new LocalStore(() => storage);
  assert.equal(
    store.mutate(() => emptyEnvelope()),
    false,
  );
  assert.equal(storage.getItem(STORAGE_KEY), raw);
});
test('scoped reset removes all app versions and preserves unrelated local data', () => {
  const storage = new MemoryStorage();
  storage.setItem('another-app', 'keep');
  storage.setItem('miso-hire-me:demo:v0', 'legacy');
  storage.setItem(STORAGE_KEY, JSON.stringify(fixture()));
  const store = new LocalStore(() => storage);
  assert.equal(store.reset(), true);
  assert.equal(storage.length, 1);
  assert.equal(storage.getItem('another-app'), 'keep');
  assert.equal(store.getSnapshot().data.offers.length, 0);
});
test('legacy keys without current data require deliberate reset and failure is honest', () => {
  const storage = new MemoryStorage();
  storage.setItem('miso-hire-me:demo:v0', 'legacy');
  const store = new LocalStore(() => storage);
  store.initialize();
  assert.match(store.getSnapshot().problem!, /version/);
  assert.equal(
    store.mutate((data) => data),
    false,
  );
  storage.failDelete = true;
  assert.equal(store.reset(), false);
  assert.equal(storage.getItem('miso-hire-me:demo:v0'), 'legacy');
});
