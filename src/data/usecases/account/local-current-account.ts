import { AccountModel } from '@/domain/models';
import { LoadCurrentAccount, SaveCurrentAccount } from '@/domain/usecases';
import { GetStorage, SetStorage } from '../../protocols/cache';

const isAccount = (value: unknown): value is AccountModel =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as AccountModel).accessToken === 'string' &&
  typeof (value as AccountModel).email === 'string';

export class LocalSaveCurrentAccount implements SaveCurrentAccount {
  constructor(
    private readonly key: string,
    private readonly storage: SetStorage,
  ) {}

  async save(account: AccountModel | null): Promise<void> {
    this.storage.set(this.key, account);
  }
}

export class LocalLoadCurrentAccount implements LoadCurrentAccount {
  constructor(
    private readonly key: string,
    private readonly storage: GetStorage,
  ) {}

  async load(): Promise<AccountModel | null> {
    const account = this.storage.get(this.key);
    return isAccount(account) ? account : null;
  }
}
