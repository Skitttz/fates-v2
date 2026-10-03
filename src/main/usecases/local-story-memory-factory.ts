import { LocalStoryMemory } from '@/data/usecases/story/local-story-memory';
import { makeLocalStorageAdapter } from '../cache';
import { STORAGE_KEYS } from '../config/storage-keys';

export const makeLocalStoryMemory = () =>
  new LocalStoryMemory(makeLocalStorageAdapter(), STORAGE_KEYS.STORY_MEMORY);
