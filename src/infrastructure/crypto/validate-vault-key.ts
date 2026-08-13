import type { StoredVaultEnvelope } from '../../domain/vault/vault-envelope';
import { decryptEncodedVaultBytes } from './decrypt-encoded-vault-bytes';

export function validateVaultKey(
  envelope: StoredVaultEnvelope,
  key: CryptoKey,
): Promise<void> {
  return decryptEncodedVaultBytes(envelope.ciphertext, envelope.cipher.iv, key).then(
    () => undefined,
  );
}
