import { describe, expect, it } from 'vitest';
import { NotFoundError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '../../protocols/http';
import { HttpClientSpy, mockRemoteProductModel } from '../../test';
import { RemoteLoadProductBySlug } from './remote-load-product-by-slug';

const makeSut = () => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadProductBySlug.Model>();
  const sut = new RemoteLoadProductBySlug('http://api.test/api/v1/clothings', httpClientSpy);
  return { sut, httpClientSpy };
};

describe('RemoteLoadProductBySlug', () => {
  it('calls HttpClient with encoded slug url', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: { status: 200, data: mockRemoteProductModel() },
    };

    await sut.load('gorro fates');

    expect(httpClientSpy.url).toBe('http://api.test/api/v1/clothings/gorro%20fates');
    expect(httpClientSpy.method).toBe('get');
  });

  it('returns the adapted product on 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const remote = mockRemoteProductModel({ price: 49.9 });
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: { status: 200, data: remote } };

    const product = await sut.load(remote.slug);

    expect(product.slug).toBe(remote.slug);
    expect(product.price).toBe(49.9);
    expect(product.tag).toBe(remote.tag);
    expect(product.images[0]).toBe(
      'http://api.test/public/images/clothings/camiseta-masculina-fates.png',
    );
  });

  it('throws NotFoundError on 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: HttpStatusCode.notFound };

    await expect(sut.load('any')).rejects.toThrow(NotFoundError);
  });

  it('throws UnexpectedError on 200 without data', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: { status: 200 } };

    await expect(sut.load('any')).rejects.toThrow(UnexpectedError);
  });

  it('throws UnexpectedError on 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: HttpStatusCode.serverError };

    await expect(sut.load('any')).rejects.toThrow(UnexpectedError);
  });
});
