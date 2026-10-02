import { describe, expect, it } from 'vitest';
import {
  AccessDeniedError,
  InvalidOrderError,
  UnexpectedError,
  RateLimitError,
} from '@/domain/errors';
import { HttpStatusCode } from '../../protocols/http';
import { HttpClientSpy } from '../../test';
import { RemotePlaceOrder } from './remote-place-order';

const params = { items: [{ productId: 'product-id', size: 'M', color: 'Preto', quantity: 2 }] };
const remoteOrder = { id: 'order-id', code: 'FTS-1', total: 140, createdAt: '2026-01-01' };

const makeSut = () => {
  const httpClientSpy = new HttpClientSpy<RemotePlaceOrder.Model>();
  const sut = new RemotePlaceOrder('http://api.test/api/v1/orders', httpClientSpy);
  return { sut, httpClientSpy };
};

describe('RemotePlaceOrder', () => {
  it('sends the items using the API contract (clothingId)', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.created,
      body: { status: 201, data: remoteOrder },
    };

    await sut.place(params);

    expect(httpClientSpy.url).toBe('http://api.test/api/v1/orders');
    expect(httpClientSpy.method).toBe('post');
    expect(httpClientSpy.body).toEqual({
      items: [{ clothingId: 'product-id', size: 'M', color: 'Preto', quantity: 2 }],
    });
  });

  it('returns an OrderModel on 201', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.created,
      body: { status: 201, data: remoteOrder },
    };

    await expect(sut.place(params)).resolves.toEqual({
      code: 'FTS-1',
      total: 140,
      createdAt: '2026-01-01',
    });
  });

  it('throws InvalidOrderError with the API message on 400', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
      body: { status: 400, error: 'Tamanho XG indisponível' },
    };

    await expect(sut.place(params)).rejects.toThrow(
      new InvalidOrderError('Tamanho XG indisponível'),
    );
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
  it('reports rate limiting on 429', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: HttpStatusCode.tooManyRequests };
    await expect(sut.place(params)).rejects.toThrow(RateLimitError);
  });
});
