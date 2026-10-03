import {
  StoryActorModel,
  StoryInteractionModel,
  StoryLineModel,
  StoryModel,
  StorySceneModel,
} from '@/domain/models';
import {
  getCurrentLine,
  getCurrentScene,
  OllieResult,
  StoryPhase,
  StoryState,
} from './engine/story-reducer';
import { SceneTransitionState, StoryEffect } from './engine/types';
import { getSpeakerName } from './speakers';

export type StoryMode = 'game' | 'text';

export type OllieAnimation = { result: OllieResult };

export type WalkMotion = { airborne: boolean; rising: boolean };

export type WalkPosition = WalkMotion & { x: number; y: number };

export type WalkInteraction = Extract<StoryInteractionModel, { type: 'walk-to' }>;

type EffectParams = {
  placing: string | null;
  placingProgress: number;
  ollie: OllieAnimation | null;
  ollieProgress: number;
};

export const storyMoment = (story: StoryModel, state: StoryState) => {
  const scene = getCurrentScene(story, state);
  const line = getCurrentLine(story, state);
  const interaction = state.phase === 'interaction' ? scene.interaction : undefined;
  const walk = interaction?.type === 'walk-to' ? interaction : undefined;
  const choice = interaction?.type === 'choice' ? interaction : undefined;

  return {
    scene,
    line,
    walk,
    choice,
    walkActor: walk ? scene.actors.find(({ id }) => id === walk.actor) : undefined,
    walkKey: walk ? String(state.sceneIndex) : null,
    speaker: line?.speaker ?? null,
    awaitsOllie: interaction?.type === 'ollie',
    inDialogue: state.phase === 'dialogue',
    inTransition: state.phase === 'transition',
    ended: state.phase === 'ending',
  };
};

export type StoryMoment = ReturnType<typeof storyMoment>;

export const walkPose = (motion: WalkMotion, direction: number): string => {
  if (motion.airborne) return motion.rising ? 'ollie-pop' : 'ollie-ar';
  return direction === 0 ? 'skate' : 'skate-andando';
};

export const storyEffect = ({
  placing,
  placingProgress,
  ollie,
  ollieProgress,
}: EffectParams): StoryEffect | null => {
  if (placing) return { type: 'placing', progress: placingProgress };
  if (ollie) return { type: 'ollie', progress: ollieProgress, result: ollie.result };
  return null;
};

export const sceneTransition = (
  phase: StoryPhase,
  scene: StorySceneModel,
  progress: number,
): SceneTransitionState | null => {
  if (phase !== 'transition' || !scene.transitionIn) return null;
  return { kind: scene.transitionIn, progress };
};

export const walkOverrides = (
  walk: WalkInteraction | undefined,
  actor: StoryActorModel | undefined,
  walking: WalkPosition,
  direction: number,
): Record<string, Partial<StoryActorModel>> | undefined => {
  if (!walk || !actor) return undefined;
  return {
    [walk.actor]: {
      x: walking.x,
      y: actor.y - Math.round(walking.y),
      pose: walkPose(walking, direction),
    },
  };
};

export const lineAnnouncement = (mode: StoryMode, line: StoryLineModel | null): string => {
  if (mode !== 'game' || !line) return '';
  return [getSpeakerName(line.speaker), line.text].filter(Boolean).join(': ');
};

export const nextMode = (mode: StoryMode): StoryMode => (mode === 'game' ? 'text' : 'game');
