import { StoryActorModel } from '@/domain/models';
import { getSpriteFrame } from '../../sprites/sprite-cache';
import { DESATURATED_IN_DREAM } from '../constants';
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

  protected draw({ context }: Brush, actor: StoryActorModel, frame: HTMLCanvasElement): void {
    context.drawImage(
      frame,
      Math.round(actor.x - frame.width / 2),
      Math.round(actor.y - frame.height),
    );
  }

  private frameFor({ input, sprites }: Brush, actor: StoryActorModel): HTMLCanvasElement | null {
    const time = input.animated ? input.sceneTimeMs : 'settled';
    return getSpriteFrame(sprites, actor.id, actor.pose, time);
  }

  private fadesInDream({ input }: Brush, actor: StoryActorModel): boolean {
    return input.scene.world === 'dream' && DESATURATED_IN_DREAM.includes(actor.id);
  }
}
