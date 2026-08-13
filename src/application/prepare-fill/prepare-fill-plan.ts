import type { BaseProfile } from '../../domain/profile/profile-schema';
import type { FieldContext } from '../../domain/forms/field-context';
import type {
  CanonicalField,
  MatchResult,
} from '../../domain/matching/match-field';

export type FillValue = string | boolean | string[];

export type FillInstruction = {
  fieldFingerprint: string;
  field: CanonicalField;
  value: FillValue;
  controlKind: FieldContext['controlKind'];
};

export type FillAnalysis = {
  context: FieldContext;
  match: MatchResult;
};

export type FillPlan = {
  ready: FillInstruction[];
  needsReview: FillAnalysis[];
  unknown: FillAnalysis[];
};

export function prepareFillPlan(
  _analysis: FillAnalysis[],
  _profile: BaseProfile,
): FillPlan {
  throw new Error('Not implemented');
}
