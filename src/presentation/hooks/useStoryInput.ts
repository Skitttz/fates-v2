'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { isActionKey, isArrowKey, isFromInteractiveElement } from '@/presentation/story/keyboard';
import { StoryPhase } from '@/presentation/story/engine/story-reducer';
import { WalkDirection } from './useWalk';

type InputOptions = {
  enabled: boolean;
  walking: boolean;
  phase: StoryPhase;
  sceneKey: string;
  onJump: () => void;
  onAdvance: () => void;
};

export function useStoryInput({
  enabled,
  walking,
  phase,
  sceneKey,
  onJump,
  onAdvance,
}: InputOptions) {
  const [direction, setDirection] = useState<WalkDirection>(0);
  const held = useRef(new Set<string>());
  const touch = useRef<WalkDirection>(0);
  const callbacks = useRef({ onJump, onAdvance });
  useEffect(() => {
    callbacks.current = { onJump, onAdvance };
  }, [onJump, onAdvance]);
  const update = useCallback(() => {
    const last = Array.from(held.current).at(-1);
    const keyDirection = last === 'ArrowLeft' ? -1 : 1;
    setDirection(touch.current || (last ? keyDirection : 0));
  }, []);
  const clear = useCallback(() => {
    held.current.clear();
    touch.current = 0;
    setDirection(0);
  }, []);
  const onDirectionChange = useCallback(
    (value: WalkDirection) => {
      // A pointer press also brings focus back to the game in the same event.
      touch.current = walking ? value : 0;
      update();
    },
    [walking, update],
  );

  useEffect(clear, [walking, phase, sceneKey, clear]);
  useEffect(() => {
    if (!enabled) {
      clear();
      return;
    }
    const down = (event: KeyboardEvent) => {
      if (isFromInteractiveElement(event)) return;
      if (walking && (isArrowKey(event) || event.key === ' ' || event.key === 'ArrowUp')) {
        event.preventDefault();
        if (event.repeat) return;
        if (isArrowKey(event)) {
          held.current.add(event.key);
          update();
        } else callbacks.current.onJump();
      } else if (phase === 'dialogue' && isActionKey(event)) {
        event.preventDefault();
        if (!event.repeat) callbacks.current.onAdvance();
      }
    };
    const up = (event: KeyboardEvent) => {
      if (held.current.delete(event.key)) update();
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [enabled, walking, phase, sceneKey, clear, update]);
  return { direction: enabled ? direction : 0, onDirectionChange, clear };
}
