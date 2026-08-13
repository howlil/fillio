import type { FieldContext } from '../forms/field-context';

export type CanonicalField =
  | 'personal.legalName.first'
  | 'personal.legalName.middle'
  | 'personal.legalName.last'
  | 'personal.preferredName'
  | 'contact.email.primary'
  | 'contact.phone.primary'
  | 'contact.whatsapp'
  | 'contact.address.city'
  | 'contact.address.state'
  | 'contact.address.country'
  | 'contact.address.postalCode'
  | 'links.linkedin'
  | 'links.github'
  | 'links.portfolio'
  | 'professional.headline'
  | 'jobPreferences.willingToRelocate'
  | 'jobPreferences.willingToTravel'
  | 'jobPreferences.availabilityDate';

export type CandidateMatch = {
  field: CanonicalField;
  score: number;
};

export type MatchResult =
  | {
      status: 'ready';
      field: CanonicalField;
      reason: 'exact-alias' | 'structured-heuristic';
      sensitivity: 'normal';
    }
  | {
      status: 'review';
      candidates: CandidateMatch[];
      reason: 'ambiguous-heuristic';
      sensitivity: 'normal';
    }
  | {
      status: 'unknown';
      reason: 'file-input' | 'sensitive-field' | 'no-match';
    };

export function matchField(_context: FieldContext): MatchResult {
  throw new Error('Not implemented');
}
