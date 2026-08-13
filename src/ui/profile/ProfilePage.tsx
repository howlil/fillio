import type { ProfileRepository } from '../../application/profile/profile-repository';

type ProfilePageProps = {
  repository: ProfileRepository;
};

export function ProfilePage({ repository }: ProfilePageProps) {
  void repository;
  throw new Error('Not implemented');
}
