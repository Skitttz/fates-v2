'use client';

import { useEffect } from 'react';
import { StoryModel } from '@/domain/models';
import { isStickerPlace } from '@/domain/models/story-memory-model';
import { useStoryMemory } from '@/presentation/contexts/story-memory';
import { choiceOption, StoryState } from '@/presentation/story/engine/story-reducer';

export function useStoryDestination(story: StoryModel, state: StoryState) {
  const { memory, remember } = useStoryMemory();
  const option = choiceOption(story, state.choice);
  const place = option?.consequence?.place ?? option?.photo;
  const ollieLanded = state.ollieResult === 'landed';
  useEffect(() => {
    if ((state.phase !== 'ending' && state.phase !== 'aftermath') || !isStickerPlace(place)) return;
    if (
      memory?.storyId === story.id &&
      memory.place === place &&
      memory.ollieLanded === ollieLanded
    )
      return;
    remember({ storyId: story.id, place, ollieLanded });
  }, [state.phase, place, story.id, ollieLanded, memory, remember]);
  return state.phase === 'aftermath' ? option?.consequence : undefined;
}
