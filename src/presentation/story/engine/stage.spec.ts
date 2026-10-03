import { describe, expect, it, vi } from 'vitest';
import { StorySceneModel } from '@/domain/models';
import { SpriteCache } from '../sprites/sprite-cache';
import { PARTICLE_COLORS } from './particles';
import { FrameScheduler, StageInput, StoryStage } from './stage';

const makeContext = () => {
  const fills: { style: string; args: number[] }[] = [];
  const drawImage = vi.fn();
  const state: Record<string, unknown> = { drawImage };
  state.fillRect = (...args: number[]) => fills.push({ style: String(state.fillStyle), args });
  const context = new Proxy(state, {
    get(target, key: string) {
      if (!(key in target)) target[key] = vi.fn(() => ({ addColorStop: vi.fn() }));
      return target[key];
    },
  }) as unknown as CanvasRenderingContext2D;
  return { context, drawImage, fills };
};

const makeScheduler = () => {
  const queue = new Map<number, FrameRequestCallback>();
  let next = 1;
  const scheduler: FrameScheduler = {
    request: (callback) => {
      queue.set(next, callback);
      return next++;
    },
    cancel: (id) => {
      queue.delete(id);
    },
  };
  const flush = (now: number) => {
    const pending = [...queue.values()];
    queue.clear();
    pending.forEach((callback) => callback(now));
  };
  return { scheduler, flush, pending: () => queue.size };
};

const scene = (patch: Partial<StorySceneModel> = {}): StorySceneModel => ({
  id: 'a',
  world: 'real',
  backdrop: 'pista-dia',
  actors: [{ id: 'paulo', x: 40, y: 112, pose: 'skate' }],
  lines: [],
  ...patch,
});

const frame = (width: number, height: number) => ({ width, height }) as HTMLCanvasElement;

const sprites: SpriteCache = new Map([
  ['paulo:skate', { frames: [frame(14, 24)], fps: 0, loop: true }],
  ['urso:parado', { frames: [frame(14, 14)], fps: 0, loop: true }],
]);

const makeStage = (input: StageInput, random = () => 1) => {
  const canvas = makeContext();
  const frames = makeScheduler();
  const stage = new StoryStage(canvas.context, sprites, input, {
    scheduler: frames.scheduler,
    random,
  });
  return { stage, ...canvas, ...frames };
};

describe('StoryStage', () => {
  it('draws after it starts and keeps a single frame scheduled', () => {
    const { stage, drawImage, flush, pending } = makeStage({ scene: scene(), animated: true });
    expect(pending()).toBe(0);

    stage.start();
    stage.start();
    expect(pending()).toBe(1);
    flush(0);

    expect(drawImage).toHaveBeenCalledTimes(1);
    expect(pending()).toBe(1);
  });

  it('stops drawing and resumes with the latest input', () => {
    const { stage, drawImage, flush, pending } = makeStage({ scene: scene(), animated: true });
    stage.start();
    flush(0);

    stage.stop();
    expect(pending()).toBe(0);
    stage.update({ scene: scene({ actors: [] }), animated: true });
    drawImage.mockClear();
    stage.start();
    flush(16);

    expect(drawImage).not.toHaveBeenCalled();
    expect(pending()).toBe(1);
  });

  it('restarts the scene clock when the scene changes', () => {
    const bear = { id: 'urso', x: 120, y: 112, pose: 'parado', entrance: 'materialize' as const };
    const { stage, drawImage, flush } = makeStage({
      scene: scene({ actors: [bear] }),
      animated: true,
    });
    stage.start();
    flush(0);
    expect(drawImage).not.toHaveBeenCalled();

    flush(5000);
    expect(drawImage).toHaveBeenCalledTimes(1);

    drawImage.mockClear();
    stage.update({ scene: scene({ id: 'b', actors: [bear] }), animated: true });
    flush(5016);

    expect(drawImage).not.toHaveBeenCalled();
  });

  it('floats dream particles with motion and none without it', () => {
    const motes = (animated: boolean) => {
      const dream = scene({ world: 'dream', backdrop: 'sonho' });
      const { stage, fills, flush } = makeStage({ scene: dream, animated }, () => 0);
      stage.start();
      flush(0);
      flush(16);
      flush(32);
      return fills.filter(({ style }) => style === PARTICLE_COLORS.mote).length;
    };

    expect(motes(true)).toBeGreaterThan(0);
    expect(motes(false)).toBe(0);
  });

  it('cancels the scheduled frame when disposed', () => {
    const { stage, pending } = makeStage({ scene: scene(), animated: true });
    stage.start();

    stage.dispose();

    expect(pending()).toBe(0);
  });
});
