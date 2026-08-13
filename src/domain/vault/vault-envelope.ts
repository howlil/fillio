export type StoredVaultEnvelope = {
  schemaVersion: 1;
  kdf: {
    name: 'PBKDF2';
    hash: 'SHA-256';
    iterations: number;
    salt: string;
  };
  cipher: {
    name: 'AES-GCM';
    keyLength: number;
    iv: string;
    tagLength: number;
  };
  ciphertext: string;
  metadata: { createdAt: string; updatedAt: string };
};

export function createEmptyVaultEnvelope(
  now = new Date().toISOString(),
): StoredVaultEnvelope {
  return {
    schemaVersion: 1,
    kdf: { name: 'PBKDF2', hash: 'SHA-256', iterations: 1, salt: '' },
    cipher: { name: 'AES-GCM', keyLength: 128, iv: '', tagLength: 128 },
    ciphertext: '',
    metadata: { createdAt: now, updatedAt: now },
  };
}

export function parseStoredVaultEnvelope(value: unknown): StoredVaultEnvelope {
  return value as StoredVaultEnvelope;
}
