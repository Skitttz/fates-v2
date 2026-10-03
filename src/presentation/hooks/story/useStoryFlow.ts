'use client';

import { useMemo, useReducer } from 'react';
import { StoryModel } from '@/domain/models';
import {
  createInitialState,
  createStoryReducer,
  OllieResult,
} from '@/presentation/story/engine/story-reducer';
import { storyMoment } from '@/presentation/story/view';

export function useStoryFlow(story: StoryModel) {
  const reducer = useMemo(() => createStoryReducer(story), [story]);
  const [state, dispatch] = useReducer(reducer, story, createInitialState);
  const moment = storyMoment(story, state);

  const actions = useMemo(
    () => ({
      nextLine: () => dispatch({ type: 'NEXT_LINE' }),
      completeWalk: () => dispatch({ type: 'COMPLETE_INTERACTION' }),
      finishOllie: (ollieResult: OllieResult) =>
        dispatch({ type: 'COMPLETE_INTERACTION', ollieResult }),
      finishPlacing: (choice: string) => dispatch({ type: 'COMPLETE_INTERACTION', choice }),
      endTransition: () => dispatch({ type: 'TRANSITION_END' }),
      endAftermath: () => dispatch({ type: 'AFTERMATH_END' }),
      skip: (choice?: string) => dispatch({ type: 'SKIP', choice }),
      restart: () => dispatch({ type: 'RESTART' }),
    }),
    [],
  );

  return { state, moment, actions };
}
