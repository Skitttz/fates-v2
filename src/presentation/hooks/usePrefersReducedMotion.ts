'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const reducedMotionQuery = () =>
  typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : null;

const subscribe = (onChange: () => void) => {
  const media = reducedMotionQuery();
  media?.addEventListener('change', onChange);
  return () => media?.removeEventListener('change', onChange);
};

const getSnapshot = () => reducedMotionQuery()?.matches ?? false;

const getServerSnapshot = () => false;

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
