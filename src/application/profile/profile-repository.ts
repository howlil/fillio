import type { StoredProfileEnvelope } from '../../domain/profile/profile-schema';

export interface ProfileRepository {
  load(): Promise<StoredProfileEnvelope | null>;
  save(profile: StoredProfileEnvelope): Promise<void>;
}
