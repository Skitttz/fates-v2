import {
  StoryActorModel,
  StoryOllieResult,
  StorySceneModel,
  StoryTransition,
} from '@/domain/models';

export type OllieEffect = { type: 'ollie'; progress: number; result: StoryOllieResult };

export type PlacingEffect = { type: 'placing'; progress: number };

export type StoryEffect = OllieEffect | PlacingEffect;

export type SceneTransitionState = { kind: StoryTransition; progress: number };

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
};

export type RenderInput = {
  scene: StorySceneModel;
  timeMs: number;
  sceneTimeMs: number;
  animated: boolean;
  speaker?: string | null;
  actorOverrides?: Readonly<Record<string, Partial<StoryActorModel>>>;
  effect?: StoryEffect | null;
  transition?: SceneTransitionState | null;
  particles?: readonly Particle[];
};
