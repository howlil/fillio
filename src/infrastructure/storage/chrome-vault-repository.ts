import type { VaultRepository } from '../../application/vault/vault-repository';
import type { StoredVaultEnvelope } from '../../domain/vault/vault-envelope';

export const VAULT_STORAGE_KEY = 'fillio.vault';

export class ChromeVaultRepository implements VaultRepository {
  load(): Promise<StoredVaultEnvelope | null> {
    return Promise.resolve(null);
  }

  save(_envelope: StoredVaultEnvelope): Promise<void> {
    return Promise.resolve();
  }

  delete(): Promise<void> {
    return Promise.resolve();
  }
}
