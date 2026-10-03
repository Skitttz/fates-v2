import { describe, expect, it } from 'vitest';
import { makeLocalLoadStory } from './local-load-story-factory';

describe('makeLocalLoadStory', () => {
  it('loads the Fates story', async () => {
    const story = await makeLocalLoadStory().load();

    expect(story.scenes.at(-1)?.interaction?.type).toBe('choice');
  });
});
