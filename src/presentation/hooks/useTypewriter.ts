'use client';

import { useCallback, useEffect, useState } from 'react';

export const TYPEWRITER_CHAR_MS = 28;

export function useTypewriter(text: string, instant: boolean) {
  const [typed, setTyped] = useState({ text, count: 0 });
  const count = typed.text === text ? typed.count : 0;
  const visibleCount = instant ? text.length : count;

  useEffect(() => {
    if (instant || visibleCount >= text.length) return;
    const timer = setTimeout(() => setTyped({ text, count: visibleCount + 1 }), TYPEWRITER_CHAR_MS);
    return () => clearTimeout(timer);
  }, [instant, text, visibleCount]);

  const complete = useCallback(() => setTyped({ text, count: text.length }), [text]);

  return {
    visibleText: text.slice(0, visibleCount),
    done: visibleCount >= text.length,
    complete,
  };
}
