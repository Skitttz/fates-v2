import { StoryActorModel } from '@/domain/models';
import { GLOW_ACTOR, OLLIE_ACTOR, OLLIE_LIFT } from './constants';
import { StoryEffect } from './types';

export const OLLIE_TIMELINE = {
  crouch: 0.15,
  pop: 0.3,
  air: 0.7,
  glow: 0.85,
  landedFall: 0.95,
  missedSlip: 0.45,
  shakeEnd: 0.64,
};
export const BOARD_ACTOR = 'prancha';
export const BOARD_ROLL_DISTANCE = 160;
export const GLOW_AHEAD = 40;
export const SHAKE_AMPLITUDE = 2;
export const BOB_PERIOD_MS = 250;
export const LOOKING_ACTORS: readonly string[] = ['urso'];
export const SPINNING_POSE = 'girando';
export const STICKER_RISE = 12;
export const STICKER_RISE_MS = 600;
export const SPIN_PERIOD_MS = 900;

const NO_OFFSET = { x: 0, y: 0 };

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const ollieLift = (progress: number) => {
  const { crouch, air } = OLLIE_TIMELINE;
  if (progress < crouch || progress > air) return 0;
  return Math.round(Math.sin(((progress - crouch) / (air - crouch)) * Math.PI) * OLLIE_LIFT);
};

const olliePose = (progress: number) => {
  if (progress < OLLIE_TIMELINE.crouch) return 'agachado';
  if (progress < OLLIE_TIMELINE.pop) return 'ollie-pop';
  if (progress < OLLIE_TIMELINE.air) return 'ollie-ar';
  return 'agachado';
};

const ollieProgress = (actor: StoryActorModel, effect?: StoryEffect | null) =>
  effect?.type === 'ollie' && actor.id === OLLIE_ACTOR ? clamp01(effect.progress) : null;

export function ollieActor(actor: StoryActorModel, effect?: StoryEffect | null): StoryActorModel {
  const progress = ollieProgress(actor, effect);
  if (progress === null || effect?.type !== 'ollie') return actor;
  if (effect.result === 'missed' && progress >= OLLIE_TIMELINE.missedSlip) {
    return { ...actor, pose: 'sentado' };
  }
  if (effect.result === 'landed' && progress >= OLLIE_TIMELINE.landedFall) {
    return { ...actor, pose: 'deitado' };
  }
  return { ...actor, pose: olliePose(progress), y: actor.y - ollieLift(progress) };
}

export function ollieBoard(
  actor: StoryActorModel,
  effect?: StoryEffect | null,
): StoryActorModel | null {
  const progress = ollieProgress(actor, effect);
  if (progress === null || effect?.type !== 'ollie' || effect.result !== 'missed') return null;
  if (progress < OLLIE_TIMELINE.missedSlip) return null;
  return {
    id: BOARD_ACTOR,
    pose: 'rolando',
    x: actor.x + (progress - OLLIE_TIMELINE.missedSlip) * BOARD_ROLL_DISTANCE,
    y: actor.y,
  };
}

export function landingGlow(
  actor: StoryActorModel,
  effect?: StoryEffect | null,
): StoryActorModel | null {
  const progress = ollieProgress(actor, effect);
  if (progress === null || effect?.type !== 'ollie' || effect.result !== 'landed') return null;
  if (progress < OLLIE_TIMELINE.glow) return null;
  return { id: GLOW_ACTOR, pose: 'brilhando', x: actor.x + GLOW_AHEAD, y: actor.y };
}

export function shakeOffset(
  effect: StoryEffect | null | undefined,
  animated: boolean,
  timeMs: number,
): { x: number; y: number } {
  if (!animated || effect?.type !== 'ollie' || effect.result !== 'missed') return NO_OFFSET;
  if (effect.progress < OLLIE_TIMELINE.missedSlip || effect.progress > OLLIE_TIMELINE.shakeEnd) {
    return NO_OFFSET;
  }
  return {
    x: Math.round(Math.sin(timeMs / 16) * SHAKE_AMPLITUDE),
    y: Math.round(Math.cos(timeMs / 22)),
  };
}

export const bobOffset = (
  actorId: string,
  speaker: string | null,
  sceneTimeMs: number,
  animated: boolean,
): number =>
  animated && speaker === actorId ? Math.floor(Math.max(sceneTimeMs, 0) / BOB_PERIOD_MS) % 2 : 0;

export function lookPose(
  actor: StoryActorModel,
  actors: readonly StoryActorModel[],
  hasPose: (pose: string) => boolean,
): string {
  if (!LOOKING_ACTORS.includes(actor.id)) return actor.pose;
  const target = actors.find(({ id }) => id === OLLIE_ACTOR);
  if (!target) return actor.pose;
  const pose = `${actor.pose}-${target.x < actor.x ? 'esquerda' : 'direita'}`;
  return hasPose(pose) ? pose : actor.pose;
}

export function stickerMotion(
  sceneTimeMs: number,
  animated: boolean,
): { lift: number; scaleX: number } {
  if (!animated) return { lift: STICKER_RISE, scaleX: 1 };
  const rise = clamp01(sceneTimeMs / STICKER_RISE_MS) * STICKER_RISE;
  return {
    lift: Math.round(rise + Math.sin(sceneTimeMs / 400)),
    scaleX: Math.cos((sceneTimeMs / SPIN_PERIOD_MS) * Math.PI * 2),
  };
}
