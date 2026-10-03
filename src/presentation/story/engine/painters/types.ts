import { StoryActorModel } from '@/domain/models';
import { SpriteCache } from '../../sprites/sprite-cache';
import { RenderInput } from '../types';

export type Brush = {
  context: CanvasRenderingContext2D;
  input: RenderInput;
  sprites: SpriteCache;
};

export interface ActorPainter {
  paint(brush: Brush, actor: StoryActorModel): void;
}
