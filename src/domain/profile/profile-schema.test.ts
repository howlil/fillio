import { describe, expect, it } from 'vitest';

import { createEmptyStoredProfile } from './create-empty-profile';
import {
  UnsupportedProfileSchemaVersionError,
  parseStoredProfile,
} from './migrations';

describe('canonical profile v1', () => {
  it('creates and parses an empty v1 profile with repeated career entities as arrays', () => {
    const profile = createEmptyStoredProfile();

    const parsed = parseStoredProfile(profile);

    expect(parsed).toEqual(profile);
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.baseProfile.professional.experiences).toEqual([]);
    expect(parsed.baseProfile.professional.education).toEqual([]);
    expect(parsed.baseProfile.professional.skills).toEqual([]);
    expect(parsed.variants).toEqual([]);
  });

  it('does not persist sensitive profile values in the normal v1 envelope', () => {
    const profile = createEmptyStoredProfile();

    expect(profile).not.toHaveProperty('sensitiveProfile');
    expect(profile.baseProfile).not.toHaveProperty('identity');
    expect(profile.baseProfile).not.toHaveProperty('compensation');
    expect(profile.baseProfile).not.toHaveProperty('demographic');
  });

  it('rejects malformed persisted data instead of accepting a type cast', () => {
    expect(() =>
      parseStoredProfile({
        schemaVersion: 1,
        baseProfile: {},
        variants: [],
        preferences: {},
        metadata: {},
      }),
    ).toThrow();
  });

  it('rejects unsupported future schema versions explicitly', () => {
    expect(() =>
      parseStoredProfile({
        schemaVersion: 2,
      }),
    ).toThrow(UnsupportedProfileSchemaVersionError);
  });
});
