export type StoryWorld = 'real' | 'dream';

export type StoryTransition = 'cut' | 'fade-to-dream' | 'flash-to-real';

export type StoryActorModel = {
  id: string;
  x: number;
  y: number;
  pose: string;
};

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
};

export type StoryInteractionModel =
  | { type: 'ollie' }
  | { type: 'walk-to'; actor: string; targetX: number }
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
