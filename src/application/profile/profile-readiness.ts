import type { BaseProfile } from '../../domain/profile/profile-schema';

export type ProfileReadiness = {
  completed: number;
  total: 6;
  percentage: number;
  sections: {
    identity: boolean;
    contact: boolean;
    links: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
  };
};

export function calculateProfileReadiness(
  baseProfile: BaseProfile,
): ProfileReadiness {
  void baseProfile;
  throw new Error('Not implemented');
}
