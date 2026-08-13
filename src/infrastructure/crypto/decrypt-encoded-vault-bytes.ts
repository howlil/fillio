import { decryptVaultBytes } from './vault-aead';
import { decodeVaultBytes } from './vault-bytes';

export function decryptEncodedVaultBytes(
  encodedCiphertext: string,
  encodedIv: string,
  key: CryptoKey,
): Promise<Uint8Array> {
  return decryptVaultBytes(
    // @ts-expect-error TS 5.9 widens decoded Uint8Array to ArrayBufferLike; decodeVaultBytes allocates a fresh ArrayBuffer-backed view.
    decodeVaultBytes(encodedCiphertext),
    key,
    // @ts-expect-error Same boundary as ciphertext: decoded hex allocates a fresh ArrayBuffer-backed view.
    decodeVaultBytes(encodedIv),
  );
}
