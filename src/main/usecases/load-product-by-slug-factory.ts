import { MockLoadProductBySlug } from '@/data/usecases/mock';
import { RemoteLoadProductBySlug } from '@/data/usecases';
import { LoadProductBySlug } from '@/domain/usecases';
import { mockProducts } from '../mocks/products';
import { API_ROUTES, isDemoMode } from '../config';
import { makeApiUrl, makeFetchHttpClient } from '../http';

export const makeLoadProductBySlug = (): LoadProductBySlug =>
  isDemoMode()
    ? new MockLoadProductBySlug(mockProducts)
    : new RemoteLoadProductBySlug(
        makeApiUrl(API_ROUTES.PRODUCTS),
        makeFetchHttpClient<RemoteLoadProductBySlug.Model>({ cache: 'no-store' }),
      );
