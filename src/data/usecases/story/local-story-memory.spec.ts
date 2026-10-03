import { describe, expect, it } from 'vitest';
import { StorageSpy } from '@/data/test/mock-storage';
import { LocalStoryMemory } from './local-story-memory';

const memory = { storyId: 'como-tudo-comecou', place: 'poste' as const, ollieLanded: true };

describe('LocalStoryMemory', () => {
  it('saves a versioned memory that survives a new instance', () => {
    const storage = new StorageSpy();
    new LocalStoryMemory(storage, 'memory').save(memory);
    expect(storage.get('memory')).toEqual({ version: 1, ...memory });
    expect(new LocalStoryMemory(storage, 'memory').load()).toEqual(memory);
  });

  it.each([
    null,
    'invalid',
    {},
    { version: 2, ...memory },
    { version: 1, ...memory, place: 'lua' },
    { version: 1, ...memory, storyId: '' },
    { version: 1, ...memory, ollieLanded: 'true' },
  ])('ignores unsupported or malformed storage: %j', (value) => {
    const storage = new StorageSpy();
    storage.set('memory', value);
    expect(new LocalStoryMemory(storage, 'memory').load()).toBeNull();
  });
});
