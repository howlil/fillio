import { describe, expect, it } from 'vitest';

import { createEmptyStoredProfile } from '../profile/create-empty-profile';
import type { ApplicationVariant } from '../profile/profile-schema';
import { resolveApplicationProfile } from './resolve-profile';

describe('resolveApplicationProfile', () => {
  it('applies variant overrides without mutating factual base-profile data', () => {
    const stored = createEmptyStoredProfile('2026-08-13T00:00:00.000Z');
    const base = stored.baseProfile;

    base.personal.legalName.first = 'Ulil';
    base.contact.emails = [
      {
        id: 'email-primary',
        label: 'Primary',
        value: 'ulil@example.com',
        primary: true,
      },
    ];
    base.professional.headline = 'Software Engineer';
    base.professional.summary = 'General software engineer';
    base.professional.experiences = [
      {
        id: 'experience-1',
        company: 'Example Co',
        title: 'Software Engineer',
        employmentType: 'full-time',
        location: 'Padang',
        startDate: '2025-01',
        endDate: '',
        current: true,
        description: 'Builds web systems',
        achievements: [],
      },
    ];
    base.jobPreferences.preferredLocations = ['Padang'];
    base.jobPreferences.workArrangements = ['onsite'];

    const variant: ApplicationVariant = {
      id: 'backend',
      name: 'Backend Engineer',
      targetRoles: ['Backend Engineer'],
      headlineOverride: 'Backend Software Engineer',
      summaryOverride: 'Backend-focused engineer',
      preferredLocations: ['Jakarta'],
      workArrangements: ['hybrid'],
    };

    const resolved = resolveApplicationProfile(base, variant);

    expect(resolved.personal).toEqual(base.personal);
    expect(resolved.contact).toEqual(base.contact);
    expect(resolved.professional.experiences).toEqual(
      base.professional.experiences,
    );
    expect(resolved.professional.headline).toBe('Backend Software Engineer');
    expect(resolved.professional.summary).toBe('Backend-focused engineer');
    expect(resolved.jobPreferences.desiredRoles).toEqual(['Backend Engineer']);
    expect(resolved.jobPreferences.preferredLocations).toEqual(['Jakarta']);
    expect(resolved.jobPreferences.workArrangements).toEqual(['hybrid']);

    expect(base.professional.headline).toBe('Software Engineer');
    expect(base.jobPreferences.preferredLocations).toEqual(['Padang']);
  });

  it('returns an equivalent independent profile when no variant is selected', () => {
    const base = createEmptyStoredProfile('2026-08-13T00:00:00.000Z').baseProfile;

    const resolved = resolveApplicationProfile(base);

    expect(resolved).toEqual(base);
    expect(resolved).not.toBe(base);
    expect(resolved.professional).not.toBe(base.professional);
  });
});
