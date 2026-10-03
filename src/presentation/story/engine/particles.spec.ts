import { describe, expect, it, vi } from 'vitest';
import { StorySceneModel } from '@/domain/models';
import { drawParticles, emitParticles, PARTICLE_COLORS, updateParticles } from './particles';
import { RenderInput } from './types';

const scene = (patch: Partial<StorySceneModel> = {}): StorySceneModel => ({
  id: 'scene',
  world: 'real',
  backdrop: 'pista-dia',
  actors: [{ id: 'paulo', x: 48, y: 112, pose: 'skate' }],
  lines: [],
  ...patch,
});

const input = (patch: Partial<RenderInput> = {}): RenderInput => ({
  scene: scene(),
  timeMs: 0,
  sceneTimeMs: 0,
  animated: true,
  ...patch,
});

const never = () => 0.99;
const always = () => 0;

describe('emitParticles', () => {
  it('emits nothing without motion', () => {
    const dream = input({ animated: false, scene: scene({ world: 'dream' }) });

    expect(emitParticles(dream, null, 16, always)).toEqual([]);
  });

  it('lets dream motes rise from the ground', () => {
    const dream = input({ scene: scene({ world: 'dream', actors: [] }) });
    const [mote] = emitParticles(dream, null, 16, always);

    expect(mote).toMatchObject({ color: PARTICLE_COLORS.mote, y: 112 });
    expect(mote.vy).toBeLessThan(0);
  });

  it('kicks dust once when a landed ollie touches the ground', () => {
    const at = (progress: number) =>
      input({ effect: { type: 'ollie', progress, result: 'landed' } });

    expect(emitParticles(at(0.71), at(0.69), 16, never)).toHaveLength(6);
    expect(emitParticles(at(0.75), at(0.71), 16, never)).toHaveLength(0);
  });

  it('leaves dust behind while paulo is riding', () => {
    const riding = input({ actorOverrides: { paulo: { x: 90, pose: 'skate-andando' } } });
    const [dust] = emitParticles(riding, null, 16, always);

    expect(dust).toMatchObject({ color: PARTICLE_COLORS.dust });
    expect(dust.x).toBeLessThan(90);
  });

  it('bursts sparks once when the sticker is stamped', () => {
    const at = (progress: number) => input({ effect: { type: 'placing', progress } });

    expect(emitParticles(at(0.26), at(0.24), 16, never)).toHaveLength(16);
    expect(emitParticles(at(0.3), at(0.26), 16, never)).toHaveLength(0);
  });
});

describe('emitParticles entrance', () => {
  it('sparkles around an actor while it materializes', () => {
    const urso = { id: 'urso', x: 176, y: 100, pose: 'parado', entrance: 'materialize' as const };
    const during = input({ scene: scene({ actors: [urso] }), sceneTimeMs: 600 });
    const after = input({ scene: scene({ actors: [urso] }), sceneTimeMs: 5000 });
    const motes = (particles: { color: string }[]) =>
      particles.filter(({ color }) => color === PARTICLE_COLORS.mote);

    expect(motes(emitParticles(during, null, 16, always)).length).toBeGreaterThan(0);
    expect(motes(emitParticles(after, null, 16, always))).toHaveLength(0);
  });
});

describe('updateParticles', () => {
  it('moves particles and drops the expired ones', () => {
    const particles = [
      { x: 10, y: 10, vx: 0.01, vy: -0.01, life: 100, maxLife: 100, color: '#fff' },
      { x: 0, y: 0, vx: 0, vy: 0, life: 10, maxLife: 100, color: '#fff' },
    ];

    const next = updateParticles(particles, 50);

    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({ x: 10.5, y: 9.5, life: 50 });
  });
});

describe('drawParticles', () => {
  it('fades particles by remaining life and resets the alpha', () => {
    const alphas: number[] = [];
    const context: { globalAlpha: number; fillStyle: string; fillRect: () => void } = {
      globalAlpha: 1,
      fillStyle: '',
      fillRect: vi.fn(() => {
        alphas.push(context.globalAlpha);
      }),
    };

    drawParticles(context as unknown as CanvasRenderingContext2D, [
      { x: 1.4, y: 2.6, vx: 0, vy: 0, life: 25, maxLife: 100, color: '#fff' },
    ]);

    expect(context.fillRect).toHaveBeenCalledWith(1, 3, 1, 1);
    expect(alphas).toEqual([0.25]);
    expect(context.globalAlpha).toBe(1);
  });
});
