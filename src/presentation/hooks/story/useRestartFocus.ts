'use client';

import { RefObject, useCallback, useEffect, useRef } from 'react';

export function useRestartFocus(
  containerRef: RefObject<HTMLElement>,
  selector: string,
  ready: boolean,
  step: string,
): () => void {
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!requestedRef.current || !ready) return;
    requestedRef.current = false;
    const container = containerRef.current;
    (container?.querySelector<HTMLElement>(selector) ?? container)?.focus();
  }, [containerRef, ready, selector, step]);

  return useCallback(() => {
    requestedRef.current = true;
  }, []);
}
