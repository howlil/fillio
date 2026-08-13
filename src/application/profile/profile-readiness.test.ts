import { describe, expect, it } from 'vitest';

import { createEmptyStoredProfile } from '../../domain/profile/create-empty-profile';
import { calculateProfileReadiness } from './profile-readiness';

describe('calculateProfileReadiness', () => {
  it('reports an empty profile as 0 of 6 sections ready', () => {
    const profile = createEmptyStoredProfile('2026-08-13T00:00:00.000Z');

    expect(calculateProfileReadiness(profile.baseProfile)).toEqual({
      completed: 0,
      total: 6,
      percentage: 0,
      sections: {
        identity: false,
        contact: false,
        links: false,
        experience: false,
        education: false,
        skills: false,
      },
    });
  });

  it('counts only useful completed sections', () => {
    const profile = createEmptyStoredProfile('2026-08-13T00:00:00.000Z');
    const base = profile.baseProfile;

    base.personal.legalName.first = 'Ulil';
    base.personal.legalName.last = 'Abshar';
    base.contact.emails.push({
      id: 'email-primary',
      label: 'Primary',
      value: 'ulil@example.com',
      primary: true,
    });
    base.professional.skills.push({
      id: 'skill-ts',
      name: 'TypeScript',
      level: '',
      yearsExperience: null,
    });

    expect(calculateProfileReadiness(base)).toMatchObject({
      completed: 3,
      total: 6,
      percentage: 50,
      sections: {
        identity: true,
        contact: true,
        links: false,
        experience: false,
        education: false,
        skills: true,
      },
    });
  });

  it('reports 100 percent when all readiness sections have useful data', () => {
    const profile = createEmptyStoredProfile('2026-08-13T00:00:00.000Z');
    const base = profile.baseProfile;

    base.personal.legalName.first = 'Ulil';
    base.personal.legalName.last = 'Abshar';
    base.contact.whatsapp = '+628123456789';
    base.links.github = 'https://github.com/howlil';
    base.professional.experiences.push({
      id: 'experience-1',
      company: 'Example Co',
      title: 'Software Engineer',
      employmentType: '',
      location: '',
      startDate: '',
      endDate: '',
      current: true,
      description: '',
      achievements: [],
    });
    base.professional.education.push({
      id: 'education-1',
      institution: 'Universitas Andalas',
      degree: 'Bachelor',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: null,
      maxGpa: null,
      description: '',
    });
    base.professional.skills.push({
      id: 'skill-1',
      name: 'TypeScript',
      level: '',
      yearsExperience: null,
    });

    expect(calculateProfileReadiness(base).percentage).toBe(100);
  });
});
