import { HttpClient } from '@/data/protocols/http';
import { FetchHttpClient } from '@/infra/http';
import { NextFetchConfig } from '@/infra/models';

export const makeFetchHttpClient = <R = unknown>(config?: NextFetchConfig): HttpClient<R> =>
  new FetchHttpClient<R>(config);
