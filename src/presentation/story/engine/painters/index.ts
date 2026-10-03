import { StoryActorModel } from '@/domain/models';
import { entranceProgress, SPINNING_POSE } from '../animations';
import { GLOW_ACTOR } from '../constants';
import { RenderInput } from '../types';
import { GlowPainter } from './glow-painter';
import { MaterializePainter } from './materialize-painter';
import { SpinPainter } from './spin-painter';
import { SpritePainter } from './sprite-painter';
import { ActorPainter } from './types';

const PAINTERS = {
  sprite: new SpritePainter(),
  spin: new SpinPainter(),
  materialize: new MaterializePainter(),
  glow: new GlowPainter(),
};

const bodyPainter = (actor: StoryActorModel, input: RenderInput): ActorPainter => {
  if (entranceProgress(actor, input.sceneTimeMs, input.animated) < 1) return PAINTERS.materialize;
  if (actor.pose === SPINNING_POSE) return PAINTERS.spin;
  return PAINTERS.sprite;
};

export const paintersFor = (actor: StoryActorModel, input: RenderInput): ActorPainter[] => {
  const body = bodyPainter(actor, input);
  return actor.id === GLOW_ACTOR ? [PAINTERS.glow, body] : [body];
};

export { GlowPainter, MaterializePainter, SpinPainter, SpritePainter };
export type { ActorPainter, Brush } from './types';
