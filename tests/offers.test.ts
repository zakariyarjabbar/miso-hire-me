import test from 'node:test';
import assert from 'node:assert/strict';
import { services } from '../lib/content';
import {
  acceptOffer,
  draftFromOffer,
  emptyEnvelope,
  evaluateOffer,
  fromFields,
  newDraft,
  requiredTerms,
  submitDraft,
  validateOffer,
  withdrawOffer,
  type Duration,
  type Envelope,
  type OfferInput,
} from '../lib/offers';
const base: OfferInput = {
  serviceId: 'box-inspection',
  duration: 15,
  displayName: 'Desk Studio',
  job: 'Inspect a box.',
  sunny: false,
  keepBox: true,
  treats: 3,
};
test('all four services, three durations, and sunshine use the specified fee formula', () => {
  for (const service of services)
    for (const duration of [15, 30, 60] as Duration[])
      for (const sunny of [false, true]) {
        const terms = requiredTerms({ serviceId: service.id, duration, sunny });
        assert.equal(
          terms.treats,
          Math.max(1, service.baseFee + { 15: 0, 30: 2, 60: 4 }[duration] - (sunny ? 1 : 0)),
        );
        assert.equal(terms.keepBox, service.id === 'box-inspection');
      }
});
test('counteroffer names each missing term and exact correction', () => {
  const decision = evaluateOffer({ ...base, duration: 30, sunny: true, treats: 2, keepBox: false });
  assert.equal(decision.accepted, false);
  assert.deepEqual(decision.required, { treats: 4, keepBox: true });
  assert.deepEqual(decision.missing, [
    'Increase imaginary treats from 2 to 4.',
    'Let me keep the empty cardboard box.',
  ]);
  assert.equal(evaluateOffer({ ...base, duration: 30, sunny: true, treats: 4 }).accepted, true);
  assert.equal(evaluateOffer({ ...base, treats: 50, keepBox: false }).accepted, false);
});
test('strict input boundaries reject invalid and missing values', () => {
  for (const treats of [-1, 51, 1.2, NaN, Infinity])
    assert.ok(validateOffer({ ...base, treats }).treats);
  for (const displayName of ['', ' '.repeat(4), 'x'.repeat(61)])
    assert.ok(validateOffer({ ...base, displayName }).displayName);
  assert.ok(validateOffer({ ...base, job: 'x'.repeat(241) }).job);
  assert.ok(validateOffer({ ...base, job: '' }).job);
  assert.ok(
    validateOffer({ ...base, serviceId: 'cat-agency' as OfferInput['serviceId'] }).serviceId,
  );
  assert.ok(validateOffer({ ...base, duration: 20 as Duration }).duration);
  assert.ok(validateOffer({ ...base, sunny: 'yes' as unknown as boolean }).sunny);
  assert.ok(Number.isNaN(fromFields({ ...newDraft().fields, treats: '' }).treats));
  assert.deepEqual(
    validateOffer({ ...base, treats: 0, displayName: 'x'.repeat(60), job: 'x'.repeat(240) }),
    {},
  );
});
test('submit, retry, explicit counterterm acceptance and withdrawal preserve stable history', () => {
  const draft = newDraft();
  draft.fields = { ...base, treats: '1', keepBox: false };
  let data: Envelope = { ...emptyEnvelope(), draft };
  data = submitDraft(data, draft, '2026-09-11T10:00:00.000Z');
  assert.equal(data.offers.length, 1);
  assert.equal(data.draft, null);
  assert.equal(data.offers[0].status, 'counteroffer');
  data = submitDraft(data, draft);
  assert.equal(data.offers.length, 1);
  assert.equal(data.offers[0].events.length, 1);
  const original = data.offers[0].originalOffer;
  data = acceptOffer(data, draft.id, '2026-09-11T10:01:00.000Z');
  assert.equal(data.offers[0].status, 'accepted');
  assert.equal(data.offers[0].acceptedTerms?.treats, 3);
  assert.equal(data.offers[0].acceptedTerms?.keepBox, true);
  assert.deepEqual(data.offers[0].originalOffer, original);
  assert.equal(acceptOffer(data, draft.id).offers[0].events.length, 2);
  data = withdrawOffer(data, draft.id, '2026-09-11T10:02:00.000Z');
  assert.equal(data.offers[0].status, 'withdrawn');
  assert.equal(data.offers[0].events.length, 3);
  assert.equal(acceptOffer(data, draft.id).offers[0].status, 'withdrawn');
  assert.equal(withdrawOffer(data, draft.id).offers[0].events.length, 3);
});
test('editing a counteroffer changes the same record and preserves the original proposal', () => {
  const first = newDraft();
  first.fields = { ...base, treats: '1' };
  const original = submitDraft(emptyEnvelope(), first);
  const edit = draftFromOffer(original.offers[0]);
  edit.fields.treats = '10';
  const result = submitDraft({ ...original, draft: edit }, edit);
  assert.equal(result.offers.length, 1);
  assert.equal(result.offers[0].id, first.id);
  assert.equal(result.offers[0].status, 'accepted');
  assert.equal(result.offers[0].originalOffer.treats, 1);
  assert.equal(result.offers[0].acceptedTerms?.treats, 10);
  assert.deepEqual(
    result.offers[0].events.map((e) => e.type),
    ['submitted', 'revised'],
  );
});
test('keeping the box counterterm never lowers a generous original amount', () => {
  const draft = newDraft();
  draft.fields = { ...base, treats: '50', keepBox: false };
  const result = acceptOffer(submitDraft(emptyEnvelope(), draft), draft.id);
  assert.equal(result.offers[0].acceptedTerms?.treats, 50);
});
test('retrying an edited counteroffer does not add duplicate revision events', () => {
  const first = newDraft();
  first.fields = { ...base, treats: '0' };
  const submitted = submitDraft(emptyEnvelope(), first);
  const edit = draftFromOffer(submitted.offers[0]);
  edit.fields.treats = '1';
  const revised = submitDraft({ ...submitted, draft: edit }, edit);
  assert.equal(revised.offers[0].status, 'counteroffer');
  assert.equal(revised.offers[0].events.length, 2);
  const retried = submitDraft({ ...revised, draft: edit }, edit);
  assert.deepEqual(retried.offers, revised.offers);
  assert.equal(retried.draft, null);
});
