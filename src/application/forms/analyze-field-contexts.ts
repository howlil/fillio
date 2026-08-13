import type { FieldContext } from '../../domain/forms/field-context';
import type { BaseProfile } from '../../domain/profile/profile-schema';
import type { FillPlan } from '../prepare-fill/prepare-fill-plan';

export type PageAnalysisSummary = {
  ready: number;
  needsReview: number;
  unknown: number;
  total: number;
};

export type PageAnalysis = {
  plan: FillPlan;
  summary: PageAnalysisSummary;
};

export function analyzeFieldContexts(
  _fields: FieldContext[],
  _profile: BaseProfile,
): PageAnalysis {
  throw new Error('Not implemented');
}
