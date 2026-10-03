import { describe, expect, it, vi } from 'vitest';
import { StorySceneModel } from '@/domain/models';
import { SpriteCache } from '../sprites/sprite-cache';
import { EMPTY_BACKDROP_COLOR, TRANSITION_BLOCK } from './constants';
import { renderScene } from './renderer';
import { RenderInput } from './types';

const makeContext = () => {
  const fills: { style: string; args: number[] }[] = [];
  const context = {
    fillStyle: '' as unknown,
    strokeStyle: '',
    globalAlpha: 1,
    filter: 'none',
    imageSmoothingEnabled: true,
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
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
    ['paulo:skate', { frames: [frame(14, 24)], fps: 0, loop: true }],
    ['paulo:deitado', { frames: [frame(22, 12)], fps: 0, loop: true }],
    ['paulo:ollie-ar', { frames: [frame(14, 20)], fps: 0, loop: true }],
    ['paulo:sentado', { frames: [frame(12, 18)], fps: 0, loop: true }],
    ['prancha:rolando', { frames: [frame(14, 2)], fps: 0, loop: true }],
    ['adesivo:girando', { frames: [frame(12, 6)], fps: 0, loop: true }],
    ['urso:parado', { frames: [frame(14, 14)], fps: 0, loop: true }],
    ['urso:parado-esquerda', { frames: [frame(14, 15)], fps: 0, loop: true }],
  ]);

const scene = (patch: Partial<StorySceneModel> = {}): StorySceneModel => ({
  id: 'scene',
  world: 'real',
  backdrop: 'pista-dia',
  actors: [{ id: 'paulo', x: 40, y: 112, pose: 'skate' }],
  lines: [],
  ...patch,
});

const render = (input: Omit<RenderInput, 'sceneTimeMs'> & { sceneTimeMs?: number }) => {
  const { context, fills } = makeContext();
  renderScene(
    context as unknown as CanvasRenderingContext2D,
    { sceneTimeMs: 0, ...input },
    makeSprites(),
  );
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

  it('lifts paulo at the top of a landed ollie and sits him down with the board away after a missed one', () => {
    const landed = render({
      scene: scene(),
      timeMs: 0,
      animated: true,
      effect: { type: 'ollie', progress: 0.425, result: 'landed' },
    });
    expect(landed.context.drawImage).toHaveBeenCalledWith(expect.anything(), 33, 76);

    const missed = render({
      scene: scene(),
      timeMs: 0,
      animated: true,
      effect: { type: 'ollie', progress: 0.6, result: 'missed' },
    });
    expect(missed.context.drawImage).toHaveBeenCalledWith(expect.anything(), 34, 94);
    expect(missed.context.drawImage).toHaveBeenCalledWith(expect.anything(), 57, 110);
  });

  it('shakes the scene after a missed ollie only with motion', () => {
    const input = {
      scene: scene(),
      timeMs: 25,
      effect: { type: 'ollie', progress: 0.5, result: 'missed' } as const,
    };

    expect(render({ ...input, animated: true }).context.translate).toHaveBeenCalledWith(2, 0);
    expect(render({ ...input, animated: false }).context.translate).toHaveBeenCalledWith(0, 0);
  });

  it('bobs the actor who is speaking', () => {
    const { context } = render({
      scene: scene(),
      timeMs: 0,
      sceneTimeMs: 250,
      animated: true,
      speaker: 'paulo',
    });

    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 33, 87);
  });

  it('makes the bear look at paulo and spins the sticker around its center', () => {
    const { context } = render({
      scene: scene({
        world: 'dream',
        backdrop: 'sonho',
        actors: [
          { id: 'paulo', x: 40, y: 112, pose: 'skate' },
          { id: 'urso', x: 176, y: 100, pose: 'parado' },
          { id: 'adesivo', x: 140, y: 112, pose: 'girando' },
        ],
      }),
      timeMs: 0,
      sceneTimeMs: 5000,
      animated: false,
    });

    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 169, 85);
    expect(context.scale).toHaveBeenCalledWith(1, 1);
    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), -6, -3);
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

  it('moves the dream city layers with paulo only when motion is allowed', () => {
    const nearCity = (fills: { style: string; args: number[] }[]) =>
      fills.find(({ style }) => style === '#ddd6e8')?.args[0];
    const dream = (x: number, animated: boolean) =>
      render({
        scene: scene({
          world: 'dream',
          backdrop: 'sonho',
          actors: [{ id: 'paulo', x, y: 112, pose: 'skate' }],
        }),
        timeMs: 0,
        animated,
      }).fills;

    expect(nearCity(dream(40, true))).not.toBe(nearCity(dream(200, true)));
    expect(nearCity(dream(40, false))).toBe(nearCity(dream(200, false)));
  });

  it('draws the particles it receives', () => {
    const { fills } = render({
      scene: scene(),
      timeMs: 0,
      animated: true,
      particles: [{ x: 5, y: 6, vx: 0, vy: 0, life: 1, maxLife: 1, color: '#abcdef' }],
    });

    expect(fills).toContainEqual({ style: '#abcdef', args: [5, 6, 1, 1] });
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
