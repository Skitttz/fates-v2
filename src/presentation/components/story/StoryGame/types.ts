import { StoryModel } from '@/domain/models';
import { OllieResult } from '@/presentation/story/engine/story-reducer';

export interface StoryGameProps {
  story: StoryModel;
}

export type OllieAnimation = { result: OllieResult };
