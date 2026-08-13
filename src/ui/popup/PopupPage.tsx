import type { ProfileRepository } from '../../application/profile/profile-repository';

type PopupPageProps = {
  repository: ProfileRepository;
  openOptions: () => void | Promise<void>;
};

export function PopupPage({ repository, openOptions }: PopupPageProps) {
  void repository;
  void openOptions;
  throw new Error('Not implemented');
}
