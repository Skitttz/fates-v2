import { ROUTES } from '../constants/route';

/** evita open redirect: só aceita caminhos internos */
export const safeRedirect = (path: string | null | undefined, fallback: string = ROUTES.HOME) => {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) {
    return fallback;
  }
  return path;
};
