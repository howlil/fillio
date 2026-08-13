import type { StoredProfileEnvelope } from './profile-schema';

export function createEmptyStoredProfile(
  now = new Date().toISOString(),
): StoredProfileEnvelope {
  return {
    schemaVersion: 1,
    baseProfile: {
      personal: {
        legalName: {
          first: '',
          middle: '',
          last: '',
        },
        preferredName: '',
      },
      contact: {
        emails: [],
        phones: [],
        whatsapp: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
        },
      },
      links: {
        linkedin: '',
        github: '',
        portfolio: '',
        websites: [],
        otherProfiles: [],
      },
      professional: {
        headline: '',
        summary: '',
        experiences: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        projects: [],
        awards: [],
        organizations: [],
        volunteering: [],
        publications: [],
      },
      jobPreferences: {
        desiredRoles: [],
        employmentTypes: [],
        workArrangements: [],
        preferredLocations: [],
        willingToRelocate: null,
        willingToTravel: null,
        availabilityDate: '',
        noticePeriod: '',
      },
      documents: {
        resumes: [],
        coverLetters: [],
        transcripts: [],
        certificates: [],
        photo: null,
        other: [],
      },
      customAnswers: [],
    },
    variants: [],
    preferences: {
      defaultVariantId: null,
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
    },
  };
}
