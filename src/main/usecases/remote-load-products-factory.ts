import { RemoteLoadProducts } from '@/data/usecases';
import { LoadProducts } from '@/domain/usecases';
import { API_ROUTES } from '../config';
import { makeApiUrl, makeFetchHttpClient } from '../http';

export const makeRemoteLoadProducts = (): LoadProducts =>
  new RemoteLoadProducts(
    makeApiUrl(API_ROUTES.PRODUCTS),
    makeFetchHttpClient<RemoteLoadProducts.Model>({ cache: 'no-store' }),
  );
