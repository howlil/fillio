import type {
  ApplicationVariant,
  BaseProfile,
} from '../profile/profile-schema';

export function resolveApplicationProfile(
  baseProfile: BaseProfile,
  variant?: ApplicationVariant,
): BaseProfile {
  const resolved = structuredClone(baseProfile);

  if (variant === undefined) {
    return resolved;
  }

  if (variant.headlineOverride !== undefined) {
    resolved.professional.headline = variant.headlineOverride;
  }

  if (variant.summaryOverride !== undefined) {
    resolved.professional.summary = variant.summaryOverride;
  }

  if (variant.targetRoles.length > 0) {
    resolved.jobPreferences.desiredRoles = [...variant.targetRoles];
  }

  if (variant.preferredLocations !== undefined) {
    resolved.jobPreferences.preferredLocations = [
      ...variant.preferredLocations,
    ];
  }

  if (variant.employmentTypes !== undefined) {
    resolved.jobPreferences.employmentTypes = [...variant.employmentTypes];
  }

  if (variant.workArrangements !== undefined) {
    resolved.jobPreferences.workArrangements = [...variant.workArrangements];
  }

  if (variant.customAnswers !== undefined) {
    resolved.customAnswers = structuredClone(variant.customAnswers);
  }

  return resolved;
}
