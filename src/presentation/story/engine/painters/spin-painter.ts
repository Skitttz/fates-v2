import { StoryActorModel } from '@/domain/models';
import { stickerMotion } from '../animations';
import { SpritePainter } from './sprite-painter';
import { Brush } from './types';

export class SpinPainter extends SpritePainter {
  protected draw(
    { context, input }: Brush,
    actor: StoryActorModel,
    frame: HTMLCanvasElement,
  ): void {
    const { lift, scaleX } = stickerMotion(input.sceneTimeMs, input.animated);
    context.save();
    context.translate(Math.round(actor.x), Math.round(actor.y - lift - frame.height / 2));
    context.scale(scaleX, 1);
    context.drawImage(frame, -frame.width / 2, -frame.height / 2);
    context.restore();
  }
}
