'use client';

import { useEffect, useState } from 'react';
import { WalkDirection } from '../useWalk';

export function useWalkDirection() {
  const [direction, setDirection] = useState<WalkDirection>(0);

  useEffect(() => {
    const stop = () => setDirection(0);
    const stopWhenHidden = () => {
      if (document.hidden) stop();
    };
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', stopWhenHidden);
    return () => {
      window.removeEventListener('blur', stop);
      document.removeEventListener('visibilitychange', stopWhenHidden);
    };
  }, []);

  return [direction, setDirection] as const;
}
