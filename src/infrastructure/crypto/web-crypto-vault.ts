import type { SensitiveProfile } from '../../domain/profile/profile-schema';
import type { StoredVaultEnvelope } from '../../domain/vault/vault-envelope';
import { createEncryptedProfileVault } from './create-encrypted-profile-vault';
import { decryptEncodedVaultBytes } from './decrypt-encoded-vault-bytes';
import { updateEncryptedProfileVault } from './update-encrypted-profile-vault';
import { decodeVaultProfile } from './vault-profile-codec';

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
  envelope: StoredVaultEnvelope,
  key: CryptoKey,
): Promise<SensitiveProfile> {
  try {
    const plaintext = await decryptEncodedVaultBytes(
      envelope.ciphertext,
      envelope.cipher.iv,
      key,
    );
    return decodeVaultProfile(plaintext);
  } catch {
    throw new VaultUnlockError();
  }
}

export function reencryptSensitiveProfile(
  profile: SensitiveProfile,
  envelope: StoredVaultEnvelope,
  key: CryptoKey,
  now = new Date().toISOString(),
): Promise<StoredVaultEnvelope> {
  return updateEncryptedProfileVault(profile, envelope, key, now);
}
