import { isStickerPlace, StoryMemoryModel } from '@/domain/models/story-memory-model';
import { LoadStoryMemory, SaveStoryMemory } from '@/domain/usecases/story-memory';
import { GetStorage, SetStorage } from '@/data/protocols/cache';

export class LocalStoryMemory implements LoadStoryMemory, SaveStoryMemory {
  constructor(
    private readonly storage: GetStorage & SetStorage,
    private readonly key: string,
  ) {}

  load(): StoryMemoryModel | null {
    const value = this.storage.get<unknown>(this.key);
    if (!value || typeof value !== 'object') return null;
    const saved = value as Record<string, unknown>;
    if (
      saved.version !== 1 ||
      typeof saved.storyId !== 'string' ||
      !saved.storyId.trim() ||
      !isStickerPlace(saved.place) ||
      typeof saved.ollieLanded !== 'boolean'
    )
      return null;
    return { storyId: saved.storyId, place: saved.place, ollieLanded: saved.ollieLanded };
  }

  save(memory: StoryMemoryModel): void {
    this.storage.set(this.key, { version: 1, ...memory });
  }
}
