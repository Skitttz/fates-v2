import { describe, expect, it } from 'vitest';
import { mockStoryModel } from '@/domain/test';
import { StoryState } from './engine/story-reducer';
import { lineAnnouncement, nextMode, sceneTransition, storyEffect, storyMoment } from './view';

describe('story view', () => {
  it('prefers the placing effect over the ollie and returns null without any', () => {
    const ollie = { result: 'landed' as const };

    expect(
      storyEffect({ placing: 'poste', placingProgress: 0.4, ollie, ollieProgress: 0.9 }),
    ).toEqual({ type: 'placing', progress: 0.4 });
    expect(storyEffect({ placing: null, placingProgress: 0, ollie, ollieProgress: 0.9 })).toEqual({
      type: 'ollie',
      progress: 0.9,
      result: 'landed',
    });
    expect(
      storyEffect({ placing: null, placingProgress: 0, ollie: null, ollieProgress: 0 }),
    ).toBeNull();
  });

  it('describes the scene transition only during the transition phase', () => {
    const scene = mockStoryModel().scenes[1];

    expect(sceneTransition('transition', scene, 0.5)).toEqual({
      kind: 'fade-to-dream',
      progress: 0.5,
    });
    expect(sceneTransition('dialogue', scene, 0.5)).toBeNull();
    expect(sceneTransition('transition', { ...scene, transitionIn: undefined }, 0.5)).toBeNull();
  });

  it('announces the current line only in game mode', () => {
    expect(lineAnnouncement('game', { speaker: 'urso', text: 'Oi' })).toBe('Ursinho: Oi');
    expect(lineAnnouncement('game', { speaker: null, text: 'Aracaju.' })).toBe('Aracaju.');
    expect(lineAnnouncement('text', { speaker: 'urso', text: 'Oi' })).toBe('');
    expect(lineAnnouncement('game', null)).toBe('');
  });

  it('toggles between game and text', () => {
    expect(nextMode('game')).toBe('text');
    expect(nextMode('text')).toBe('game');
  });

  it('describes the current moment of the story', () => {
    const story = mockStoryModel();
    const at = (patch: Partial<StoryState>): StoryState => ({
      sceneIndex: 0,
      lineIndex: 0,
      phase: 'interaction',
      choice: null,
      ollieResult: null,
      ...patch,
    });

    const dialogue = storyMoment(story, at({ phase: 'dialogue', lineIndex: 1 }));
    expect(dialogue).toMatchObject({
      scene: story.scenes[0],
      line: { text: 'Any line' },
      speaker: 'paulo',
      inDialogue: true,
      ended: false,
      awaitsOllie: false,
      walkKey: null,
    });

    expect(storyMoment(story, at({}))).toMatchObject({ awaitsOllie: true, line: null });

    const walking = storyMoment(story, at({ sceneIndex: 1 }));
    expect(walking.walk).toBe(story.scenes[1].interaction);
    expect(walking.walkActor).toBe(story.scenes[1].actors[0]);
    expect(walking.walkKey).toBe('1');

    const choosing = storyMoment(story, at({ sceneIndex: 2 }));
    expect(choosing.choice).toBe(story.scenes[2].interaction);
    expect(choosing.walk).toBeUndefined();

    expect(storyMoment(story, at({ sceneIndex: 2, phase: 'transition' }))).toMatchObject({
      inTransition: true,
      choice: undefined,
    });
    expect(storyMoment(story, at({ sceneIndex: 2, phase: 'ending' }))).toMatchObject({
      ended: true,
      choice: undefined,
      speaker: null,
    });
  });
});
