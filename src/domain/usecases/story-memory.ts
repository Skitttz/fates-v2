import { StoryMemoryModel } from '../models/story-memory-model';

export interface LoadStoryMemory {
  load: () => StoryMemoryModel | null;
}
export interface SaveStoryMemory {
  save: (memory: StoryMemoryModel) => void;
}
