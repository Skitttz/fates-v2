import { AccountModel } from '../models';

export interface SaveCurrentAccount {
  save: (account: AccountModel | null) => Promise<void>;
}

export interface LoadCurrentAccount {
  load: () => Promise<AccountModel | null>;
}
