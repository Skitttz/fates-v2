import { LocalLoadCurrentAccount, LocalSaveCurrentAccount } from '@/data/usecases';
import { LoadCurrentAccount, SaveCurrentAccount } from '@/domain/usecases';
import { makeLocalStorageAdapter } from '../cache';
import { STORAGE_KEYS } from '../config';

export const makeLocalSaveCurrentAccount = (): SaveCurrentAccount =>
  new LocalSaveCurrentAccount(STORAGE_KEYS.ACCOUNT, makeLocalStorageAdapter());

export const makeLocalLoadCurrentAccount = (): LoadCurrentAccount =>
  new LocalLoadCurrentAccount(STORAGE_KEYS.ACCOUNT, makeLocalStorageAdapter());
