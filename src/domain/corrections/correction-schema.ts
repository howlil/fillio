import type { CanonicalField } from '../matching/match-field';

export type CorrectionTarget = CanonicalField | 'ignore';

export type FieldCorrection = {
  origin: string;
  formFingerprint: string;
  fieldFingerprint: string;
  target: CorrectionTarget;
  updatedAt: string;
};

export type StoredCorrectionEnvelope = {
  schemaVersion: 1;
  entries: FieldCorrection[];
};

export function createEmptyStoredCorrections(): StoredCorrectionEnvelope {
  throw new Error('Not implemented');
}

export function parseStoredCorrections(
  _value: unknown,
): StoredCorrectionEnvelope {
  throw new Error('Not implemented');
}
