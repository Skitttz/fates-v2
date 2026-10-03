'use client';

import { useEffect } from 'react';
import {
  isActionKey,
  isArrowKey,
  isFromInteractiveElement,
  isJumpKey,
  walkDirectionFor,
} from '@/presentation/story/keyboard';
import { WalkDirection } from '../useWalk';

type UseStoryKeyboardParams = {
  active: boolean;
  holding: boolean;
  walking: boolean;
  dialogue: boolean;
  onDirection: (direction: WalkDirection) => void;
  onJump: () => void;
  onAdvance: () => void;
};

export function useStoryKeyboard({
  active,
  holding,
  walking,
  dialogue,
  onDirection,
  onJump,
  onAdvance,
}: UseStoryKeyboardParams): void {
  useEffect(() => {
    if (!active) return;

    const handleWalkKey = (event: KeyboardEvent) => {
      if (event.key === ' ' && isFromInteractiveElement(event)) return;
      event.preventDefault();
      if (isArrowKey(event)) {
        onDirection(walkDirectionFor(event));
        return;
      }
      if (!event.repeat) onJump();
    };

    const handleDialogueKey = (event: KeyboardEvent) => {
      if (!dialogue || !isActionKey(event) || isFromInteractiveElement(event)) return;
      event.preventDefault();
      if (!event.repeat) onAdvance();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!holding) return;
      const walkKey = walking && (isArrowKey(event) || isJumpKey(event));
      if (walkKey) handleWalkKey(event);
      else handleDialogueKey(event);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isArrowKey(event)) onDirection(0);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [active, dialogue, holding, onAdvance, onDirection, onJump, walking]);
}
