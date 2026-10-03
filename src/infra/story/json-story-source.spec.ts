import { describe, expect, it } from 'vitest';
import { adaptStory } from '@/data/helpers';
import { JsonStorySource } from './json-story-source';

describe('JsonStorySource', () => {
  it('returns a story in a valid format', async () => {
    const story = adaptStory(await new JsonStorySource().get());

    expect(story.title).toBe('Como tudo começou');
  });

  it('keeps the three interactions of the script in order', async () => {
    const story = adaptStory(await new JsonStorySource().get());

    expect(
      story.scenes.flatMap((scene) => (scene.interaction ? [scene.interaction.type] : [])),
    ).toEqual(['ollie', 'walk-to', 'choice']);
  });

  it('returns a new copy on every call', async () => {
    const source = new JsonStorySource();

    expect(await source.get()).not.toBe(await source.get());
  });
});
