'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SoundPlayer } from '@/presentation/protocols';
import { OLLIE_ANIMATION_MS } from '@/presentation/story/engine/constants';
import { OllieResult } from '@/presentation/story/engine/story-reducer';
import { ollieSoundCues, SOUNDS } from '@/presentation/story/sounds';
import { OllieAnimation } from '@/presentation/story/view';
import { useProgress } from '../useProgress';

export const OLLIE_CELEBRATION_MS = 800;

type UseOllieAnimationParams = {
  player: SoundPlayer;
  reducedMotion: boolean;
  onFinish: (result: OllieResult) => void;
};

export function useOllieAnimation({ player, reducedMotion, onFinish }: UseOllieAnimationParams) {
  const [ollie, setOllie] = useState<OllieAnimation | null>(null);
  const ollieRef = useRef<OllieAnimation | null>(null);
  const cueRef = useRef(0);
  const animationMs = OLLIE_ANIMATION_MS + (ollie?.result === 'landed' ? OLLIE_CELEBRATION_MS : 0);
  const duration = reducedMotion ? 0 : animationMs;

  const playCues = useCallback(
    (result: OllieResult, progress: number) => {
      ollieSoundCues(result).forEach(({ at, sound }) => {
        if (cueRef.current < at && progress >= at) player.play(sound);
      });
      cueRef.current = progress;
    },
    [player],
  );

  const start = useCallback(
    (result: OllieResult) => {
      if (ollieRef.current) return;
      ollieRef.current = { result };
      cueRef.current = 0;
      setOllie({ result });
      player.play(SOUNDS.ollie);
    },
    [player],
  );

  const cancel = useCallback(() => {
    ollieRef.current = null;
    setOllie(null);
  }, []);

  const finish = useCallback(() => {
    const current = ollieRef.current;
    cancel();
    if (!current) return;
    playCues(current.result, 1);
    onFinish(current.result);
  }, [cancel, onFinish, playCues]);

  const progress = useProgress(Boolean(ollie), duration, finish);

  useEffect(() => {
    if (ollie) playCues(ollie.result, progress);
  }, [ollie, playCues, progress]);

  return { ollie, progress, start, cancel };
}
