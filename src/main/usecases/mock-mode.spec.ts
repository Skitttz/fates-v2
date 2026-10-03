import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AccessDeniedError,
  InvalidCredentialsError,
  InvalidOrderError,
  NotFoundError,
  UnexpectedError,
} from '@/domain/errors';
import { FetchHttpClient } from '@/infra/http';
import { makeFetchHttpClient } from '../http/fetch-http-client-factory';
import { getApiBaseUrl } from '../config';
import {
  makeAuthentication,
  makeLoadProducts,
  makeLoadProductBySlug,
  makePlaceOrder,
  makeLocalSaveCurrentAccount,
} from './index';

const enableDemo = () => {
  vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true');
  // The configured remote URL must never receive a request in demo mode.
  vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://unreachable.invalid/api/v1');
  const fetch = vi.fn(() => {
    throw new Error('Unexpected network request');
  });
  vi.stubGlobal('fetch', fetch);
  return fetch;
};

afterEach(() => {
  localStorage.clear();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('standalone demo', () => {
  it('uses the real HTTP client by default and never silently falls back to demo', () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.test/api/v1');
    expect(makeFetchHttpClient()).toBeInstanceOf(FetchHttpClient);
    expect(getApiBaseUrl()).toBe('https://api.test/api/v1');
  });

  it('propagates API failures without switching to local fixtures', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.test/api/v1');
    const fetch = vi.fn().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetch);
    await expect(makeLoadProducts().load()).rejects.toThrow(UnexpectedError);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.test/api/v1/clothings',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('loads local product images, searches and filters without network access', async () => {
    const fetch = enableDemo();
    const products = await makeLoadProducts().load();
    expect(products).toHaveLength(3);
    expect(products.every((product) => product.images[0].startsWith('/demo/'))).toBe(true);
    expect(await makeLoadProducts().load({ query: ' GORRO ' })).toEqual([products[1]]);
    expect(await makeLoadProducts().load({ category: 'calcas' })).toEqual([products[2]]);
    expect(await makeLoadProducts().load({ query: 'inexistente' })).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('loads product details and preserves the not-found flow', async () => {
    enableDemo();
    const products = await makeLoadProducts().load();
    expect(await makeLoadProductBySlug().load(products[0].slug)).toEqual(products[0]);
    await expect(makeLoadProductBySlug().load('inexistente')).rejects.toThrow(NotFoundError);
  });

  it('completes login and checkout through the domain contracts and current account', async () => {
    const fetch = enableDemo();
    const account = await makeAuthentication().auth({
      email: ' Demo@Fates.com ',
      password: 'fates123',
    });
    await makeLocalSaveCurrentAccount().save(account);
    const [product] = await makeLoadProducts().load();
    const order = await makePlaceOrder().place({
      items: [{ productId: product.id, size: 'M', color: 'Preto', quantity: 2 }],
    });
    expect(order.total).toBe(product.price * 2);
    expect(order.code).toMatch(/^FTS-DEMO-/);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects invalid credentials and unauthenticated checkout', async () => {
    enableDemo();
    await expect(
      makeAuthentication().auth({ email: 'demo@fates.com', password: 'wrong' }),
    ).rejects.toThrow(InvalidCredentialsError);
    await expect(makePlaceOrder().place({ items: [] })).rejects.toThrow(AccessDeniedError);
  });

  it('rejects invalid variants, quantities and duplicate quantity bypasses', async () => {
    enableDemo();
    await makeLocalSaveCurrentAccount().save(
      await makeAuthentication().auth({ email: 'demo@fates.com', password: 'fates123' }),
    );
    const [product] = await makeLoadProducts().load();
    const item = { productId: product.id, size: 'M', color: 'Preto', quantity: 1 };
    for (const invalid of [
      { ...item, size: 'XG' },
      { ...item, quantity: -1 },
      { ...item, quantity: 1.5 },
    ]) {
      await expect(makePlaceOrder().place({ items: [invalid] })).rejects.toThrow(InvalidOrderError);
    }
    await expect(
      makePlaceOrder().place({
        items: [
          { ...item, quantity: 6 },
          { ...item, quantity: 6 },
        ],
      }),
    ).rejects.toThrow(InvalidOrderError);
  });
});
