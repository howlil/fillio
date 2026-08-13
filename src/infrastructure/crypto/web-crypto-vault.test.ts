import { describe, expect, it } from 'vitest';

import { createEmptySensitiveProfile } from '../../domain/profile/create-empty-sensitive-profile';
import {
  createEncryptedVault,
  decryptSensitiveProfile,
  reencryptSensitiveProfile,
  unlockVaultKey,
  VaultUnlockError,
} from './web-crypto-vault';

function populatedProfile() {
  const profile = createEmptySensitiveProfile();
  profile.personal.birthDate = '2001-02-03';
  profile.identity.nationalId = '3174000000000001';
  profile.compensation.expected.amount = 15_000_000;
  profile.compensation.expected.currency = 'IDR';
  profile.compensation.expected.payPeriod = 'monthly';
  return profile;
}

describe('Web Crypto sensitive vault', () => {
  it('encrypts and decrypts a validated sensitive profile without plaintext in the envelope', async () => {
    const profile = populatedProfile();
    const passphrase = 'local-vault-passphrase-2026';

    const { envelope, key } = await createEncryptedVault(
      profile,
      passphrase,
      '2026-08-13T16:30:00.000Z',
    );

    expect(envelope.kdf.salt).not.toBe('');
    expect(envelope.cipher.iv).not.toBe('');
    expect(envelope.ciphertext).not.toBe('');
    const serialized = JSON.stringify(envelope);
    expect(serialized).not.toContain(profile.identity.nationalId);
    expect(serialized).not.toContain(profile.personal.birthDate);
    expect(serialized).not.toContain(passphrase);
    await expect(decryptSensitiveProfile(envelope, key)).resolves.toEqual(
      profile,
    );
  });

  it('unlocks with the correct passphrase and returns a usable key', async () => {
    const profile = populatedProfile();
    const passphrase = 'local-vault-passphrase-2026';
    const { envelope } = await createEncryptedVault(profile, passphrase);

    const key = await unlockVaultKey(envelope, passphrase);

    await expect(decryptSensitiveProfile(envelope, key)).resolves.toEqual(
      profile,
    );
  });

  it('rejects a wrong passphrase with one fail-closed error type', async () => {
    const { envelope } = await createEncryptedVault(
      populatedProfile(),
      'local-vault-passphrase-2026',
    );

    await expect(
      unlockVaultKey(envelope, 'different-local-passphrase'),
    ).rejects.toBeInstanceOf(VaultUnlockError);
  });

  it('rejects authenticated ciphertext tampering', async () => {
    const { envelope, key } = await createEncryptedVault(
      populatedProfile(),
      'local-vault-passphrase-2026',
    );
    const tampered = {
      ...envelope,
      ciphertext:
        envelope.ciphertext.slice(0, -1) +
        (envelope.ciphertext.endsWith('A') ? 'B' : 'A'),
    };

    await expect(decryptSensitiveProfile(tampered, key)).rejects.toBeInstanceOf(
      VaultUnlockError,
    );
  });

  it('re-encrypts with the same KDF salt but a fresh IV and updated timestamp', async () => {
    const { envelope, key } = await createEncryptedVault(
      populatedProfile(),
      'local-vault-passphrase-2026',
      '2026-08-13T16:30:00.000Z',
    );
    const updated = populatedProfile();
    updated.identity.taxId = '99.999.999.9-999.999';

    const nextEnvelope = await reencryptSensitiveProfile(
      updated,
      envelope,
      key,
      '2026-08-13T17:00:00.000Z',
    );

    expect(nextEnvelope.kdf.salt).toBe(envelope.kdf.salt);
    expect(nextEnvelope.cipher.iv).not.toBe(envelope.cipher.iv);
    expect(nextEnvelope.metadata.createdAt).toBe(envelope.metadata.createdAt);
    expect(nextEnvelope.metadata.updatedAt).toBe('2026-08-13T17:00:00.000Z');
    await expect(decryptSensitiveProfile(nextEnvelope, key)).resolves.toEqual(
      updated,
    );
  });
});
