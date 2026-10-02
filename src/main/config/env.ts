
export const getApiBaseUrl = (): string =>
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1').replace(/\/+$/, '');
