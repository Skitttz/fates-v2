import { describe, expect, it } from 'vitest';
import { UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '../../protocols/http';
import { HttpClientSpy, mockRemoteProductModel } from '../../test';
import { RemoteLoadProducts } from './remote-load-products';

const makeSut = (url = 'http://api.test/products') => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadProducts.Model>();
  const sut = new RemoteLoadProducts(url, httpClientSpy);
  return { sut, httpClientSpy };
};

describe('RemoteLoadProducts', () => {
  it('calls HttpClient with correct url and method', async () => {
    const { sut, httpClientSpy } = makeSut();

    await sut.load();

    expect(httpClientSpy.url).toBe('http://api.test/products');
    expect(httpClientSpy.method).toBe('get');
    expect(httpClientSpy.callsCount).toBe(1);
  });

  it('appends query and category as search params', async () => {
    const { sut, httpClientSpy } = makeSut();

    await sut.load({ query: '  touca ', category: 'acessorios' });

    expect(httpClientSpy.url).toBe('http://api.test/products?q=touca&category=acessorios');
  });

  it('adapts remote products to domain products on 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const remote = mockRemoteProductModel({ price_in_cents: 12990, tag: null });
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: { results: [remote] } };

    const products = await sut.load();

    expect(products).toEqual([
      {
        id: remote.id,
        slug: remote.slug,
        name: remote.name,
        description: remote.description,
        category: remote.category,
        material: remote.material,
        price: 129.9,
        sizes: remote.sizes,
        colors: remote.colors,
        images: remote.images,
      },
    ]);
  });

  it('returns an empty list on 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: HttpStatusCode.noContent };

    await expect(sut.load()).resolves.toEqual([]);
  });

  it.each([HttpStatusCode.badRequest, HttpStatusCode.notFound, HttpStatusCode.serverError])(
    'throws UnexpectedError on %i',
    async (statusCode) => {
      const { sut, httpClientSpy } = makeSut();
      httpClientSpy.response = { statusCode };

      await expect(sut.load()).rejects.toThrow(UnexpectedError);
    },
  );
});
