import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getApiBaseUrl } from './env';

describe('getApiBaseUrl', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses NEXT_PUBLIC_API_URL without trailing slash', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com/api/v1/');
    expect(getApiBaseUrl()).toBe('https://api.example.com/api/v1');
  });

  it('falls back to the local API', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    expect(getApiBaseUrl()).toBe('http://localhost:3000/api/v1');
  });
});
