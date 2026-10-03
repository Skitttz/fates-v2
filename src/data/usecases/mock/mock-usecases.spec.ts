import { describe, expect, it } from 'vitest';
import { AccessDeniedError, InvalidCredentialsError } from '@/domain/errors';
import { AccountModel } from '@/domain/models';
import { mockAccountModel, mockProductModel } from '@/domain/test';
import {
  MockAuthentication,
  MockLoadProductBySlug,
  MockLoadProducts,
  MockPlaceOrder,
} from './index';

describe('mock use cases with injected dependencies', () => {
  it('uses the supplied catalog and keeps returned values isolated from its source', async () => {
    const product = mockProductModel({ name: 'Produto de teste', sizes: ['M'] });
    const loadProducts = new MockLoadProducts([product]);
    const loadProduct = new MockLoadProductBySlug([product]);
    const [listed] = await loadProducts.load();
    listed.name = 'Alterado';
    listed.sizes.push('XG');
    const detail = await loadProduct.load(product.slug);
    detail.colors.length = 0;

    expect(await loadProducts.load()).toEqual([product]);
    expect(await loadProduct.load(product.slug)).toEqual(product);
    expect(await new MockLoadProducts([]).load()).toEqual([]);
  });

  it('authenticates against supplied credentials without exposing them in the account', async () => {
    const credentials = { email: 'test@example.com', password: 'test-password' };
    const account = mockAccountModel({ email: credentials.email });
    const authentication = new MockAuthentication(credentials, account);
    const result = await authentication.auth({ ...credentials, email: ' Test@Example.com ' });
    expect(result).toEqual(account);
    expect(result).not.toHaveProperty('password');
    result.name = 'Alterado';
    expect(await authentication.auth(credentials)).toEqual(account);
    await expect(authentication.auth({ ...credentials, password: 'wrong' })).rejects.toThrow(
      InvalidCredentialsError,
    );
  });

  it('computes catalog prices and receives order metadata through injection', async () => {
    const product = mockProductModel({ price: 49.9, sizes: ['M'], colors: ['Preto'] });
    const account = mockAccountModel();
    const placeOrder = new MockPlaceOrder(
      [product],
      { load: async () => account },
      account.accessToken,
      (total) => ({ code: 'TEST-ORDER', createdAt: '2026-01-01T00:00:00.000Z', total }),
    );
    expect(
      await placeOrder.place({
        items: [{ productId: product.id, size: 'M', color: 'Preto', quantity: 3 }],
      }),
    ).toEqual({
      code: 'TEST-ORDER',
      createdAt: '2026-01-01T00:00:00.000Z',
      total: 149.7,
    });
  });

  it('reloads the current account for every checkout and rejects stale or foreign sessions', async () => {
    const account = mockAccountModel();
    let current: AccountModel | null = null;
    const createOrder = () => {
      throw new Error('Must not create an unauthorized order');
    };
    const placeOrder = new MockPlaceOrder(
      [],
      { load: async () => current },
      account.accessToken,
      createOrder,
    );
    await expect(placeOrder.place({ items: [] })).rejects.toThrow(AccessDeniedError);
    current = { ...account, accessToken: 'foreign-token' };
    await expect(placeOrder.place({ items: [] })).rejects.toThrow(AccessDeniedError);
  });
});
