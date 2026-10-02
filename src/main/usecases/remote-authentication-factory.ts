import { RemoteAuthentication } from '@/data/usecases';
import { Authentication } from '@/domain/usecases';
import { API_ROUTES } from '../config';
import { makeApiUrl, makeFetchHttpClient } from '../http';

export const makeRemoteAuthentication = (): Authentication =>
  new RemoteAuthentication(
    makeApiUrl(API_ROUTES.LOGIN),
    makeFetchHttpClient<RemoteAuthentication.Model>(),
  );
