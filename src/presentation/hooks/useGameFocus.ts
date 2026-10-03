'use client';

import { RefObject, useEffect, useState } from 'react';
import { isFromInteractiveElement } from '@/presentation/story/keyboard';

export const GAME_KEYS: readonly string[] = [
  ' ',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
];

export function useGameFocus(ref: RefObject<HTMLElement>): boolean {
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const inside = (target: EventTarget | null) =>
      target instanceof Node && section.contains(target);
    const handlePointer = (event: PointerEvent) => setEngaged(inside(event.target));
    const handleFocusIn = () => setEngaged(true);
    const handleFocusOut = (event: FocusEvent) => {
      if (event.relatedTarget && !inside(event.relatedTarget)) setEngaged(false);
    };
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) setEngaged(false);
          });

    document.addEventListener('pointerdown', handlePointer);
    section.addEventListener('focusin', handleFocusIn);
    section.addEventListener('focusout', handleFocusOut);
    observer?.observe(section);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      section.removeEventListener('focusin', handleFocusIn);
      section.removeEventListener('focusout', handleFocusOut);
      observer?.disconnect();
    };
  }, [ref]);

  useEffect(() => {
    if (!engaged) return;
    const holdKeys = (event: KeyboardEvent) => {
      if (GAME_KEYS.includes(event.key) && !isFromInteractiveElement(event)) {
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', holdKeys);
    return () => window.removeEventListener('keydown', holdKeys);
  }, [engaged]);

  return engaged;
}
