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

export function useGameFocus(ref: RefObject<HTMLElement>, enabled = true): boolean {
  const [onScreen, setOnScreen] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [foreground, setForeground] = useState(true);
  const holding = enabled && onScreen && !dismissed && foreground;

  useEffect(() => {
    const blur = () => setForeground(false);
    const focus = () => setForeground(!document.hidden);
    window.addEventListener('blur', blur);
    window.addEventListener('focus', focus);
    document.addEventListener('visibilitychange', focus);
    return () => {
      window.removeEventListener('blur', blur);
      window.removeEventListener('focus', focus);
      document.removeEventListener('visibilitychange', focus);
    };
  }, []);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const inside = (target: EventTarget | null) =>
      target instanceof Node && section.contains(target);
    const handlePointer = (event: PointerEvent) => setDismissed(!inside(event.target));
    const handleFocusIn = () => setDismissed(false);
    const handleFocusOut = (event: FocusEvent) => {
      if (event.relatedTarget && !inside(event.relatedTarget)) setDismissed(true);
    };
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));

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
    if (!holding) return;
    const holdKeys = (event: KeyboardEvent) => {
      if (GAME_KEYS.includes(event.key) && !isFromInteractiveElement(event)) {
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', holdKeys);
    return () => window.removeEventListener('keydown', holdKeys);
  }, [holding]);

  return holding;
}
