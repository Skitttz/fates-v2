export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

  // no browser a API mock responde na mesma origem
  if (typeof window !== 'undefined') return '/api';

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`;

  return `http://localhost:${process.env.PORT ?? 3000}/api`;
};
