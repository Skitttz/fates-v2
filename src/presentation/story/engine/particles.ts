import {
  entranceProgress,
  landingGlow,
  OLLIE_TIMELINE,
  PLACING_TIMELINE,
  SPINNING_POSE,
  STICKER_RISE,
  walkActor,
} from './animations';
import { CANVAS_WIDTH, GLOW_ACTOR, GROUND_Y, OLLIE_ACTOR, STAMP_CENTER } from './constants';
import { Particle, RenderInput, StoryEffect } from './types';

export type Random = () => number;

export const PARTICLE_COLORS = { mote: '#c4b5fd', dust: '#a1a1aa', spark: '#c4f82a' };

const MOTE_EVERY_MS = 350;
const DUST_EVERY_MS = 60;
const SPARK_EVERY_MS = 140;
const ENTRANCE_SPARK_EVERY_MS = 70;
const LANDING_DUST = 6;
const STAMP_SPARKS = 16;
const GLOW_SPARKS = 10;
const GLOW_SPARK_EVERY_MS = 70;
const GLOW_SPARK_SPREAD = 16;
const GLOW_SPARK_RISE = 3;

const particle = (
  x: number,
  y: number,
  vx: number,
  vy: number,
  life: number,
  color: string,
): Particle => ({ x, y, vx, vy, life, maxLife: life, color });

const burst = (x: number, y: number, count: number, color: string, random: Random) =>
  Array.from({ length: count }, () =>
    particle(x, y, (random() - 0.5) * 0.08, -random() * 0.06, 500, color),
  );

const progressOf = (input: RenderInput | null, type: StoryEffect['type']) =>
  input?.effect?.type === type ? input.effect.progress : 0;

const crossed = (previous: number, current: number, at: number) => previous < at && current >= at;

const actorAt = (input: RenderInput, id: string) => {
  const actor = input.scene.actors.find((candidate) => candidate.id === id);
  return actor ? walkActor({ ...actor, ...input.actorOverrides?.[id] }, input.walk) : null;
};

const glowSparks = (
  input: RenderInput,
  previous: RenderInput | null,
  dtMs: number,
  random: Random,
): Particle[] => {
  const paulo = actorAt(input, OLLIE_ACTOR);
  const glow = paulo ? landingGlow(paulo, input.effect) : null;
  if (!glow) return [];
  const y = glow.y - GLOW_SPARK_RISE;
  const appeared = crossed(
    progressOf(previous, 'ollie'),
    progressOf(input, 'ollie'),
    OLLIE_TIMELINE.glow,
  );
  const opening = appeared ? burst(glow.x, y, GLOW_SPARKS, PARTICLE_COLORS.spark, random) : [];
  if (random() >= dtMs / GLOW_SPARK_EVERY_MS) return opening;
  const x = glow.x + (random() - 0.5) * GLOW_SPARK_SPREAD;
  return [...opening, ...burst(x, y, 1, PARTICLE_COLORS.spark, random)];
};

export function emitParticles(
  input: RenderInput,
  previous: RenderInput | null,
  dtMs: number,
  random: Random,
): Particle[] {
  if (!input.animated) return [];
  const spawned: Particle[] = [];
  const { effect } = input;
  const paulo = actorAt(input, OLLIE_ACTOR);
  const sticker = actorAt(input, GLOW_ACTOR);

  if (paulo && input.walk && previous?.walk && input.scene.id === previous.scene.id) {
    if (
      input.walk.state.bumps > previous.walk.state.bumps ||
      (!input.walk.state.airborne && previous.walk.state.airborne)
    ) {
      spawned.push(...burst(paulo.x, GROUND_Y - 1, LANDING_DUST, PARTICLE_COLORS.dust, random));
    }
  }

  if (input.scene.world === 'dream' && random() < dtMs / MOTE_EVERY_MS) {
    spawned.push(
      particle(random() * CANVAS_WIDTH, GROUND_Y, 0, -0.008, 4000, PARTICLE_COLORS.mote),
    );
  }

  if (paulo?.pose === 'skate-andando' && random() < dtMs / DUST_EVERY_MS) {
    const facing = input.walk?.state.facing ?? 1;
    spawned.push(
      particle(
        paulo.x - 6 * facing,
        GROUND_Y - 1,
        -0.02 * facing,
        -0.01,
        400,
        PARTICLE_COLORS.dust,
      ),
    );
  }

  if (
    paulo &&
    effect?.type === 'ollie' &&
    effect.result === 'landed' &&
    crossed(progressOf(previous, 'ollie'), effect.progress, OLLIE_TIMELINE.air)
  ) {
    spawned.push(...burst(paulo.x, GROUND_Y - 1, LANDING_DUST, PARTICLE_COLORS.dust, random));
  }

  spawned.push(...glowSparks(input, previous, dtMs, random));

  if (sticker?.pose === SPINNING_POSE && random() < dtMs / SPARK_EVERY_MS) {
    const x = sticker.x + (random() - 0.5) * 16;
    spawned.push(...burst(x, sticker.y - STICKER_RISE - 3, 1, PARTICLE_COLORS.spark, random));
  }

  if (
    effect?.type === 'placing' &&
    crossed(progressOf(previous, 'placing'), effect.progress, PLACING_TIMELINE.stampEnd)
  ) {
    spawned.push(
      ...burst(STAMP_CENTER.x, STAMP_CENTER.y, STAMP_SPARKS, PARTICLE_COLORS.spark, random),
    );
  }

  input.scene.actors.forEach((actor) => {
    const appear = entranceProgress(actor, input.sceneTimeMs, input.animated);
    if (appear <= 0 || appear >= 1 || random() >= dtMs / ENTRANCE_SPARK_EVERY_MS) return;
    spawned.push(
      ...burst(
        actor.x + (random() - 0.5) * 16,
        actor.y - random() * 16,
        1,
        PARTICLE_COLORS.mote,
        random,
      ),
    );
  });

  return spawned;
}

export const updateParticles = (particles: readonly Particle[], dtMs: number): Particle[] =>
  particles
    .map((item) => ({
      ...item,
      x: item.x + item.vx * dtMs,
      y: item.y + item.vy * dtMs,
      life: item.life - dtMs,
    }))
    .filter(({ life }) => life > 0);

export function drawParticles(
  context: CanvasRenderingContext2D,
  particles: readonly Particle[],
): void {
  particles.forEach(({ x, y, life, maxLife, color }) => {
    context.globalAlpha = Math.max(0, life / maxLife);
    context.fillStyle = color;
    context.fillRect(Math.round(x), Math.round(y), 1, 1);
  });
  context.globalAlpha = 1;
}
