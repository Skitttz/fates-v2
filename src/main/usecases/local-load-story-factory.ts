import { LocalLoadStory } from '@/data/usecases';
import { LoadStory } from '@/domain/usecases';
import { makeJsonStorySource } from '../story';

export const makeLocalLoadStory = (): LoadStory => new LocalLoadStory(makeJsonStorySource());
