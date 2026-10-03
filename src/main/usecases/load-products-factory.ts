import { MockLoadProducts } from '@/data/usecases/mock';
import { RemoteLoadProducts } from '@/data/usecases';
import { LoadProducts } from '@/domain/usecases';
import { mockProducts } from '../mocks/products';
import { API_ROUTES, isDemoMode } from '../config';
import { makeApiUrl, makeFetchHttpClient } from '../http';

export const makeLoadProducts = (): LoadProducts =>
  isDemoMode()
    ? new MockLoadProducts(mockProducts)
    : new RemoteLoadProducts(
        makeApiUrl(API_ROUTES.PRODUCTS),
        makeFetchHttpClient<RemoteLoadProducts.Model>({ cache: 'no-store' }),
      );
