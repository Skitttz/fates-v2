'use client';

import { StorySceneModel } from '@/domain/models';
import { TRANSITION_MS } from '@/presentation/story/engine/constants';
import { StoryPhase } from '@/presentation/story/engine/story-reducer';
import { SceneTransitionState } from '@/presentation/story/engine/types';
import { sceneTransition } from '@/presentation/story/view';
import { useProgress } from '../useProgress';

type UseSceneTransitionParams = {
  phase: StoryPhase;
  scene: StorySceneModel;
  sceneIndex: number;
  reducedMotion: boolean;
  onEnd: () => void;
};

export function useSceneTransition({
  phase,
  scene,
  sceneIndex,
  reducedMotion,
  onEnd,
}: UseSceneTransitionParams): SceneTransitionState | null {
  const duration = reducedMotion ? 0 : TRANSITION_MS;
  const progress = useProgress(phase === 'transition', duration, onEnd, sceneIndex);

  return sceneTransition(phase, scene, progress);
}
