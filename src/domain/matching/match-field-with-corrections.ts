import type { FieldCorrection } from '../corrections/correction-schema';
import type { FieldContext } from '../forms/field-context';
import type { MatchResult } from './match-field';

export type CorrectionAwareMatchResult =
  | MatchResult
  | {
      status: 'ready';
      field: import('./match-field').CanonicalField;
      reason: 'user-correction';
      sensitivity: 'normal';
    }
  | {
      status: 'unknown';
      reason: 'user-ignored';
    };

export function matchFieldWithCorrections(
  _context: FieldContext,
  _corrections: FieldCorrection[],
): CorrectionAwareMatchResult {
  throw new Error('Not implemented');
}
