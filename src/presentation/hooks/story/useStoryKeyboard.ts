'use client';

import { useEffect, useRef } from 'react';
import { useStoryInput } from '../useStoryInput';
import { WalkDirection } from '../useWalk';

type UseStoryKeyboardParams = {
  active: boolean;
  holding: boolean;
  walking: boolean;
  dialogue: boolean;
  sceneKey?: string;
  onDirection: (direction: WalkDirection) => void;
  onJump: () => void;
  onAdvance: () => void;
};

export function useStoryKeyboard({
  active,
  holding,
  walking,
  dialogue,
  sceneKey = '',
  onDirection,
  onJump,
  onAdvance,
}: UseStoryKeyboardParams) {
  const input = useStoryInput({
    enabled: active && holding,
    walking,
    phase: dialogue ? 'dialogue' : 'interaction',
    sceneKey,
    onJump,
    onAdvance,
  });
  const previousDirection = useRef<WalkDirection>(0);
  useEffect(() => {
    if (previousDirection.current === input.direction) return;
    previousDirection.current = input.direction;
    onDirection(input.direction);
  }, [input.direction, onDirection]);
  return input;
}
