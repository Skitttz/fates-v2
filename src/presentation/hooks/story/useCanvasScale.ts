'use client';

import { RefObject, useEffect, useState } from 'react';
import { computeCanvasScale } from '@/presentation/story/engine/canvas-scale';

export function useCanvasScale(wrapperRef: RefObject<HTMLElement>): number | null {
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof ResizeObserver === 'undefined') return;
    const update = () => setScale(computeCanvasScale(wrapper.clientWidth, window.innerHeight));
    const observer = new ResizeObserver(update);
    observer.observe(wrapper);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [wrapperRef]);

  return scale;
}
