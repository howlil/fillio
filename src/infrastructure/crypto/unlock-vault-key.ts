import type { StoredVaultEnvelope } from '../../domain/vault/vault-envelope';
import { deriveVaultKeyFromSalt } from './derive-vault-key-from-salt';
import { VaultUnlockError } from './vault-error';
import { validateVaultKey } from './validate-vault-key';

export async function unlockValidatedVaultKey(
  envelope: StoredVaultEnvelope,
  phrase: string,
): Promise<CryptoKey> {
  try {
    const key = await deriveVaultKeyFromSalt(phrase, envelope.kdf.salt);
    await validateVaultKey(envelope, key);
    return key;
  } catch {
    throw new VaultUnlockError();
  }
}
