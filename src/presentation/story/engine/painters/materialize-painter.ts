import { StoryActorModel } from '@/domain/models';
import { entranceProgress, isBlockDissolved } from '../animations';
import { SpritePainter } from './sprite-painter';
import { Brush } from './types';

const ENTRANCE_BLOCK = 2;

export class MaterializePainter extends SpritePainter {
  protected draw(
    { context, input }: Brush,
    actor: StoryActorModel,
    frame: HTMLCanvasElement,
  ): void {
    const appear = entranceProgress(actor, input.sceneTimeMs, input.animated);
    const left = Math.round(actor.x - frame.width / 2);
    const top = Math.round(actor.y - frame.height);
    for (let y = 0; y < frame.height; y += ENTRANCE_BLOCK) {
      for (let x = 0; x < frame.width; x += ENTRANCE_BLOCK) {
        if (!isBlockDissolved(x / ENTRANCE_BLOCK, y / ENTRANCE_BLOCK, appear)) continue;
        context.drawImage(
          frame,
          x,
          y,
          ENTRANCE_BLOCK,
          ENTRANCE_BLOCK,
          left + x,
          top + y,
          ENTRANCE_BLOCK,
          ENTRANCE_BLOCK,
        );
      }
    }
  }
}
