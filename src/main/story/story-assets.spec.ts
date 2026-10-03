import { describe, expect, it } from 'vitest';
import { BACKDROPS } from '@/presentation/story/engine/backdrops';
import { STORY_PHOTOS } from '@/presentation/story/photos';
import { SPEAKER_NAMES } from '@/presentation/story/speakers';
import { SPRITE_SHEETS } from '@/presentation/story/sprites';
import { makeLocalLoadStory } from '../usecases';

describe('Fates story assets', () => {
  it('has a sprite, backdrop, speaker and photo for everything the script uses', async () => {
    const story = await makeLocalLoadStory().load();

    story.scenes.forEach((scene) => {
      expect(BACKDROPS[scene.backdrop], scene.backdrop).toBeDefined();
      scene.actors.forEach((actor) => {
        expect(SPRITE_SHEETS[actor.id]?.[actor.pose], `${actor.id}:${actor.pose}`).toBeDefined();
      });
      scene.lines.forEach((line) => {
        if (line.speaker) expect(SPEAKER_NAMES[line.speaker], line.speaker).toBeDefined();
      });
      if (scene.interaction?.type === 'choice') {
        scene.interaction.options.forEach((option) => {
          expect(STORY_PHOTOS[option.photo], option.photo).toBeDefined();
        });
      }
    });
    expect(SPRITE_SHEETS.prancha?.rolando).toBeDefined();
    ['agachado', 'ollie-pop', 'ollie-ar', 'skate-andando', 'sentado', 'deitado'].forEach((pose) => {
      expect(SPRITE_SHEETS.paulo[pose], pose).toBeDefined();
    });
  });
});
