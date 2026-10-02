'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AccountModel } from '@/domain/models';
import { AccountContextValue, AccountProviderProps } from './types';

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({
  children,
  loadCurrentAccount,
  saveCurrentAccount,
}: AccountProviderProps) {
  const [account, setAccount] = useState<AccountModel | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadCurrentAccount
      .load()
      .then(setAccount)
      .finally(() => setReady(true));
  }, [loadCurrentAccount]);

  const signIn = useCallback(
    async (newAccount: AccountModel) => {
      await saveCurrentAccount.save(newAccount);
      setAccount(newAccount);
    },
    [saveCurrentAccount],
  );

  const signOut = useCallback(async () => {
    await saveCurrentAccount.save(null);
    setAccount(null);
  }, [saveCurrentAccount]);

  const value = useMemo<AccountContextValue>(
    () => ({ account, ready, signIn, signOut }),
    [account, ready, signIn, signOut],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const context = useContext(AccountContext);
  if (!context) throw new Error('useAccount must be used within AccountProvider');
  return context;
}
