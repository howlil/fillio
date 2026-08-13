import { decryptVaultBytes } from './vault-aead';
import { decodeVaultBytes } from './vault-bytes';

export function decryptEncodedVaultBytes(
  encodedCiphertext: string,
  encodedIv: string,
  key: CryptoKey,
): Promise<Uint8Array> {
  return decryptVaultBytes(
    decodeVaultBytes(encodedCiphertext),
    key,
    decodeVaultBytes(encodedIv),
  );
}
