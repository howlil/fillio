import type { SensitiveProfile } from '../../domain/profile/profile-schema';
import type { StoredVaultEnvelope } from '../../domain/vault/vault-envelope';
import { createEncryptedProfileVault } from './create-encrypted-profile-vault';
import { updateEncryptedProfileVault } from './update-encrypted-profile-vault';

export class VaultUnlockError extends Error {
  constructor() {
    super('Vault could not be unlocked.');
    this.name = 'VaultUnlockError';
  }
}

export function createEncryptedVault(
  profile: SensitiveProfile,
  passphrase: string,
  now = new Date().toISOString(),
): Promise<{ envelope: StoredVaultEnvelope; key: CryptoKey }> {
  return createEncryptedProfileVault(profile, passphrase, now);
}

export async function unlockVaultKey(
  _envelope: StoredVaultEnvelope,
  _passphrase: string,
): Promise<CryptoKey> {
  throw new VaultUnlockError();
}

export async function decryptSensitiveProfile(
  _envelope: StoredVaultEnvelope,
  _key: CryptoKey,
): Promise<SensitiveProfile> {
  throw new VaultUnlockError();
}

export function reencryptSensitiveProfile(
  profile: SensitiveProfile,
  envelope: StoredVaultEnvelope,
  key: CryptoKey,
  now = new Date().toISOString(),
): Promise<StoredVaultEnvelope> {
  return updateEncryptedProfileVault(profile, envelope, key, now);
}
