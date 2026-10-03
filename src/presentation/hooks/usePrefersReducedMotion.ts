'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const reducedMotionQuery = (): MediaQueryList | null => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
  return window.matchMedia(QUERY);
};

const getServerSnapshot = () => false;

export function usePrefersReducedMotion(): boolean {
  const media = useMemo(reducedMotionQuery, []);

  const subscribe = useCallback(
    (onChange: () => void) => {
      media?.addEventListener('change', onChange);
      return () => media?.removeEventListener('change', onChange);
    },
    [media],
  );

  const getSnapshot = useCallback(() => media?.matches ?? false, [media]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
