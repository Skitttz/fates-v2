import { UnexpectedError } from '@/domain/errors';
import { LoadStory } from '@/domain/usecases';
import { adaptStory } from '../../helpers';
import { GetStorySource } from '../../protocols/story';

export class LocalLoadStory implements LoadStory {
  constructor(private readonly source: GetStorySource) {}

  async load(): Promise<LoadStory.Model> {
    let raw: unknown;
    try {
      raw = await this.source.get();
    } catch {
      throw new UnexpectedError();
    }
    return adaptStory(raw);
  }
}
