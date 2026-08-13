import type { FieldContext } from '../../domain/forms/field-context';
import { matchField } from '../../domain/matching/match-field';
import type { BaseProfile } from '../../domain/profile/profile-schema';
import {
  prepareFillPlan,
  type FillPlan,
} from '../prepare-fill/prepare-fill-plan';

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
  fields: FieldContext[],
  profile: BaseProfile,
): PageAnalysis {
  const analysis = fields.map((context) => ({
    context,
    match: matchField(context),
  }));
  const plan = prepareFillPlan(analysis, profile);

  return {
    plan,
    summary: {
      ready: plan.ready.length,
      needsReview: plan.needsReview.length,
      unknown: plan.unknown.length,
      total: fields.length,
    },
  };
}
