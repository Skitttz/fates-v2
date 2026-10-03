import { StickerPlace } from './story-memory-model';

export type StoryWorld = 'real' | 'dream';

export type StoryTransition = 'cut' | 'fade-to-dream' | 'flash-to-real';

export type StoryActorEntrance = 'materialize';

export type StoryActorModel = {
  id: string;
  x: number;
  y: number;
  pose: string;
  entrance?: StoryActorEntrance;
};

export type StoryObstacleModel = { id: string; x: number };

export type StoryOllieResult = 'landed' | 'missed';

export type StoryCondition = { ollie: StoryOllieResult };

export type StoryLineModel = {
  speaker: string | null;
  text: string;
  when?: StoryCondition;
};

export type StoryChoiceOptionModel = {
  id: string;
  label: string;
  photo: string;
  outcome: string;
  consequence?: { title: string; text: string; place: StickerPlace };
};

export type StoryInteractionModel =
  | { type: 'ollie' }
  | { type: 'walk-to'; actor: string; targetX: number; obstacles?: StoryObstacleModel[] }
  | { type: 'choice'; prompt: string; options: StoryChoiceOptionModel[] };

export type StorySceneModel = {
  id: string;
  world: StoryWorld;
  backdrop: string;
  actors: StoryActorModel[];
  lines: StoryLineModel[];
  interaction?: StoryInteractionModel;
  transitionIn?: StoryTransition;
};

export type StoryModel = {
  id: string;
  title: string;
  scenes: StorySceneModel[];
  epilogue: string;
};
