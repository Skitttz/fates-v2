import { ROUTES } from '../constants/route';

/** Only same-origin paths; reject characters browsers strip or treat as slashes. */
export const safeRedirect = (path: string | null | undefined, fallback: string = ROUTES.HOME) => {
  if (!path || !path.startsWith('/') || /[\\\u0000-\u0020\u007f]/.test(path)) return fallback;
  try {
    const origin = 'https://fates.invalid';
    if (new URL(path, origin).origin !== origin) return fallback;
    return path;
  } catch {
    return fallback;
  }
};
