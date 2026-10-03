import { MockPlaceOrder } from '@/data/usecases/mock';
import { RemotePlaceOrder } from '@/data/usecases';
import { PlaceOrder } from '@/domain/usecases';
import { mockProducts } from '../mocks/products';
import { mockAccount } from '../mocks/account';
import { makeLocalLoadCurrentAccount } from './local-current-account-factory';
import { API_ROUTES, isDemoMode } from '../config';
import { makeAuthorizeHttpClientDecorator } from '../decorators';
import { makeApiUrl } from '../http';

export const makePlaceOrder = (): PlaceOrder =>
  isDemoMode()
    ? new MockPlaceOrder(
        mockProducts,
        makeLocalLoadCurrentAccount(),
        mockAccount.accessToken,
        (total) => ({
          code: `FTS-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          total,
          createdAt: new Date().toISOString(),
        }),
      )
    : new RemotePlaceOrder(
        makeApiUrl(API_ROUTES.ORDERS),
        makeAuthorizeHttpClientDecorator<RemotePlaceOrder.Model>(),
      );
