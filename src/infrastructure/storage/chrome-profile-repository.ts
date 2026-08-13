import type { ProfileRepository } from '../../application/profile/profile-repository';
import type { StoredProfileEnvelope } from '../../domain/profile/profile-schema';

export const PROFILE_STORAGE_KEY = 'fillio.profile';

export class ChromeProfileRepository implements ProfileRepository {
  async load(): Promise<StoredProfileEnvelope | null> {
    throw new Error('Not implemented');
  }

  async save(profile: StoredProfileEnvelope): Promise<void> {
    void profile;
    throw new Error('Not implemented');
  }
}
