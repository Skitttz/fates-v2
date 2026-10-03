'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SoundPlayer } from '@/presentation/protocols';
import { PLACING_TIMELINE } from '@/presentation/story/engine/animations';
import { PLACING_MS } from '@/presentation/story/engine/constants';
import { SOUNDS } from '@/presentation/story/sounds';
import { useProgress } from '../useProgress';

type UsePlacingParams = {
  player: SoundPlayer;
  reducedMotion: boolean;
  onFinish: (choice: string) => void;
};

export function usePlacing({ player, reducedMotion, onFinish }: UsePlacingParams) {
  const [placing, setPlacing] = useState<string | null>(null);
  const placingRef = useRef<string | null>(null);
  const stampedRef = useRef(false);
  const duration = reducedMotion ? 0 : PLACING_MS;

  const cancel = useCallback((): string | null => {
    const pending = placingRef.current;
    placingRef.current = null;
    setPlacing(null);
    return pending;
  }, []);

  const finish = useCallback(() => {
    const choice = cancel();
    if (choice) onFinish(choice);
  }, [cancel, onFinish]);

  const choose = useCallback(
    (choice: string) => {
      if (placingRef.current) return;
      placingRef.current = choice;
      stampedRef.current = reducedMotion;
      setPlacing(choice);
      if (reducedMotion) player.play(SOUNDS.stickerPlace);
    },
    [player, reducedMotion],
  );

  const progress = useProgress(Boolean(placing), duration, finish);

  useEffect(() => {
    if (!placing || stampedRef.current || progress < PLACING_TIMELINE.stampEnd) return;
    stampedRef.current = true;
    player.play(SOUNDS.stickerPlace);
  }, [placing, player, progress]);

  return { placing, progress, choose, cancel };
}
