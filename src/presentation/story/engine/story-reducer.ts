import { StoryLineModel, StoryModel, StoryOllieResult, StorySceneModel } from '@/domain/models';

export type StoryPhase = 'dialogue' | 'interaction' | 'transition' | 'aftermath' | 'ending';

export type OllieResult = StoryOllieResult;

export type StoryState = {
  sceneIndex: number;
  lineIndex: number;
  phase: StoryPhase;
  choice: string | null;
  ollieResult: OllieResult | null;
};

export type StoryAction =
  | { type: 'NEXT_LINE' }
  | { type: 'COMPLETE_INTERACTION'; choice?: string; ollieResult?: OllieResult }
  | { type: 'TRANSITION_END' }
  | { type: 'AFTERMATH_END' }
  | { type: 'SKIP'; choice?: string }
  | { type: 'RESTART' };

export const visibleLines = (
  scene: StorySceneModel,
  state: Pick<StoryState, 'ollieResult'>,
): StoryLineModel[] => scene.lines.filter(({ when }) => !when || when.ollie === state.ollieResult);

const scenePhase = (scene: StorySceneModel, state: StoryState): StoryPhase | null => {
  if (visibleLines(scene, state).length > 0) return 'dialogue';
  if (scene.interaction) return 'interaction';
  return null;
};

const toEnding = (story: StoryModel, state: StoryState): StoryState => ({
  ...state,
  sceneIndex: story.scenes.length - 1,
  lineIndex: 0,
  phase: 'ending',
});

const enterScene = (story: StoryModel, state: StoryState, sceneIndex: number): StoryState => {
  const scene = story.scenes[sceneIndex];
  if (!scene) return toEnding(story, state);

  if (scene.transitionIn && scene.transitionIn !== 'cut') {
    return { ...state, sceneIndex, lineIndex: 0, phase: 'transition' };
  }

  const phase = scenePhase(scene, state);
  return phase
    ? { ...state, sceneIndex, lineIndex: 0, phase }
    : enterScene(story, state, sceneIndex + 1);
};

export const createInitialState = (story: StoryModel): StoryState =>
  enterScene(
    story,
    { sceneIndex: 0, lineIndex: 0, phase: 'dialogue', choice: null, ollieResult: null },
    0,
  );

export const createStoryReducer =
  (story: StoryModel) =>
  (state: StoryState, action: StoryAction): StoryState => {
    const scene = story.scenes[state.sceneIndex];

    switch (action.type) {
      case 'NEXT_LINE':
        if (state.phase !== 'dialogue') return state;
        if (state.lineIndex + 1 < visibleLines(scene, state).length) {
          return { ...state, lineIndex: state.lineIndex + 1 };
        }
        if (scene.interaction) return { ...state, phase: 'interaction' };
        return enterScene(story, state, state.sceneIndex + 1);

      case 'COMPLETE_INTERACTION':
        if (state.phase !== 'interaction') return state;
        if (
          scene.interaction?.type === 'choice' &&
          scene.interaction.options.some(
            (option) => option.id === action.choice && option.consequence,
          )
        ) {
          return { ...state, phase: 'aftermath', choice: action.choice ?? state.choice };
        }
        return enterScene(
          story,
          {
            ...state,
            choice: action.choice ?? state.choice,
            ollieResult: action.ollieResult ?? state.ollieResult,
          },
          state.sceneIndex + 1,
        );

      case 'TRANSITION_END': {
        if (state.phase !== 'transition') return state;
        const phase = scenePhase(scene, state);
        return phase ? { ...state, phase } : enterScene(story, state, state.sceneIndex + 1);
      }

      case 'AFTERMATH_END':
        return state.phase === 'aftermath' ? enterScene(story, state, state.sceneIndex + 1) : state;

      case 'SKIP':
        return toEnding(story, { ...state, choice: action.choice ?? state.choice });

      case 'RESTART':
        return createInitialState(story);

      default:
        return state;
    }
  };

export const getCurrentScene = (story: StoryModel, state: StoryState): StorySceneModel =>
  story.scenes[state.sceneIndex];

export const getCurrentLine = (story: StoryModel, state: StoryState): StoryLineModel | null =>
  state.phase === 'dialogue'
    ? (visibleLines(story.scenes[state.sceneIndex], state)[state.lineIndex] ?? null)
    : null;

export const choiceOutcome = (
  story: StoryModel,
  state: Pick<StoryState, 'choice'>,
): string | null => {
  return choiceOption(story, state.choice)?.outcome ?? null;
};

export const choiceOption = (story: StoryModel, choice: string | null) => {
  if (!choice) return null;
  for (const scene of story.scenes) {
    if (scene.interaction?.type !== 'choice') continue;
    const option = scene.interaction.options.find(({ id }) => id === choice);
    if (option) return option;
  }
  return null;
};
