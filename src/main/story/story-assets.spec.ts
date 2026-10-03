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
    story.scenes.forEach((scene) => {
      if (scene.interaction?.type !== 'walk-to') return;
      scene.interaction.obstacles?.forEach((obstacle) => {
        expect(SPRITE_SHEETS[obstacle.id]?.padrao, obstacle.id).toBeDefined();
      });
    });
    ['agachado', 'ollie-pop', 'ollie-ar', 'skate-andando', 'sentado', 'deitado-costas'].forEach(
      (pose) => {
        expect(SPRITE_SHEETS.paulo[pose], pose).toBeDefined();
      },
    );
  });
});

describe('choice aftermath assets', () => {
  it('can render every destination from arrival to the last frame', async () => {
    const { aftermathScene } = await import('@/presentation/story/engine/aftermath');
    const story = await makeLocalLoadStory().load();
    story.scenes.forEach((scene) => {
      if (scene.interaction?.type !== 'choice') return;
      scene.interaction.options.forEach((option) => {
        expect(option.consequence).toBeDefined();
        [0, 0.5, 1].forEach((progress) => {
          aftermathScene(option.consequence!.place, progress).actors.forEach((actor) => {
            expect(
              SPRITE_SHEETS[actor.id]?.[actor.pose],
              `${actor.id}:${actor.pose}`,
            ).toBeDefined();
          });
        });
      });
    });
  });
});
