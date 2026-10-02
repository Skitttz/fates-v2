import { afterEach, describe, expect, it, vi } from 'vitest';
import { getApiBaseUrl } from './env';

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses NEXT_PUBLIC_API_URL without trailing slash', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://fates-api.onrender.com/api/v1/');
    expect(getApiBaseUrl()).toBe('https://fates-api.onrender.com/api/v1');
  });

  it('falls back to the local API', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    expect(getApiBaseUrl()).toBe('http://localhost:3000/api/v1');
  });
});
