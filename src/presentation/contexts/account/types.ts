import { ReactNode } from 'react';
import { AccountModel } from '@/domain/models';
import { LoadCurrentAccount, SaveCurrentAccount } from '@/domain/usecases';

export type AccountContextValue = {
  account: AccountModel | null;
  ready: boolean;
  signIn: (account: AccountModel) => Promise<void>;
  signOut: () => Promise<void>;
};

export type AccountProviderProps = {
  children: ReactNode;
  loadCurrentAccount: LoadCurrentAccount;
  saveCurrentAccount: SaveCurrentAccount;
};
