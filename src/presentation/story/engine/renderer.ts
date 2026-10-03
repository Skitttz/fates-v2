import { StoryActorModel, StorySceneModel, StoryTransition } from '@/domain/models';
import { getSpriteFrame, SpriteCache } from '../sprites/sprite-cache';
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
  OLLIE_LIFT,
  TRANSITION_BLOCK,
} from './constants';
import { RenderInput, SceneTransitionState, StoryEffect } from './types';

const applyOllie = (actor: StoryActorModel, effect?: StoryEffect | null): StoryActorModel => {
  if (effect?.type !== 'ollie' || actor.id !== OLLIE_ACTOR) return actor;
  const progress = Math.min(Math.max(effect.progress, 0), 1);
  const fell = effect.result === 'missed' ? progress > 0.5 : progress > 0.85;
  if (fell) return { ...actor, pose: 'deitado' };
  return { ...actor, y: actor.y - Math.round(Math.sin(progress * Math.PI) * OLLIE_LIFT) };
};

const drawGlow = (
  context: CanvasRenderingContext2D,
  actor: StoryActorModel,
  timeMs: number,
  animated: boolean,
) => {
  const pulse = animated ? (Math.sin(timeMs / 300) + 1) / 2 : 1;
  context.globalAlpha = 0.25 + pulse * 0.35;
  context.fillStyle = GLOW_COLOR;
  context.beginPath();
  context.arc(actor.x, actor.y - 3, 10 + pulse * 4, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
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

export function renderScene(
  context: CanvasRenderingContext2D,
  input: RenderInput,
  sprites: SpriteCache,
): void {
  const { scene, timeMs, sceneTimeMs, animated, actorOverrides = {}, effect, transition } = input;

  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBackdrop(context, scene.backdrop, timeMs, animated);

  scene.actors.forEach((baseActor) => {
    const actor = applyOllie({ ...baseActor, ...actorOverrides[baseActor.id] }, effect);
    if (actor.id === GLOW_ACTOR) drawGlow(context, actor, timeMs, animated);

    const frame = getSpriteFrame(sprites, actor.id, actor.pose, sceneTimeMs);
    if (!frame) return;

    const desaturate = scene.world === 'dream' && DESATURATED_IN_DREAM.includes(actor.id);
    if (desaturate) context.filter = 'grayscale(1)';
    context.drawImage(
      frame,
      Math.round(actor.x - frame.width / 2),
      Math.round(actor.y - frame.height),
    );
    if (desaturate) context.filter = 'none';
  });

  if (transition) drawTransition(context, transition);
}
