import { describe, expect, it, vi } from 'vitest';
import { StoryActorModel } from '@/domain/models';
import { SpriteCache } from '../../sprites/sprite-cache';
import { RenderInput } from '../types';
import { Brush, GlowPainter, MaterializePainter, paintersFor, SpinPainter, SpritePainter } from '.';

const input = (patch: Partial<RenderInput> = {}): RenderInput => ({
  scene: { id: 's', world: 'dream', backdrop: 'sonho', actors: [], lines: [] },
  timeMs: 0,
  sceneTimeMs: 5000,
  animated: true,
  ...patch,
});

const frame = (width: number, height: number) => ({ width, height }) as HTMLCanvasElement;

const sprites: SpriteCache = new Map([
  ['paulo:skate', { frames: [frame(14, 24)], fps: 0, loop: true }],
  ['adesivo:girando', { frames: [frame(12, 6)], fps: 0, loop: true }],
  ['urso:parado', { frames: [frame(14, 14)], fps: 0, loop: true }],
]);

const makeBrush = (patch: Partial<RenderInput> = {}) => {
  const context = {
    filter: 'none',
    globalAlpha: 1,
    fillStyle: '',
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  };
  const filters: string[] = [];
  context.drawImage.mockImplementation(() => filters.push(context.filter));
  const brush = { context, input: input(patch), sprites } as unknown as Brush;
  return { brush, context, filters };
};

const paint = (actor: StoryActorModel, patch: Partial<RenderInput> = {}) => {
  const { brush, context, filters } = makeBrush(patch);
  paintersFor(actor, brush.input).forEach((painter) => painter.paint(brush, actor));
  return { context, filters };
};

const kinds = (actor: StoryActorModel, patch: Partial<RenderInput> = {}) =>
  paintersFor(actor, input(patch)).map((painter) => painter.constructor);

describe('paintersFor', () => {
  it('paints a plain actor with the sprite painter', () => {
    expect(kinds({ id: 'paulo', x: 0, y: 0, pose: 'skate' })).toEqual([SpritePainter]);
  });

  it('puts the glow behind the sticker and spins it when it is spinning', () => {
    expect(kinds({ id: 'adesivo', x: 0, y: 0, pose: 'brilhando' })).toEqual([
      GlowPainter,
      SpritePainter,
    ]);
    expect(kinds({ id: 'adesivo', x: 0, y: 0, pose: 'girando' })).toEqual([
      GlowPainter,
      SpinPainter,
    ]);
  });

  it('materializes an entering actor until the entrance ends', () => {
    const bear = { id: 'urso', x: 0, y: 0, pose: 'parado', entrance: 'materialize' as const };

    expect(kinds(bear, { sceneTimeMs: 300 })).toEqual([MaterializePainter]);
    expect(kinds(bear, { sceneTimeMs: 5000 })).toEqual([SpritePainter]);
    expect(kinds(bear, { sceneTimeMs: 300, animated: false })).toEqual([SpritePainter]);
  });
});

describe('painters', () => {
  it('draws the sprite with its feet on the position, desaturated in the dream', () => {
    const { context, filters } = paint({ id: 'paulo', x: 40, y: 112, pose: 'skate' });

    expect(context.drawImage).toHaveBeenCalledWith(sprites.get('paulo:skate')?.frames[0], 33, 88);
    expect(filters).toEqual(['grayscale(1)']);
    expect(context.filter).toBe('none');
  });

  it('keeps the colors of the bear in the dream', () => {
    const { filters } = paint({ id: 'urso', x: 120, y: 112, pose: 'parado' });

    expect(filters).toEqual(['none']);
  });

  it('draws the glow before the spinning sticker', () => {
    const { context } = paint({ id: 'adesivo', x: 150, y: 112, pose: 'girando' });

    expect(context.arc).toHaveBeenCalledTimes(1);
    expect(context.scale).toHaveBeenCalledTimes(1);
    expect(context.arc.mock.invocationCallOrder[0]).toBeLessThan(
      context.drawImage.mock.invocationCallOrder[0],
    );
  });

  it('still glows where there is no sprite to draw', () => {
    const { context } = paint({ id: 'adesivo', x: 150, y: 112, pose: 'brilhando' });

    expect(context.arc).toHaveBeenCalledWith(150, 109, expect.any(Number), 0, Math.PI * 2);
    expect(context.drawImage).not.toHaveBeenCalled();
  });

  it('builds the entering actor out of blocks and nothing at the very start', () => {
    const bear = { id: 'urso', x: 120, y: 112, pose: 'parado', entrance: 'materialize' as const };

    const halfway = paint(bear, { sceneTimeMs: 600 });
    const blocks = halfway.context.drawImage.mock.calls;
    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.length).toBeLessThan(49);
    expect(blocks.every((call) => call.length === 9)).toBe(true);

    expect(paint(bear, { sceneTimeMs: 0 }).context.drawImage).not.toHaveBeenCalled();
  });
});
