import { HttpClient } from '@/data/protocols/http';
import { makeLocalStorageAdapter } from '../cache';
import { STORAGE_KEYS } from '../config';
import { makeFetchHttpClient } from '../http';
import { AuthorizeHttpClientDecorator } from './authorize-http-client-decorator';

export const makeAuthorizeHttpClientDecorator = <R = unknown>(): HttpClient<R> =>
  new AuthorizeHttpClientDecorator<R>(
    STORAGE_KEYS.ACCOUNT,
    makeLocalStorageAdapter(),
    makeFetchHttpClient<R>(),
  );
