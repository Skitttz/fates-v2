import { describe, expect, it, vi } from 'vitest';
import { StorySceneModel } from '@/domain/models';
import { SpriteCache } from '../sprites/sprite-cache';
import { EMPTY_BACKDROP_COLOR, TRANSITION_BLOCK } from './constants';
import { renderScene } from './renderer';

const makeContext = () => {
  const fills: { style: string; args: number[] }[] = [];
  const context = {
    fillStyle: '' as unknown,
    strokeStyle: '',
    globalAlpha: 1,
    filter: 'none',
    imageSmoothingEnabled: true,
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  };
  context.fillRect.mockImplementation((...args: number[]) =>
    fills.push({ style: String(context.fillStyle), args }),
  );
  return { context, fills };
};

const frame = (width: number, height: number) => ({ width, height }) as HTMLCanvasElement;

const makeSprites = (): SpriteCache =>
  new Map([
    ['paulo:skate', { frames: [frame(14, 24)], fps: 0 }],
    ['paulo:deitado', { frames: [frame(22, 12)], fps: 0 }],
  ]);

const scene = (patch: Partial<StorySceneModel> = {}): StorySceneModel => ({
  id: 'scene',
  world: 'real',
  backdrop: 'pista-dia',
  actors: [{ id: 'paulo', x: 40, y: 112, pose: 'skate' }],
  lines: [],
  ...patch,
});

const render = (input: Parameters<typeof renderScene>[1]) => {
  const { context, fills } = makeContext();
  renderScene(context as unknown as CanvasRenderingContext2D, input, makeSprites());
  return { context, fills };
};

describe('renderScene', () => {
  it('draws actors with their feet on the given position', () => {
    const { context } = render({ scene: scene(), timeMs: 0, animated: true });

    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 33, 88);
    expect(context.imageSmoothingEnabled).toBe(false);
  });

  it('skips actors and poses without sprites', () => {
    const { context } = render({
      scene: scene({
        actors: [
          { id: 'ghost', x: 10, y: 10, pose: 'parado' },
          { id: 'paulo', x: 10, y: 10, pose: 'voando' },
        ],
      }),
      timeMs: 0,
      animated: true,
    });

    expect(context.drawImage).not.toHaveBeenCalled();
  });

  it('fills an unknown backdrop with a neutral color', () => {
    const { fills } = render({ scene: scene({ backdrop: 'lua' }), timeMs: 0, animated: true });

    expect(fills[0].style).toBe(EMPTY_BACKDROP_COLOR);
  });

  it('applies actor overrides', () => {
    const { context } = render({
      scene: scene(),
      timeMs: 0,
      animated: true,
      actorOverrides: { paulo: { x: 100 } },
    });

    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 93, 88);
  });

  it('lifts paulo in the middle of a landed ollie and lays him down after a missed one', () => {
    const landed = render({
      scene: scene(),
      timeMs: 0,
      animated: true,
      effect: { type: 'ollie', progress: 0.5, result: 'landed' },
    });
    expect(landed.context.drawImage).toHaveBeenCalledWith(expect.anything(), 33, 72);

    const missed = render({
      scene: scene(),
      timeMs: 0,
      animated: true,
      effect: { type: 'ollie', progress: 0.6, result: 'missed' },
    });
    expect(missed.context.drawImage).toHaveBeenCalledWith(expect.anything(), 29, 100);
  });

  it('covers the canvas at the start of the fade to dream and reveals it at the end', () => {
    const isBlock = ({ args }: { args: number[] }) =>
      args[2] === TRANSITION_BLOCK && args[3] === TRANSITION_BLOCK;

    const start = render({
      scene: scene(),
      timeMs: 0,
      animated: true,
      transition: { kind: 'fade-to-dream', progress: 0 },
    });
    expect(start.fills.filter(isBlock).length).toBeGreaterThan(400);

    const end = render({
      scene: scene(),
      timeMs: 0,
      animated: true,
      transition: { kind: 'fade-to-dream', progress: 1.5 },
    });
    expect(end.fills.filter(isBlock)).toHaveLength(0);
  });

  it('desaturates paulo in the dream and resets the filter', () => {
    const { context } = render({
      scene: scene({ world: 'dream', backdrop: 'sonho' }),
      timeMs: 0,
      animated: false,
    });

    expect(context.drawImage).toHaveBeenCalled();
    expect(context.filter).toBe('none');
  });
});
