import { describe, expect, it } from 'vitest';
import { NotFoundError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '../../protocols/http';
import { HttpClientSpy, mockRemoteProductModel } from '../../test';
import { RemoteLoadProductBySlug } from './remote-load-product-by-slug';

const makeSut = () => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadProductBySlug.Model>();
  const sut = new RemoteLoadProductBySlug('http://api.test/products', httpClientSpy);
  return { sut, httpClientSpy };
};

describe('RemoteLoadProductBySlug', () => {
  it('calls HttpClient with encoded slug url', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: mockRemoteProductModel() };

    await sut.load('touca fates');

    expect(httpClientSpy.url).toBe('http://api.test/products/touca%20fates');
    expect(httpClientSpy.method).toBe('get');
  });

  it('returns the adapted product on 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const remote = mockRemoteProductModel({ price_in_cents: 4990 });
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: remote };

    const product = await sut.load(remote.slug);

    expect(product.slug).toBe(remote.slug);
    expect(product.price).toBe(49.9);
    expect(product.tag).toBe(remote.tag);
  });

  it('throws NotFoundError on 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: HttpStatusCode.notFound };

    await expect(sut.load('any')).rejects.toThrow(NotFoundError);
  });

  it('throws UnexpectedError on 200 without body', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: HttpStatusCode.ok };

    await expect(sut.load('any')).rejects.toThrow(UnexpectedError);
  });

  it('throws UnexpectedError on 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: HttpStatusCode.serverError };

    await expect(sut.load('any')).rejects.toThrow(UnexpectedError);
  });
});
