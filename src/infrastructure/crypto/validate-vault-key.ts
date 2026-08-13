import type { StoredVaultEnvelope } from '../../domain/vault/vault-envelope';
import { decryptEncodedVaultBytes } from './decrypt-encoded-vault-bytes';

export async function validateVaultKey(
  envelope: StoredVaultEnvelope,
  key: CryptoKey,
): Promise<void> {
  await decryptEncodedVaultBytes(
    envelope.ciphertext,
    envelope.cipher.iv,
    key,
  );
}
