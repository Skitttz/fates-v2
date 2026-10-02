import { describe, expect, it } from 'vitest';
import { UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '../../protocols/http';
import { HttpClientSpy, mockRemoteProductModel } from '../../test';
import { RemoteLoadProducts } from './remote-load-products';

const URL = 'http://api.test/api/v1/clothings';

const makeSut = () => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadProducts.Model>();
  const sut = new RemoteLoadProducts(URL, httpClientSpy);
  return { sut, httpClientSpy };
};

describe('RemoteLoadProducts', () => {
  it('calls HttpClient with correct url and method', async () => {
    const { sut, httpClientSpy } = makeSut();

    await sut.load();

    expect(httpClientSpy.url).toBe(URL);
    expect(httpClientSpy.method).toBe('get');
    expect(httpClientSpy.callsCount).toBe(1);
  });

  it('appends query and category as search params', async () => {
    const { sut, httpClientSpy } = makeSut();

    await sut.load({ query: '  gorro ', category: 'acessorios' });

    expect(httpClientSpy.url).toBe(`${URL}?q=gorro&category=acessorios`);
  });

  it('unwraps the envelope and adapts products on 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const remote = mockRemoteProductModel({ tag: null });
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: { status: 200, data: [remote] },
    };

    const products = await sut.load();

    expect(products).toEqual([
      {
        id: remote.id,
        slug: remote.slug,
        name: remote.name,
        description: remote.description,
        category: remote.category,
        material: remote.material,
        price: remote.price,
        sizes: remote.sizes,
        colors: remote.colors,
        images: ['http://api.test/public/images/clothings/camiseta-masculina-fates.png'],
      },
    ]);
  });

  it('keeps absolute image urls untouched', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: { status: 200, data: [mockRemoteProductModel({ images: ['https://cdn.test/a.png'] })] },
    };

    const [product] = await sut.load();

    expect(product.images).toEqual(['https://cdn.test/a.png']);
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
