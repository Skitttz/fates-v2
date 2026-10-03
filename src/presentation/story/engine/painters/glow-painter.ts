import { StoryActorModel } from '@/domain/models';
import { glowPulse, SPINNING_POSE, stickerMotion } from '../animations';
import { GLOW_COLOR } from '../constants';
import { RenderInput } from '../types';
import { ActorPainter, Brush } from './types';

const GLOW = {
  radius: 10,
  pulseRadius: 4,
  emphasisRadius: 6,
  offsetY: 3,
  alpha: 0.25,
  pulseAlpha: 0.35,
  emphasisAlpha: 0.15,
};

export class GlowPainter implements ActorPainter {
  paint({ context, input }: Brush, actor: StoryActorModel): void {
    const emphasized = input.emphasis === actor.id;
    const pulse = glowPulse(input.timeMs, input.animated, emphasized);
    const radius = emphasized ? GLOW.radius + GLOW.emphasisRadius : GLOW.radius;
    const alpha = emphasized ? GLOW.alpha + GLOW.emphasisAlpha : GLOW.alpha;
    const centerY = actor.y - this.lift(input, actor) - GLOW.offsetY;

    context.globalAlpha = Math.min(1, alpha + pulse * GLOW.pulseAlpha);
    context.fillStyle = GLOW_COLOR;
    context.beginPath();
    context.arc(actor.x, centerY, radius + pulse * GLOW.pulseRadius, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
  }

  private lift(input: RenderInput, actor: StoryActorModel): number {
    if (actor.pose !== SPINNING_POSE) return 0;
    return stickerMotion(input.sceneTimeMs, input.animated).lift;
  }
}
