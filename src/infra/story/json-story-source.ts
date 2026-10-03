import { GetStorySource } from '@/data/protocols/story';
import story from './fates-story.json';

export class JsonStorySource implements GetStorySource {
  async get(): Promise<unknown> {
    return structuredClone(story);
  }
}
