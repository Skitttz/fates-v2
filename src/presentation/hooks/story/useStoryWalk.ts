'use client';

import { useCallback } from 'react';
import { StoryActorModel } from '@/domain/models';
import { SoundPlayer } from '@/presentation/protocols';
import { SOUNDS, WALK_SOUND_VOLUME } from '@/presentation/story/sounds';
import { WalkInteraction } from '@/presentation/story/view';
import { useWalk } from '../useWalk';
import { useWalkDirection } from './useWalkDirection';
import { useWalkIntro } from './useWalkIntro';

type UseStoryWalkParams = {
  player: SoundPlayer;
  walk: WalkInteraction | undefined;
  actor: StoryActorModel | undefined;
  walkKey: string | null;
  enabled: boolean;
  reducedMotion: boolean;
  onArrive: () => void;
};

export function useStoryWalk({
  player,
  walk,
  actor,
  walkKey,
  enabled,
  reducedMotion,
  onArrive,
}: UseStoryWalkParams) {
  const [direction, steer] = useWalkDirection();
  const steering = direction !== 0;
  const onWalk = Boolean(walk && actor);
  const { released, visible, dismiss } = useWalkIntro(walkKey, reducedMotion, steering);

  const arrive = useCallback(() => {
    steer(0);
    player.play(SOUNDS.stickerFound);
    onArrive();
  }, [onArrive, player, steer]);

  const playJump = useCallback(
    () => player.play(SOUNDS.ollie, { volume: WALK_SOUND_VOLUME }),
    [player],
  );

  const playLanding = useCallback(
    () => player.play(SOUNDS.landing, { volume: WALK_SOUND_VOLUME }),
    [player],
  );

  const position = useWalk({
    active: onWalk && released && enabled,
    startX: actor?.x ?? 0,
    targetX: walk?.targetX ?? 0,
    direction,
    obstacles: walk?.obstacles,
    resetKey: walkKey,
    onArrive: arrive,
    onJump: playJump,
    onLand: playLanding,
    onBump: () => player.play(SOUNDS.fall, { volume: 0.25, rate: 1.4 }),
  });
  const { jump: leap, getSnapshot } = position;
  const getWalkFrame = useCallback(
    () =>
      walk && actor ? { actor: walk.actor, groundY: actor.y, state: getSnapshot() } : undefined,
    [walk, actor, getSnapshot],
  );

  const jump = useCallback(() => {
    if (!released) return;
    leap();
    dismiss();
  }, [dismiss, leap, released]);

  return {
    steer,
    jump,
    introVisible: visible,
    rolling: enabled && onWalk && position.rolling,
    bumps: position.bumps,
    getWalkFrame,
  };
}
