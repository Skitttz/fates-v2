import { StoryLineModel, StoryModel, StorySceneModel } from '@/domain/models';

export type StoryPhase = 'dialogue' | 'interaction' | 'transition' | 'ending';

export type OllieResult = 'landed' | 'missed';

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
  | { type: 'SKIP' }
  | { type: 'RESTART' };

const scenePhase = (scene: StorySceneModel): StoryPhase | null => {
  if (scene.lines.length > 0) return 'dialogue';
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

  const phase = scenePhase(scene);
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
        if (state.lineIndex + 1 < scene.lines.length) {
          return { ...state, lineIndex: state.lineIndex + 1 };
        }
        if (scene.interaction) return { ...state, phase: 'interaction' };
        return enterScene(story, state, state.sceneIndex + 1);

      case 'COMPLETE_INTERACTION':
        if (state.phase !== 'interaction') return state;
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
        const phase = scenePhase(scene);
        return phase ? { ...state, phase } : enterScene(story, state, state.sceneIndex + 1);
      }

      case 'SKIP':
        return toEnding(story, state);

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
    ? (story.scenes[state.sceneIndex].lines[state.lineIndex] ?? null)
    : null;
