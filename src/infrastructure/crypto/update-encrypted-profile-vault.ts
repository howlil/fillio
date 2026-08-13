import type { SensitiveProfile } from '../../domain/profile/profile-schema';
import type { StoredVaultEnvelope } from '../../domain/vault/vault-envelope';
import { updateVaultEnvelope } from './update-vault-envelope';
import { encodeVaultProfile } from './vault-profile-codec';

export function updateEncryptedProfileVault(
  profile: SensitiveProfile,
  envelope: StoredVaultEnvelope,
  key: CryptoKey,
  now?: string,
): Promise<StoredVaultEnvelope> {
  return updateVaultEnvelope(encodeVaultProfile(profile), envelope, key, now);
}
