import { getApiBaseUrl } from '../config';

export const makeApiUrl = (path: string): string => `${getApiBaseUrl()}${path}`;
