import { describe, expect, it } from 'vitest';
import { HttpClientSpy, StorageSpy } from '@/data/test';
import { mockAccountModel } from '@/domain/test';
import { AuthorizeHttpClientDecorator } from './authorize-http-client-decorator';

const makeSut = () => {
  const storage = new StorageSpy();
  const httpClientSpy = new HttpClientSpy();
  const sut = new AuthorizeHttpClientDecorator('account', storage, httpClientSpy);
  return { sut, storage, httpClientSpy };
};

describe('AuthorizeHttpClientDecorator', () => {
  it('does not add headers when there is no account', async () => {
    const { sut, httpClientSpy } = makeSut();

    await sut.request({ url: 'http://api.test', method: 'get', headers: { a: '1' } });

    expect(httpClientSpy.headers).toEqual({ a: '1' });
  });

  it('adds the bearer token keeping the original headers', async () => {
    const { sut, storage, httpClientSpy } = makeSut();
    const account = mockAccountModel();
    storage.set('account', account);

    await sut.request({ url: 'http://api.test', method: 'post', headers: { a: '1' } });

    expect(httpClientSpy.headers).toEqual({
      a: '1',
      Authorization: `Bearer ${account.accessToken}`,
    });
  });

  it('returns the decorated client response', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: 200, body: { ok: true } };

    await expect(sut.request({ url: 'http://api.test', method: 'get' })).resolves.toEqual(
      httpClientSpy.response,
    );
  });
});
