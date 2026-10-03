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

    [
      'parado',
      'parado-esquerda',
      'parado-direita',
      'sorrindo-esquerda',
      'sorrindo-direita',
    ].forEach((pose) => {
      const open = getSpriteFrame(cache, 'urso', pose, 0);
      const blink = getSpriteFrame(cache, 'urso', pose, 2900);
      expect(open, pose).not.toBe(blink);
    });
  });

  it('lays paulo on his back with the head to the left', () => {
    const frame = SPRITE_SHEETS.paulo['deitado-costas'].frames[0];
    const standing = SPRITE_SHEETS.paulo.parado.frames[0];

    expect(frame).toHaveLength(standing[0].length);
    expect(frame[0]).toHaveLength(standing.length);
    expect(SPRITE_SHEETS.paulo).not.toHaveProperty('deitado');
    expect(frame.map((row) => row[0]).join('')).toContain('k');
  });

  it('draws the bear from the sticker: pink face, cap, crying red eyes', () => {
    const { palette, frames } = SPRITE_SHEETS.urso.chorando;
    const pixels = frames[0].join('');

    expect(Object.values(palette)).toEqual(
      expect.arrayContaining(['#f472b6', '#e8c9a0', '#dc2626', '#ef4444', '#c084fc']),
    );
    ['p', 'c', 'r', 't', 'l'].forEach((key) => expect(pixels).toContain(key));
    expect(frames[0]).not.toEqual(frames[1]);
  });

  it('settles sprites when there is no animation', () => {
    const cache = createSpriteCache(SPRITE_SHEETS, fakeCanvas);
    const standUp = cache.get('paulo:levantando')?.frames ?? [];
    const skate = cache.get('paulo:skate')?.frames ?? [];

    expect(getSpriteFrame(cache, 'paulo', 'levantando', 'settled')).toBe(
      standUp[standUp.length - 1],
    );
    expect(getSpriteFrame(cache, 'paulo', 'skate', 'settled')).toBe(skate[0]);
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
