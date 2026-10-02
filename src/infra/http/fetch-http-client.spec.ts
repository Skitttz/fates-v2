import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpStatusCode } from '@/data/protocols/http';
import { FetchHttpClient } from './fetch-http-client';

const mockFetch = (response: Response | Error) => {
  const fetchMock =
    response instanceof Error
      ? vi.fn().mockRejectedValue(response)
      : vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('FetchHttpClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls fetch with method, merged config and json body', async () => {
    const fetchMock = mockFetch(new Response('{}', { status: 200 }));
    const sut = new FetchHttpClient({ cache: 'no-store' });

    await sut.request({ url: 'http://api.test', method: 'post', body: { name: 'any' } });

    expect(fetchMock).toHaveBeenCalledWith('http://api.test', {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'any' }),
    });
  });

  it('does not send a body or content-type on get', async () => {
    const fetchMock = mockFetch(new Response('[]', { status: 200 }));

    await new FetchHttpClient().request({ url: 'http://api.test', method: 'get' });

    expect(fetchMock).toHaveBeenCalledWith('http://api.test', {
      method: 'GET',
      headers: undefined,
      body: undefined,
    });
  });

  it('returns status code and parsed body', async () => {
    mockFetch(new Response(JSON.stringify({ results: [1] }), { status: 200 }));

    const response = await new FetchHttpClient().request({ url: 'http://api.test', method: 'get' });

    expect(response).toEqual({ statusCode: HttpStatusCode.ok, body: { results: [1] } });
  });

  it('handles empty bodies (204)', async () => {
    mockFetch(new Response(null, { status: 204 }));

    const response = await new FetchHttpClient().request({ url: 'http://api.test', method: 'get' });

    expect(response).toEqual({ statusCode: HttpStatusCode.noContent, body: undefined });
  });

  it('handles non json bodies', async () => {
    mockFetch(new Response('<html>oops</html>', { status: 500 }));

    const response = await new FetchHttpClient().request({ url: 'http://api.test', method: 'get' });

    expect(response).toEqual({ statusCode: HttpStatusCode.serverError, body: undefined });
  });

  it('returns serverError when fetch rejects (network error)', async () => {
    mockFetch(new TypeError('Failed to fetch'));

    const response = await new FetchHttpClient().request({ url: 'http://api.test', method: 'get' });

    expect(response).toEqual({ statusCode: HttpStatusCode.serverError });
  });
});
