import {
  parseStoredVaultEnvelope,
  type StoredVaultEnvelope,
} from '../../domain/vault/vault-envelope';
import { encryptVaultBytes } from './vault-aead';
import { encodeVaultBytes } from './vault-bytes';

export async function updateVaultEnvelope(
  payload: Uint8Array,
  envelope: StoredVaultEnvelope,
  key: CryptoKey,
  now = new Date().toISOString(),
): Promise<StoredVaultEnvelope> {
  const validated = parseStoredVaultEnvelope(envelope);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await encryptVaultBytes(payload, key, iv);

  return {
    ...validated,
    cipher: { ...validated.cipher, iv: encodeVaultBytes(iv) },
    ciphertext: encodeVaultBytes(encrypted),
    metadata: { ...validated.metadata, updatedAt: now },
  };
}
