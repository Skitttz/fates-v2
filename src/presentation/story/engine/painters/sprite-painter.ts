import { StoryActorModel } from '@/domain/models';
import { getSpriteFrame } from '../../sprites/sprite-cache';
import { DESATURATED_IN_DREAM } from '../constants';
import { isRolling } from '../walk-runtime';
import { ActorPainter, Brush } from './types';

export class SpritePainter implements ActorPainter {
  paint(brush: Brush, actor: StoryActorModel): void {
    const frame = this.frameFor(brush, actor);
    if (!frame) return;
    const desaturate = this.fadesInDream(brush, actor);
    if (desaturate) brush.context.filter = 'grayscale(1)';
    this.draw(brush, actor, frame);
    if (desaturate) brush.context.filter = 'none';
  }

  protected draw(
    { context, input }: Brush,
    actor: StoryActorModel,
    frame: HTMLCanvasElement,
  ): void {
    if (input.walk?.actor === actor.id && input.walk.state.facing === -1) {
      context.save();
      context.translate(Math.round(actor.x), Math.round(actor.y));
      context.scale(-1, 1);
      context.drawImage(frame, -Math.floor(frame.width / 2), -frame.height);
      context.restore();
      return;
    }
    context.drawImage(
      frame,
      Math.round(actor.x - frame.width / 2),
      Math.round(actor.y - frame.height),
    );
  }

  private frameFor({ input, sprites }: Brush, actor: StoryActorModel): HTMLCanvasElement | null {
    const still = input.walk?.actor === actor.id && !isRolling(input.walk.state);
    const time = input.animated && !still ? input.sceneTimeMs : 'settled';
    return getSpriteFrame(sprites, actor.id, actor.pose, time);
  }

  private fadesInDream({ input }: Brush, actor: StoryActorModel): boolean {
    return input.scene.world === 'dream' && DESATURATED_IN_DREAM.includes(actor.id);
  }
}
