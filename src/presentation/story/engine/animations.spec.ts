import { describe, expect, it } from 'vitest';
import { StoryActorModel, StorySceneModel } from '@/domain/models';
import {
  bobOffset,
  ENTRANCE_MS,
  entranceProgress,
  obstacleActors,
  dissolveProgress,
  isBlockDissolved,
  landingGlow,
  lookPose,
  ollieActor,
  ollieBoard,
  shakeOffset,
  STAMP_SCALE,
  stickerStamp,
  STICKER_RISE,
  stickerMotion,
} from './animations';
import { OLLIE_LIFT } from './constants';
import { OllieEffect } from './types';

const paulo: StoryActorModel = { id: 'paulo', x: 48, y: 112, pose: 'skate' };
const ollie = (progress: number, result: OllieEffect['result']): OllieEffect => ({
  type: 'ollie',
  progress,
  result,
});

describe('ollie timeline', () => {
  it.each([
    [0.05, 'landed', 'agachado'],
    [0.2, 'landed', 'ollie-pop'],
    [0.5, 'landed', 'ollie-ar'],
    [0.8, 'landed', 'agachado'],
    [0.85, 'landed', 'sentado'],
    [0.97, 'landed', 'deitado-costas'],
    [0.2, 'missed', 'ollie-pop'],
    [0.4, 'missed', 'ollie-ar'],
    [0.5, 'missed', 'sentado'],
  ] as const)('at %s of a %s ollie paulo is %s', (progress, result, pose) => {
    expect(ollieActor(paulo, ollie(progress, result)).pose).toBe(pose);
  });

  it('reaches the highest point in the middle of the jump and lands on the ground', () => {
    expect(ollieActor(paulo, ollie(0.425, 'landed')).y).toBe(112 - OLLIE_LIFT);
    expect(ollieActor(paulo, ollie(0.8, 'landed')).y).toBe(112);
    expect(ollieActor(paulo, ollie(0.5, 'missed')).y).toBe(112);
  });

  it('leaves other actors and other effects untouched', () => {
    const urso = { ...paulo, id: 'urso' };
    expect(ollieActor(urso, ollie(0.5, 'landed'))).toBe(urso);
    expect(ollieActor(paulo, { type: 'placing', progress: 0.5 })).toBe(paulo);
  });

  it('rolls the board away once paulo slips', () => {
    expect(ollieBoard(paulo, ollie(0.4, 'missed'))).toBeNull();
    expect(ollieBoard(paulo, ollie(0.6, 'missed'))).toMatchObject({
      id: 'prancha',
      pose: 'rolando',
      y: 112,
    });
    expect(ollieBoard(paulo, ollie(0.9, 'missed'))!.x).toBeGreaterThan(
      ollieBoard(paulo, ollie(0.6, 'missed'))!.x,
    );
    expect(ollieBoard(paulo, ollie(0.8, 'landed'))).toBeNull();
    expect(ollieBoard(paulo, ollie(0.9, 'landed'))).toMatchObject({ id: 'prancha', y: 112 });
  });

  it('shows the glow ahead of paulo after a landed ollie', () => {
    expect(landingGlow(paulo, ollie(0.8, 'landed'))).toBeNull();
    expect(landingGlow(paulo, ollie(0.9, 'landed'))).toMatchObject({ id: 'adesivo', y: 112 });
    expect(landingGlow(paulo, ollie(0.9, 'missed'))).toBeNull();
  });
});

describe('shakeOffset', () => {
  it('shakes only right after a missed ollie and only with motion', () => {
    expect(shakeOffset(ollie(0.5, 'missed'), true, 25).x).not.toBe(0);
    expect(shakeOffset(ollie(0.5, 'missed'), false, 25)).toEqual({ x: 0, y: 0 });
    expect(shakeOffset(ollie(0.8, 'missed'), true, 25)).toEqual({ x: 0, y: 0 });
    expect(shakeOffset(ollie(0.5, 'landed'), true, 25)).toEqual({ x: 0, y: 0 });
    expect(shakeOffset(null, true, 25)).toEqual({ x: 0, y: 0 });
  });
});

describe('bobOffset', () => {
  it('bobs the speaker by one pixel when motion is allowed', () => {
    expect(bobOffset('urso', 'urso', 0, true)).toBe(0);
    expect(bobOffset('urso', 'urso', 250, true)).toBe(1);
    expect(bobOffset('urso', 'paulo', 250, true)).toBe(0);
    expect(bobOffset('urso', 'urso', 250, false)).toBe(0);
  });
});

describe('lookPose', () => {
  const urso: StoryActorModel = { id: 'urso', x: 176, y: 100, pose: 'parado' };
  const has = () => true;

  it('turns the bear eyes to the side where paulo is', () => {
    expect(lookPose(urso, [paulo, urso], has)).toBe('parado-esquerda');
    expect(lookPose(urso, [{ ...paulo, x: 220 }, urso], has)).toBe('parado-direita');
  });

  it('keeps the pose when there is no variant, no paulo or the actor does not look', () => {
    expect(lookPose(urso, [paulo, urso], () => false)).toBe('parado');
    expect(lookPose(urso, [urso], has)).toBe('parado');
    expect(lookPose(paulo, [paulo, urso], has)).toBe('skate');
  });
});

describe('stickerMotion', () => {
  it('rises and spins with motion and stays still without it', () => {
    expect(stickerMotion(0, true).lift).toBe(0);
    expect(stickerMotion(5000, true).lift).toBeGreaterThanOrEqual(STICKER_RISE - 1);
    expect(stickerMotion(225, true).scaleX).toBeCloseTo(0, 1);
    expect(stickerMotion(5000, false)).toEqual({ lift: STICKER_RISE, scaleX: 1 });
  });
});

describe('placing', () => {
  it('stamps the sticker from big to its final size and fades it while the scene dissolves', () => {
    expect(stickerStamp(0)).toEqual({ scale: STAMP_SCALE.from, opacity: 1 });
    expect(stickerStamp(0.25)).toEqual({ scale: STAMP_SCALE.to, opacity: 1 });
    expect(stickerStamp(0.5)).toEqual({ scale: STAMP_SCALE.to, opacity: 1 });
    expect(stickerStamp(0.75).opacity).toBeCloseTo(0.5);
    expect(stickerStamp(1)).toEqual({ scale: STAMP_SCALE.to, opacity: 0 });
  });

  it('dissolves the scene only after the stamp holds', () => {
    expect(dissolveProgress(0.4)).toBe(0);
    expect(dissolveProgress(0.75)).toBe(0.5);
    expect(dissolveProgress(1)).toBe(1);
  });

  it('clears no block at the start and every block at the end', () => {
    const blocks = Array.from({ length: 30 * 17 }, (_, index) => [
      index % 30,
      Math.floor(index / 30),
    ]);

    expect(blocks.some(([column, row]) => isBlockDissolved(column, row, 0))).toBe(false);
    expect(blocks.every(([column, row]) => isBlockDissolved(column, row, 1))).toBe(true);
    const half = blocks.filter(([column, row]) => isBlockDissolved(column, row, 0.5)).length;
    expect(half).toBeGreaterThan(blocks.length * 0.3);
    expect(half).toBeLessThan(blocks.length * 0.7);
  });
});

describe('entrance and obstacles', () => {
  const urso: StoryActorModel = {
    id: 'urso',
    x: 176,
    y: 100,
    pose: 'parado',
    entrance: 'materialize',
  };

  it('materializes an actor over the entrance time only with motion', () => {
    expect(entranceProgress(urso, 0, true)).toBe(0);
    expect(entranceProgress(urso, ENTRANCE_MS / 2, true)).toBeCloseTo(0.5);
    expect(entranceProgress(urso, ENTRANCE_MS * 2, true)).toBe(1);
    expect(entranceProgress(urso, 0, false)).toBe(1);
    expect(entranceProgress({ ...urso, entrance: undefined }, 0, true)).toBe(1);
  });

  it('turns walk obstacles into actors on the ground', () => {
    const walkScene: StorySceneModel = {
      id: 's',
      world: 'dream',
      backdrop: 'sonho',
      actors: [],
      lines: [],
      interaction: {
        type: 'walk-to',
        actor: 'paulo',
        targetX: 132,
        obstacles: [{ id: 'cone', x: 84 }],
      },
    };

    expect(obstacleActors(walkScene)).toEqual([{ id: 'cone', x: 84, y: 112, pose: 'padrao' }]);
    expect(obstacleActors({ ...walkScene, interaction: undefined })).toEqual([]);
  });
});
