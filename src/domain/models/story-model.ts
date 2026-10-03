export type StoryWorld = 'real' | 'dream';

export type StoryTransition = 'cut' | 'fade-to-dream' | 'flash-to-real';

export type StoryActorModel = {
  id: string;
  x: number;
  y: number;
  pose: string;
};

export type StoryLineModel = {
  speaker: string | null;
  text: string;
};

export type StoryChoiceOptionModel = {
  id: string;
  label: string;
  photo: string;
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
