import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_API_URL, getApiBaseUrl } from './env';

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses NEXT_PUBLIC_API_URL without trailing slash', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com/api/v1/');
    expect(getApiBaseUrl()).toBe('https://api.example.com/api/v1');
  });

  it('falls back to the local API', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    expect(getApiBaseUrl()).toBe(DEFAULT_API_URL);
  });
});
