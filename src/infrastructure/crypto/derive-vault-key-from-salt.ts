import { decodeVaultBytes } from './vault-bytes';
import { deriveVaultKey } from './vault-key';

export function deriveVaultKeyFromSalt(
  phrase: string,
  encodedSalt: string,
): Promise<CryptoKey> {
  return deriveVaultKey(phrase, decodeVaultBytes(encodedSalt));
}
