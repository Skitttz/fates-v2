import { StoryActorModel } from '@/domain/models';
import { getSpriteFrame, SpriteCache, spriteKey } from '../sprites/sprite-cache';
import {
  bobOffset,
  dissolveProgress,
  isBlockDissolved,
  landingGlow,
  lookPose,
  ollieActor,
  ollieBoard,
  PLACING_TIMELINE,
  shakeOffset,
  SPINNING_POSE,
  stickerMotion,
} from './animations';
import { drawBackdrop } from './backdrops';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DESATURATED_IN_DREAM,
  FADE_COLOR,
  FLASH_COLOR,
  GLOW_ACTOR,
  GLOW_COLOR,
  OLLIE_ACTOR,
  TRANSITION_BLOCK,
} from './constants';
import { drawParticles } from './particles';
import { PlacingEffect, RenderInput, SceneTransitionState } from './types';

const isActor = (actor: StoryActorModel | null): actor is StoryActorModel => actor !== null;

const resolveActors = (input: RenderInput, sprites: SpriteCache): StoryActorModel[] => {
  const { scene, actorOverrides = {}, effect, speaker = null, sceneTimeMs, animated } = input;
  const actors = scene.actors.map((base) =>
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

const drawGlow = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  timeMs: number,
  animated: boolean,
) => {
  const pulse = animated ? (Math.sin(timeMs / 300) + 1) / 2 : 1;
  context.globalAlpha = 0.25 + pulse * 0.35;
  context.fillStyle = GLOW_COLOR;
  context.beginPath();
  context.arc(x, y - 3, 10 + pulse * 4, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
};

const drawActor = (
  context: CanvasRenderingContext2D,
  actor: StoryActorModel,
  input: RenderInput,
  sprites: SpriteCache,
) => {
  const motion =
    actor.pose === SPINNING_POSE ? stickerMotion(input.sceneTimeMs, input.animated) : null;
  const lift = motion?.lift ?? 0;
  if (actor.id === GLOW_ACTOR) {
    drawGlow(context, actor.x, actor.y - lift, input.timeMs, input.animated);
  }

  const frame = getSpriteFrame(sprites, actor.id, actor.pose, input.sceneTimeMs);
  if (!frame) return;

  const desaturate = input.scene.world === 'dream' && DESATURATED_IN_DREAM.includes(actor.id);
  if (desaturate) context.filter = 'grayscale(1)';

  if (motion) {
    context.save();
    context.translate(Math.round(actor.x), Math.round(actor.y - lift - frame.height / 2));
    context.scale(motion.scaleX, 1);
    context.drawImage(frame, -frame.width / 2, -frame.height / 2);
    context.restore();
  } else {
    context.drawImage(
      frame,
      Math.round(actor.x - frame.width / 2),
      Math.round(actor.y - frame.height),
    );
  }

  if (desaturate) context.filter = 'none';
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
  actors.forEach((actor) => drawActor(context, actor, input, sprites));
  drawParticles(context, particles);
  if (effect?.type === 'placing') drawStampFlash(context, effect);
  context.restore();

  if (effect?.type === 'placing') drawDissolve(context, effect);

  if (transition) drawTransition(context, transition);
}
