import { afterEach, describe, expect, it, vi } from 'vitest';
import { getApiBaseUrl } from './env';

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('prefers NEXT_PUBLIC_API_URL when defined', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.fates.com');
    expect(getApiBaseUrl()).toBe('https://api.fates.com');
  });

  it('uses a relative url in the browser', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    expect(getApiBaseUrl()).toBe('/api');
  });

  it('uses localhost on the server', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    vi.stubEnv('VERCEL_URL', '');
    vi.stubEnv('PORT', '4000');
    vi.stubGlobal('window', undefined);
    expect(getApiBaseUrl()).toBe('http://localhost:4000/api');
  });
});
