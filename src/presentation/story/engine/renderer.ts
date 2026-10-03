import { StoryActorModel } from '@/domain/models';
import { SpriteCache, spriteKey } from '../sprites/sprite-cache';
import {
  bobOffset,
  dissolveProgress,
  isBlockDissolved,
  landingGlow,
  lookPose,
  ollieActor,
  obstacleActors,
  ollieBoard,
  PLACING_TIMELINE,
  shakeOffset,
} from './animations';
import { drawBackdrop } from './backdrops';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FADE_COLOR,
  FLASH_COLOR,
  OLLIE_ACTOR,
  TRANSITION_BLOCK,
} from './constants';
import { paintersFor } from './painters';
import { drawParticles } from './particles';
import { PlacingEffect, RenderInput, SceneTransitionState } from './types';

const isActor = (actor: StoryActorModel | null): actor is StoryActorModel => actor !== null;

const resolveActors = (input: RenderInput, sprites: SpriteCache): StoryActorModel[] => {
  const { scene, actorOverrides = {}, effect, speaker = null, sceneTimeMs, animated } = input;
  const actors = [...scene.actors, ...obstacleActors(scene)].map((base) =>
    ollieActor({ ...base, ...actorOverrides[base.id] }, effect),
  );
  const extras = actors
    .flatMap((actor) => [ollieBoard(actor, effect), landingGlow(actor, effect)])
    .filter(isActor);

  return [...actors, ...extras].map((actor) => ({
    ...actor,
    pose: lookPose(actor, actors, (pose) => sprites.has(spriteKey(actor.id, pose))),
    y: actor.y - bobOffset(actor.id, speaker, sceneTimeMs, animated),
  }));
};

const drawTransition = (context: CanvasRenderingContext2D, transition: SceneTransitionState) => {
  if (transition.kind === 'flash-to-real') {
    context.globalAlpha = Math.max(0, 1 - transition.progress);
    context.fillStyle = FLASH_COLOR;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.globalAlpha = 1;
    return;
  }

  if (transition.kind !== 'fade-to-dream') return;

  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;
  const maxDistance = Math.hypot(centerX, centerY);
  context.fillStyle = FADE_COLOR;

  for (let y = 0; y < CANVAS_HEIGHT; y += TRANSITION_BLOCK) {
    for (let x = 0; x < CANVAS_WIDTH; x += TRANSITION_BLOCK) {
      const distance =
        Math.hypot(x + TRANSITION_BLOCK / 2 - centerX, y + TRANSITION_BLOCK / 2 - centerY) /
        maxDistance;
      if (distance > transition.progress) {
        context.fillRect(x, y, TRANSITION_BLOCK, TRANSITION_BLOCK);
      }
    }
  }
};

const drawStampFlash = (context: CanvasRenderingContext2D, effect: PlacingEffect) => {
  const { stampEnd, holdEnd } = PLACING_TIMELINE;
  if (effect.progress < stampEnd || effect.progress >= holdEnd) return;
  context.globalAlpha = 0.4 * (1 - (effect.progress - stampEnd) / (holdEnd - stampEnd));
  context.fillStyle = FLASH_COLOR;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.globalAlpha = 1;
};

const drawDissolve = (context: CanvasRenderingContext2D, effect: PlacingEffect) => {
  const progress = dissolveProgress(effect.progress);
  if (progress <= 0) return;
  for (let y = 0; y < CANVAS_HEIGHT; y += TRANSITION_BLOCK) {
    for (let x = 0; x < CANVAS_WIDTH; x += TRANSITION_BLOCK) {
      if (isBlockDissolved(x / TRANSITION_BLOCK, y / TRANSITION_BLOCK, progress)) {
        context.clearRect(x, y, TRANSITION_BLOCK, TRANSITION_BLOCK);
      }
    }
  }
};

export function renderScene(
  context: CanvasRenderingContext2D,
  input: RenderInput,
  sprites: SpriteCache,
): void {
  const { scene, timeMs, animated, effect, transition, particles = [] } = input;
  const actors = resolveActors(input, sprites);
  const shake = shakeOffset(effect, animated, timeMs);

  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.save();
  context.translate(shake.x, shake.y);
  const focusX = actors.find(({ id }) => id === OLLIE_ACTOR)?.x ?? CANVAS_WIDTH / 2;
  drawBackdrop(context, scene.backdrop, timeMs, animated, focusX);
  const brush = { context, input, sprites };
  actors.forEach((actor) =>
    paintersFor(actor, input).forEach((painter) => painter.paint(brush, actor)),
  );
  drawParticles(context, particles);
  if (effect?.type === 'placing') drawStampFlash(context, effect);
  context.restore();

  if (effect?.type === 'placing') drawDissolve(context, effect);

  if (transition) drawTransition(context, transition);
}
