import { describe, expect, it } from 'vitest';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '../../protocols/http';
import { HttpClientSpy } from '../../test';
import { RemotePlaceOrder } from './remote-place-order';

const params = { items: [{ productId: 1, size: 'M', color: 'Preto', quantity: 2 }] };

const makeSut = () => {
  const httpClientSpy = new HttpClientSpy<RemotePlaceOrder.Model>();
  const sut = new RemotePlaceOrder('http://api.test/orders', httpClientSpy);
  return { sut, httpClientSpy };
};

describe('RemotePlaceOrder', () => {
  it('calls HttpClient with correct values', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: { code: 'FTS-1', total_in_cents: 100, created_at: '2026-01-01' },
    };

    await sut.place(params);

    expect(httpClientSpy.url).toBe('http://api.test/orders');
    expect(httpClientSpy.method).toBe('post');
    expect(httpClientSpy.body).toEqual(params);
  });

  it('returns an OrderModel on 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: { code: 'FTS-1', total_in_cents: 17980, created_at: '2026-01-01' },
    };

    await expect(sut.place(params)).resolves.toEqual({
      code: 'FTS-1',
      total: 179.8,
      createdAt: '2026-01-01',
    });
  });

  it.each([HttpStatusCode.unauthorized, HttpStatusCode.forbidden])(
    'throws AccessDeniedError on %i',
    async (statusCode) => {
      const { sut, httpClientSpy } = makeSut();
      httpClientSpy.response = { statusCode };

      await expect(sut.place(params)).rejects.toThrow(AccessDeniedError);
    },
  );

  it('throws UnexpectedError on 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: HttpStatusCode.serverError };

    await expect(sut.place(params)).rejects.toThrow(UnexpectedError);
  });
});
