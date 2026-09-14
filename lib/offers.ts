import { getService, isServiceId, type ServiceId } from './content';
export type Duration = 15 | 30 | 60;
export type OfferInput = {
  serviceId: ServiceId;
  duration: Duration;
  displayName: string;
  job: string;
  sunny: boolean;
  keepBox: boolean;
  treats: number;
};
export type RequiredTerms = { treats: number; keepBox: boolean };
export type OfferStatus = 'counteroffer' | 'accepted' | 'withdrawn';
export type OfferEvent = { type: 'submitted' | 'revised' | 'accepted' | 'withdrawn'; at: string };
export type OfferRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  originalOffer: OfferInput;
  currentOffer: OfferInput;
  requiredTerms: RequiredTerms;
  response: string;
  acceptedTerms?: OfferInput;
  status: OfferStatus;
  events: OfferEvent[];
};
export type DraftFields = Omit<OfferInput, 'treats'> & { treats: string };
export type Draft = {
  id: string;
  status: 'draft';
  createdAt: string;
  updatedAt: string;
  step: 1 | 2 | 3;
  fields: DraftFields;
  editingRef?: string;
  prefillService?: ServiceId;
};
export type Envelope = {
  version: 1;
  draft: Draft | null;
  offers: OfferRecord[];
  preferences: { awake: boolean };
};
export function emptyEnvelope(): Envelope {
  return { version: 1, draft: null, offers: [], preferences: { awake: false } };
}
export function newDraft(serviceId: ServiceId = 'box-inspection'): Draft {
  const now = new Date().toISOString();
  return {
    id: `MISO-${crypto.randomUUID()}`,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    step: 1,
    fields: {
      serviceId,
      duration: 15,
      displayName: '',
      job: '',
      sunny: false,
      keepBox: true,
      treats: String(getService(serviceId).baseFee),
    },
  };
}
export const sampleFields: DraftFields = {
  serviceId: 'box-inspection',
  duration: 30,
  displayName: 'The Sunny Desk Studio',
  job: 'Please inspect the new delivery box. A thorough sit test is encouraged.',
  sunny: true,
  keepBox: false,
  treats: '2',
};
export function validateOffer(value: OfferInput): Partial<Record<keyof OfferInput, string>> {
  const errors: Partial<Record<keyof OfferInput, string>> = {};
  if (!isServiceId(value.serviceId)) errors.serviceId = 'Choose one of my four services.';
  if (![15, 30, 60].includes(value.duration)) errors.duration = 'Choose 15, 30, or 60 minutes.';
  if (
    typeof value.displayName !== 'string' ||
    !value.displayName.trim() ||
    value.displayName.length > 60
  )
    errors.displayName = 'Enter a friendly name of 1–60 characters.';
  if (typeof value.job !== 'string' || !value.job.trim() || value.job.length > 240)
    errors.job = 'Describe the job in 1–240 characters.';
  if (!Number.isInteger(value.treats) || value.treats < 0 || value.treats > 50)
    errors.treats = 'Enter a whole number from 0 to 50.';
  if (typeof value.sunny !== 'boolean') errors.sunny = 'Choose whether there is a sunny workspace.';
  if (typeof value.keepBox !== 'boolean')
    errors.keepBox = 'Choose whether I may keep the empty box.';
  return errors;
}
export function fromFields(fields: DraftFields): OfferInput {
  return {
    ...fields,
    displayName: fields.displayName.trim(),
    job: fields.job.trim(),
    treats: fields.treats.trim() === '' ? NaN : Number(fields.treats),
  };
}
export function requiredTerms(
  input: Pick<OfferInput, 'serviceId' | 'duration' | 'sunny'>,
): RequiredTerms {
  if (
    !isServiceId(input.serviceId) ||
    ![15, 30, 60].includes(input.duration) ||
    typeof input.sunny !== 'boolean'
  )
    throw new Error('Invalid offer conditions.');
  return {
    treats: Math.max(
      1,
      getService(input.serviceId).baseFee +
        { 15: 0, 30: 2, 60: 4 }[input.duration] -
        (input.sunny ? 1 : 0),
    ),
    keepBox: input.serviceId === 'box-inspection',
  };
}
export function evaluateOffer(input: OfferInput) {
  if (Object.keys(validateOffer(input)).length) throw new Error('Please correct the offer fields.');
  const required = requiredTerms(input);
  const missing: string[] = [];
  if (input.treats < required.treats)
    missing.push(`Increase imaginary treats from ${input.treats} to ${required.treats}.`);
  if (required.keepBox && !input.keepBox) missing.push('Let me keep the empty cardboard box.');
  const accepted = missing.length === 0;
  const response = accepted
    ? 'I accept. Please consider this my enthusiastic agreement to arrive, settle in, and take up more space than expected.'
    : 'The role sounds promising. I have a small but extremely firm revision to the terms.';
  return { required, missing, accepted, response };
}
export function submitDraft(
  data: Envelope,
  draft: Draft,
  now = new Date().toISOString(),
): Envelope {
  const input = fromFields(draft.fields);
  const decision = evaluateOffer(input);
  const existing = data.offers.find((o) => o.id === draft.id);
  const unchanged =
    existing &&
    (Object.keys(input) as (keyof OfferInput)[]).every(
      (key) => existing.currentOffer[key] === input[key],
    );
  // A retry is idempotent. Only an explicit edit may revise a counteroffer.
  if (existing && (!draft.editingRef || existing.status !== 'counteroffer' || unchanged))
    return { ...data, draft: data.draft?.id === draft.id ? null : data.draft };
  const record: OfferRecord = {
    id: draft.id,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    originalOffer: existing?.originalOffer || { ...input },
    currentOffer: { ...input },
    requiredTerms: decision.required,
    response: decision.response,
    status: decision.accepted ? 'accepted' : 'counteroffer',
    ...(decision.accepted ? { acceptedTerms: { ...input } } : {}),
    events: [...(existing?.events || []), { type: existing ? 'revised' : 'submitted', at: now }],
  };
  return {
    ...data,
    draft: data.draft?.id === draft.id ? null : data.draft,
    offers: [record, ...data.offers.filter((o) => o.id !== record.id)],
  };
}
export function acceptOffer(data: Envelope, id: string, now = new Date().toISOString()): Envelope {
  return {
    ...data,
    offers: data.offers.map((o) => {
      if (o.id !== id || o.status !== 'counteroffer') return o;
      const required = requiredTerms(o.currentOffer);
      const acceptedTerms = {
        ...o.currentOffer,
        treats: Math.max(o.currentOffer.treats, required.treats),
        keepBox: required.keepBox || o.currentOffer.keepBox,
      };
      return {
        ...o,
        updatedAt: now,
        status: 'accepted',
        acceptedTerms,
        response: 'We have an agreement. I have cleared a highly valuable space between two naps.',
        events: [...o.events, { type: 'accepted', at: now }],
      };
    }),
    draft: data.draft?.id === id ? null : data.draft,
  };
}
export function withdrawOffer(
  data: Envelope,
  id: string,
  now = new Date().toISOString(),
): Envelope {
  return {
    ...data,
    offers: data.offers.map((o) =>
      o.id === id && o.status !== 'withdrawn'
        ? {
            ...o,
            status: 'withdrawn',
            updatedAt: now,
            events: [...o.events, { type: 'withdrawn', at: now }],
          }
        : o,
    ),
    draft: data.draft?.id === id ? null : data.draft,
  };
}
export function draftFromOffer(offer: OfferRecord): Draft {
  return {
    id: offer.id,
    status: 'draft',
    createdAt: offer.createdAt,
    updatedAt: new Date().toISOString(),
    step: 1,
    fields: { ...offer.currentOffer, treats: String(offer.currentOffer.treats) },
    editingRef: offer.id,
  };
}
