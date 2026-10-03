import { describe, expect, it } from 'vitest';
import { UnexpectedError } from '@/domain/errors';
import { mockStoryModel } from '@/domain/test';
import { adaptStory } from './story-adapter';

const withFirstScene = (patch: Record<string, unknown>) => {
  const story = mockStoryModel();
  return { ...story, scenes: [{ ...story.scenes[0], ...patch }] };
};

describe('adaptStory', () => {
  it('returns the story when the format is valid', () => {
    const story = mockStoryModel();

    expect(adaptStory(JSON.parse(JSON.stringify(story)))).toEqual(story);
  });

  it.each([
    ['a non object', 'story'],
    ['a story without scenes', { ...mockStoryModel(), scenes: [] }],
    ['an unknown world', withFirstScene({ world: 'space' })],
    ['an unknown transition', withFirstScene({ transitionIn: 'zoom' })],
    ['a line without text', withFirstScene({ lines: [{ speaker: 'paulo', text: '' }] })],
    ['a line without speaker', withFirstScene({ lines: [{ text: 'Oi' }] })],
    ['an actor without position', withFirstScene({ actors: [{ id: 'paulo', pose: 'skate' }] })],
    ['an unknown interaction', withFirstScene({ interaction: { type: 'fly' } })],
    [
      'a choice without options',
      withFirstScene({ interaction: { type: 'choice', prompt: 'Onde?', options: [] } }),
    ],
  ])('throws UnexpectedError for %s', (_, raw) => {
    expect(() => adaptStory(raw)).toThrow(UnexpectedError);
  });
});

describe('adaptStory walk validation', () => {
  it('rejects a walk whose actor is not in the scene', () => {
    const story = mockStoryModel();
    const raw = {
      ...story,
      scenes: [
        { ...story.scenes[1], interaction: { type: 'walk-to', actor: 'urso', targetX: 150 } },
      ],
    };

    expect(() => adaptStory(raw)).toThrow(UnexpectedError);
  });
});

describe('adaptStory conditions and outcomes', () => {
  it('keeps line conditions and choice outcomes', () => {
    const story = mockStoryModel();
    const raw = JSON.parse(JSON.stringify(story));
    raw.scenes[0].lines[0].when = { ollie: 'landed' };

    const adapted = adaptStory(raw);

    expect(adapted.scenes[0].lines[0].when).toEqual({ ollie: 'landed' });
    expect(adapted.scenes[0].lines[1]).not.toHaveProperty('when');
    const choice = adapted.scenes[2].interaction;
    expect(choice?.type === 'choice' && choice.options[0].outcome).toBe('Any caixote outcome');
  });

  it.each([
    ['an unknown ollie condition', { ollie: 'flip' }],
    ['a condition that is not an object', 'landed'],
  ])('rejects %s', (_, when) => {
    const raw = JSON.parse(JSON.stringify(mockStoryModel()));
    raw.scenes[0].lines[0].when = when;

    expect(() => adaptStory(raw)).toThrow(UnexpectedError);
  });

  it('rejects a choice option without outcome', () => {
    const raw = JSON.parse(JSON.stringify(mockStoryModel()));
    delete raw.scenes[2].interaction.options[0].outcome;

    expect(() => adaptStory(raw)).toThrow(UnexpectedError);
  });
});
