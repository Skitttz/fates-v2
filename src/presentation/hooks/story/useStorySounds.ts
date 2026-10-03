'use client';

import { useEffect, useRef } from 'react';
import { StoryTransition, StoryWorld } from '@/domain/models';
import { SoundPlayer } from '@/presentation/protocols';
import {
  BLIP_VOLUME,
  blipRate,
  EFFECT_SOUNDS,
  musicChange,
  musicFor,
  shouldBlip,
  SOUNDS,
  transitionSound,
} from '@/presentation/story/sounds';

type UseStorySoundsParams = {
  player: SoundPlayer;
  world: StoryWorld;
  rolling: boolean;
  transition: StoryTransition | null;
  sceneIndex: number;
  speaker: string | null;
  typedCount: number;
  typing: boolean;
};

export function useStorySounds({
  player,
  world,
  rolling,
  transition,
  sceneIndex,
  speaker,
  typedCount,
  typing,
}: UseStorySoundsParams): void {
  const previousWorldRef = useRef<StoryWorld | null>(null);

  useEffect(() => {
    player.preload(EFFECT_SOUNDS);
  }, [player]);

  useEffect(() => {
    player.playMusic(musicFor(world), musicChange(previousWorldRef.current, world));
    previousWorldRef.current = world;
  }, [player, world]);

  useEffect(() => () => player.stopMusic(), [player]);

  useEffect(() => {
    if (!rolling) return;
    player.loop(SOUNDS.skateRoll);
    return () => player.stopLoop(SOUNDS.skateRoll);
  }, [player, rolling]);

  useEffect(() => {
    if (!transition) return;
    const cue = transitionSound(transition);
    if (cue) player.play(cue.id, { volume: cue.volume });
  }, [player, sceneIndex, transition]);

  useEffect(() => {
    if (!typing || !shouldBlip(typedCount)) return;
    player.play(SOUNDS.textBlip, { rate: blipRate(speaker), volume: BLIP_VOLUME });
  }, [player, speaker, typedCount, typing]);
}
