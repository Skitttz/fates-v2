import { RemoteLoadProductBySlug } from '@/data/usecases';
import { LoadProductBySlug } from '@/domain/usecases';
import { API_ROUTES } from '../config';
import { makeApiUrl, makeFetchHttpClient } from '../http';

export const makeRemoteLoadProductBySlug = (): LoadProductBySlug =>
  new RemoteLoadProductBySlug(
    makeApiUrl(API_ROUTES.PRODUCTS),
    makeFetchHttpClient<RemoteLoadProductBySlug.Model>({ cache: 'no-store' }),
  );
