export const DEFAULT_API_URL = 'http://localhost:3000/api/v1';

/** URL base da api (servidor e browser usam a mesma, a API libera CORS) */
export const getApiBaseUrl = (): string =>
  (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');
