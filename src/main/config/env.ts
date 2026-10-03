export const DEFAULT_API_URL = 'http://localhost:3000/api/v1';

export const isDemoMode = (): boolean => process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const getApiBaseUrl = (): string =>
  (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');
