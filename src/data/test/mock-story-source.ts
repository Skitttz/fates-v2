import { mockStoryModel } from '@/domain/test';
import { GetStorySource } from '../protocols/story';

export class StorySourceSpy implements GetStorySource {
  callsCount = 0;
  result: unknown = mockStoryModel();
  error?: Error;

  async get(): Promise<unknown> {
    this.callsCount += 1;
    if (this.error) throw this.error;
    return this.result;
  }
}
