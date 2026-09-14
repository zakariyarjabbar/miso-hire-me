'use client';
import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { disclosure, getService, isServiceId, services } from '@/lib/content';
import {
  fromFields,
  newDraft,
  requiredTerms,
  submitDraft,
  validateOffer,
  type Draft,
  type DraftFields,
  type OfferInput,
} from '@/lib/offers';
import { localStore } from '@/lib/storage';
import { StorageNotice, useLocalStore } from './local-state';
import { Arrow, Photo } from './ui';
import { FormLoading } from './form-loading';

export function OfferSummary({ input }: { input: OfferInput }) {
  return (
    <dl className="summary-list">
      <div>
        <dt>For</dt>
        <dd>{input.displayName}</dd>
      </div>
      <div>
        <dt>My role</dt>
        <dd>{getService(input.serviceId).name}</dd>
      </div>
      <div>
        <dt>Duration</dt>
        <dd>{input.duration} pretend minutes</dd>
      </div>
      <div>
        <dt>The job</dt>
        <dd>{input.job}</dd>
      </div>
      <div>
        <dt>Sunny spot</dt>
        <dd>{input.sunny ? 'Yes, a sunny workspace' : 'No sunny workspace'}</dd>
      </div>
      {input.serviceId === 'box-inspection' && (
        <div>
          <dt>Empty box</dt>
          <dd>{input.keepBox ? 'I may keep it' : 'I must return it'}</dd>
        </div>
      )}
      <div>
        <dt>Compensation</dt>
        <dd>{input.treats} imaginary treats</dd>
      </div>
    </dl>
  );
}
export function OfferBuilder() {
  const state = useLocalStore();
  const search = useSearchParams();
  if (!state.ready) return <FormLoading />;
  const queryService = search.get('service');
  const initial =
    state.data.draft || newDraft(isServiceId(queryService) ? queryService : undefined);
  const chosen =
    isServiceId(queryService) && initial.prefillService !== queryService
      ? {
          ...initial,
          prefillService: queryService,
          fields: { ...initial.fields, serviceId: queryService },
        }
      : initial;
  return <Form key={search.toString()} initial={chosen} />;
}
function Form({ initial }: { initial: Draft }) {
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof OfferInput, string>>>({});
  const [failure, setFailure] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const title = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const lock = useRef(false);
  const state = useLocalStore();
  const fields = draft.fields;
  const service = getService(fields.serviceId);
  const needed = requiredTerms(fields);
  function update(patch: Partial<DraftFields>) {
    const next = { ...draft, fields: { ...fields, ...patch }, updatedAt: new Date().toISOString() };
    setDraft(next);
    setFailure('');
    localStore.mutate((data) => ({ ...data, draft: next }));
  }
  function changeStep(step: 1 | 2 | 3) {
    const next = { ...draft, step, updatedAt: new Date().toISOString() };
    setDraft(next);
    localStore.mutate((data) => ({ ...data, draft: next }));
    setErrors({});
    requestAnimationFrame(() => title.current?.focus());
  }
  function next() {
    const found = validateOffer(fromFields(fields));
    const relevant =
      draft.step === 1
        ? Object.fromEntries(Object.entries(found).filter(([key]) => key !== 'treats'))
        : found;
    setErrors(relevant);
    if (Object.keys(relevant).length) {
      requestAnimationFrame(() =>
        form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    changeStep(draft.step === 1 ? 2 : 3);
  }
  function send() {
    if (lock.current) return;
    const found = validateOffer(fromFields(fields));
    setErrors(found);
    if (Object.keys(found).length) {
      setFailure('Please go back and correct the highlighted fields.');
      return;
    }
    lock.current = true;
    setBusy(true);
    setFailure('');
    try {
      const saved = localStore.mutate((data) => submitDraft(data, draft));
      if (saved) {
        router.push(`/offer/?ref=${encodeURIComponent(draft.id)}`);
        return;
      }
      setFailure(
        'Your offer has not been sent or saved. Resolve storage above, or choose the temporary-session option and send again.',
      );
    } catch (error) {
      setFailure(
        error instanceof Error ? error.message : 'Your offer could not be saved. Please try again.',
      );
    }
    lock.current = false;
    setBusy(false);
  }
  return (
    <div className="wrap">
      <StorageNotice />
      <div className="offer-layout">
        <form
          ref={form}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.step === 3) send();
            else next();
          }}
        >
          <ol className="steps" aria-label="Offer progress">
            {['The role', 'The treats', 'The review'].map((label, i) => (
              <li key={label} aria-current={draft.step === i + 1 ? 'step' : undefined}>
                <span>{i + 1}</span>
                {label}
              </li>
            ))}
          </ol>
          <h2 className="form-title" ref={title} tabIndex={-1}>
            {draft.step === 1
              ? 'What did you have in mind?'
              : draft.step === 2
                ? 'Let’s talk imaginary treats.'
                : 'A quick look before I look.'}
          </h2>
          {draft.step === 1 && (
            <>
              <fieldset className="choice-field">
                <legend>Choose my service</legend>
                <div className="service-choices">
                  {services.map((s) => (
                    <label className="radio-choice" key={s.id}>
                      <input
                        type="radio"
                        name="service"
                        value={s.id}
                        checked={fields.serviceId === s.id}
                        onChange={() => update({ serviceId: s.id })}
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="field">
                <label htmlFor="duration">Pretend engagement length</label>
                <select
                  id="duration"
                  value={fields.duration}
                  onChange={(e) =>
                    update({ duration: Number(e.target.value) as DraftFields['duration'] })
                  }
                >
                  <option value="15">15 minutes · a focused appearance</option>
                  <option value="30">30 minutes · room to settle in</option>
                  <option value="60">60 minutes · basically a career</option>
                </select>
              </div>
              <button
                type="button"
                className="sample-action"
                onClick={() =>
                  update({
                    displayName: 'The Sunny Desk Studio',
                    job: `Please help with ${service.name.toLowerCase()}. Your professional presence would be appreciated.`,
                  })
                }
              >
                Use sample details
              </button>
              <div className="field">
                <label htmlFor="displayName">Your friendly name or company nickname</label>
                <input
                  id="displayName"
                  autoComplete="off"
                  maxLength={60}
                  value={fields.displayName}
                  onChange={(e) => update({ displayName: e.target.value })}
                  aria-invalid={!!errors.displayName}
                  aria-describedby={errors.displayName ? 'name-error' : 'name-help'}
                  placeholder="e.g. The Sunny Desk Studio"
                />
                <span id="name-help">A nickname is enough. No real contact details needed.</span>
                {errors.displayName && (
                  <span id="name-error" className="error">
                    {errors.displayName}
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor="job">What is the job?</label>
                <textarea
                  id="job"
                  maxLength={240}
                  value={fields.job}
                  onChange={(e) => update({ job: e.target.value })}
                  aria-invalid={!!errors.job}
                  aria-describedby={errors.job ? 'job-error' : 'job-help'}
                  placeholder="Tell me what needs my considerable attention."
                />
                <span id="job-help">{fields.job.length}/240 characters · plain text only</span>
                {errors.job && (
                  <span className="error" id="job-error">
                    {errors.job}
                  </span>
                )}
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={fields.sunny}
                  onChange={(e) => update({ sunny: e.target.checked })}
                />
                <span>
                  A sunny workspace
                  <small>One imaginary treat off. I respect a good benefits package.</small>
                </span>
              </label>
              {fields.serviceId === 'box-inspection' && (
                <fieldset className="choice-field">
                  <legend>May I keep the empty cardboard box?</legend>
                  <div className="service-choices">
                    <label className="radio-choice">
                      <input
                        type="radio"
                        name="box"
                        checked={fields.keepBox}
                        onChange={() => update({ keepBox: true })}
                      />
                      Yes, it’s yours
                    </label>
                    <label className="radio-choice">
                      <input
                        type="radio"
                        name="box"
                        checked={!fields.keepBox}
                        onChange={() => update({ keepBox: false })}
                      />
                      No, please return it
                    </label>
                  </div>
                  <p className="fine-note">
                    I require the empty box for this role. You can still propose different terms and
                    see my response.
                  </p>
                </fieldset>
              )}
            </>
          )}
          {draft.step === 2 && (
            <>
              <p>My fee starts with the role and adjusts for your pretend conditions.</p>
              <dl className="fee-list">
                <div>
                  <dt>{service.name}</dt>
                  <dd>{service.baseFee} treats</dd>
                </div>
                <div>
                  <dt>{fields.duration} minutes</dt>
                  <dd>+ {fields.duration === 15 ? 0 : fields.duration === 30 ? 2 : 4}</dd>
                </div>
                <div>
                  <dt>Sunny workspace</dt>
                  <dd>{fields.sunny ? '− 1' : 'No discount'}</dd>
                </div>
                <div>
                  <dt>My requested minimum</dt>
                  <dd>{needed.treats} imaginary treats</dd>
                </div>
              </dl>
              <div className="field">
                <label htmlFor="treats">Your offer in imaginary treats</label>
                <input
                  type="number"
                  id="treats"
                  inputMode="numeric"
                  min="0"
                  max="50"
                  step="1"
                  value={fields.treats}
                  onChange={(e) => update({ treats: e.target.value.slice(0, 10) })}
                  aria-invalid={!!errors.treats}
                  aria-describedby={errors.treats ? 'treats-error' : 'treats-help'}
                />
                <span id="treats-help">
                  A whole number from 0 to 50. These are game points, not money or feeding
                  quantities.
                </span>
                {errors.treats && (
                  <span className="error" id="treats-error">
                    {errors.treats}
                  </span>
                )}
              </div>
              <p className="fine-note">
                A lower offer is welcome. I have prepared a very professional counteroffer.
              </p>
            </>
          )}
          {draft.step === 3 && (
            <>
              <OfferSummary input={fromFields(fields)} />
              <div className="review-disclosure">
                <strong>{disclosure}</strong>“Send demo offer” runs a scripted fictional response
                here. It does not send a message, book an animal, create a contract, or take
                payment.
              </div>
            </>
          )}
          {failure && (
            <p className="error" role="alert">
              {failure}
            </p>
          )}
          <div className="form-actions">
            {draft.step > 1 && (
              <button
                type="button"
                className="button"
                disabled={busy}
                onClick={() => changeStep(draft.step === 3 ? 2 : 1)}
              >
                Back
              </button>
            )}
            <button type="submit" className="button primary" disabled={busy}>
              {busy ? 'Saving offer…' : draft.step === 3 ? 'Send demo offer' : 'Continue'}
              <Arrow />
            </button>
          </div>
          <p className="local-label" role="status">
            {state.temporary
              ? 'Temporary session: refreshing will remove these changes.'
              : state.problem
                ? 'Your latest changes are not saved.'
                : state.data.draft?.id === draft.id
                  ? 'Draft saved in this browser.'
                  : 'Your draft will save as you fill it in.'}
          </p>
        </form>
        <aside className="offer-aside">
          <Photo name={service.image} />
          <h2>{service.short}</h2>
          <p>{service.description}</p>
          <p className="aside-note">
            I’m an independent professional. My negotiation style is sitting very still until
            something changes.
          </p>
          <p className="aside-note">
            Fictional cat. Local demo.
            <br />
            No real bookings or payments.
          </p>
        </aside>
      </div>
    </div>
  );
}
