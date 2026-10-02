import { describe, expect, it } from 'vitest';
import { mockAccountModel } from '@/domain/test';
import { StorageSpy } from '../../test';
import { LocalLoadCurrentAccount, LocalSaveCurrentAccount } from './local-current-account';

const KEY = 'account';

describe('LocalCurrentAccount', () => {
  it('saves and loads the current account', async () => {
    const storage = new StorageSpy();
    const account = mockAccountModel();

    await new LocalSaveCurrentAccount(KEY, storage).save(account);

    await expect(new LocalLoadCurrentAccount(KEY, storage).load()).resolves.toEqual(account);
  });

  it('removes the account when saving null', async () => {
    const storage = new StorageSpy();
    storage.set(KEY, mockAccountModel());

    await new LocalSaveCurrentAccount(KEY, storage).save(null);

    expect(storage.values.has(KEY)).toBe(false);
  });

  it('returns null when stored value is not an account', async () => {
    const storage = new StorageSpy();
    storage.set(KEY, { foo: 'bar' });

    await expect(new LocalLoadCurrentAccount(KEY, storage).load()).resolves.toBeNull();
  });
});
