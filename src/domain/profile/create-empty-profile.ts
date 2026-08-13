import type { StoredProfileEnvelope } from './profile-schema';

export function createEmptyStoredProfile(): StoredProfileEnvelope {
  return {
    schemaVersion: 1,
    baseProfile: {
      personal: {
        legalName: { first: '', middle: '', last: '' },
        preferredName: '',
      },
      professional: {
        experiences: [],
        education: [],
        skills: [],
      },
    },
    variants: [],
    preferences: {},
    metadata: {
      createdAt: '',
      updatedAt: '',
    },
  };
}
