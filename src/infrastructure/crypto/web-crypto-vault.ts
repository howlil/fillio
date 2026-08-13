import type { SensitiveProfile } from '../../domain/profile/profile-schema';
import {
  createEmptyVaultEnvelope,
  type StoredVaultEnvelope,
} from '../../domain/vault/vault-envelope';

export class VaultUnlockError extends Error {
  constructor() {
    super('Vault could not be unlocked.');
    this.name = 'VaultUnlockError';
  }
}

export async function createEncryptedVault(
  _profile: SensitiveProfile,
  _passphrase: string,
  now = new Date().toISOString(),
): Promise<{ envelope: StoredVaultEnvelope; key: CryptoKey }> {
  return {
    envelope: createEmptyVaultEnvelope(now),
    key: {} as CryptoKey,
  };
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

export async function reencryptSensitiveProfile(
  _profile: SensitiveProfile,
  envelope: StoredVaultEnvelope,
  _key: CryptoKey,
  now = new Date().toISOString(),
): Promise<StoredVaultEnvelope> {
  return {
    ...envelope,
    metadata: { ...envelope.metadata, updatedAt: now },
  };
}
