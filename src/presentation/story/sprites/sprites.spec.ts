import { describe, expect, it, vi } from 'vitest';
import { SPRITE_SHEETS } from '.';
import { createSpriteCache, CreateCanvas, getSpriteFrame, TRANSPARENT_PIXEL } from './sprite-cache';

const fakeCanvas: CreateCanvas = (width, height) =>
  ({
    width,
    height,
    getContext: () => ({ fillStyle: '', fillRect: vi.fn() }),
  }) as unknown as HTMLCanvasElement;

const poses = Object.entries(SPRITE_SHEETS).flatMap(([actor, sheet]) =>
  Object.entries(sheet).map(([pose, definition]) => ({ actor, pose, definition })),
);

describe('sprites', () => {
  it.each(poses)('$actor:$pose has rectangular frames using only its palette', ({ definition }) => {
    definition.frames.forEach((frame) => {
      const width = frame[0].length;
      frame.forEach((row) => {
        expect(row.length).toBe(width);
        row.split('').forEach((pixel) => {
          expect(pixel === TRANSPARENT_PIXEL || pixel in definition.palette).toBe(true);
        });
      });
    });
  });

  it('caches every pose and cycles animated frames by fps', () => {
    const cache = createSpriteCache(SPRITE_SHEETS, fakeCanvas);

    expect(cache.size).toBe(poses.length);
    const first = getSpriteFrame(cache, 'paulo', 'skate', 0);
    const second = getSpriteFrame(cache, 'paulo', 'skate', 1000 / 6);
    expect(first).not.toBe(second);
  });

  it('holds the last frame of a sprite that does not loop', () => {
    const cache = createSpriteCache(SPRITE_SHEETS, fakeCanvas);
    const frames = cache.get('paulo:levantando')?.frames ?? [];

    expect(frames).toHaveLength(3);
    expect(getSpriteFrame(cache, 'paulo', 'levantando', 0)).toBe(frames[0]);
    expect(getSpriteFrame(cache, 'paulo', 'levantando', 60_000)).toBe(frames[2]);
  });

  it('makes the bear blink and look to both sides', () => {
    const cache = createSpriteCache(SPRITE_SHEETS, fakeCanvas);

    ['parado', 'parado-esquerda', 'parado-direita', 'sorrindo-esquerda', 'sorrindo-direita'].forEach(
      (pose) => {
        const open = getSpriteFrame(cache, 'urso', pose, 0);
        const blink = getSpriteFrame(cache, 'urso', pose, 2900);
        expect(open, pose).not.toBe(blink);
      },
    );
  });

  it('returns null for unknown actors or poses', () => {
    const cache = createSpriteCache(SPRITE_SHEETS, fakeCanvas);

    expect(getSpriteFrame(cache, 'ghost', 'parado', 0)).toBeNull();
    expect(getSpriteFrame(cache, 'paulo', 'voando', 0)).toBeNull();
  });

  it('skips frames when a canvas cannot be created', () => {
    expect(createSpriteCache(SPRITE_SHEETS, () => null).size).toBe(0);
  });
});
