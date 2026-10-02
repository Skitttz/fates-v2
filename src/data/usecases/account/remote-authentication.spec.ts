import { describe, expect, it } from 'vitest';
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { mockAuthenticationParams } from '@/domain/test';
import { HttpStatusCode } from '../../protocols/http';
import { HttpClientSpy } from '../../test';
import { RemoteAuthentication } from './remote-authentication';

const remoteAccount = {
  user: { id: 'user-id', name: 'Demo', email: 'demo@fates.com', role: 'user' },
  token: 'jwt-token',
};

const makeSut = () => {
  const httpClientSpy = new HttpClientSpy<RemoteAuthentication.Model>();
  const sut = new RemoteAuthentication('http://api.test/api/v1/auth/login', httpClientSpy);
  return { sut, httpClientSpy };
};

describe('RemoteAuthentication', () => {
  it('calls HttpClient with correct values', async () => {
    const { sut, httpClientSpy } = makeSut();
    const params = mockAuthenticationParams();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: { status: 200, data: remoteAccount },
    };

    await sut.auth(params);

    expect(httpClientSpy.url).toBe('http://api.test/api/v1/auth/login');
    expect(httpClientSpy.method).toBe('post');
    expect(httpClientSpy.body).toEqual(params);
  });

  it('returns an AccountModel on 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: { status: 200, data: remoteAccount },
    };

    const account = await sut.auth(mockAuthenticationParams());

    expect(account).toEqual({ name: 'Demo', email: 'demo@fates.com', accessToken: 'jwt-token' });
  });

  it('throws InvalidCredentialsError on 401', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = { statusCode: HttpStatusCode.unauthorized };

    await expect(sut.auth(mockAuthenticationParams())).rejects.toThrow(InvalidCredentialsError);
  });

  it.each([HttpStatusCode.badRequest, HttpStatusCode.serverError])(
    'throws UnexpectedError on %i',
    async (statusCode) => {
      const { sut, httpClientSpy } = makeSut();
      httpClientSpy.response = { statusCode };

      await expect(sut.auth(mockAuthenticationParams())).rejects.toThrow(UnexpectedError);
    },
  );
});
