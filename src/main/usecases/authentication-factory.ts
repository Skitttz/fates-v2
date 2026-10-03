import { MockAuthentication } from '@/data/usecases/mock';
import { RemoteAuthentication } from '@/data/usecases';
import { Authentication } from '@/domain/usecases';
import { mockAccount, mockCredentials } from '../mocks/account';
import { API_ROUTES, isDemoMode } from '../config';
import { makeApiUrl, makeFetchHttpClient } from '../http';

export const makeAuthentication = (): Authentication =>
  isDemoMode()
    ? new MockAuthentication(mockCredentials, mockAccount)
    : new RemoteAuthentication(
        makeApiUrl(API_ROUTES.LOGIN),
        makeFetchHttpClient<RemoteAuthentication.Model>(),
      );
