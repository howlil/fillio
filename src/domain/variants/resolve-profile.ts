import type {
  ApplicationVariant,
  BaseProfile,
} from '../profile/profile-schema';

export function resolveApplicationProfile(
  baseProfile: BaseProfile,
  variant?: ApplicationVariant,
): BaseProfile {
  void baseProfile;
  void variant;
  throw new Error('Not implemented');
}
