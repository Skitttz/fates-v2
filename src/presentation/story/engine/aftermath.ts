import { StorySceneModel } from '@/domain/models';
import { StickerPlace } from '@/domain/models/story-memory-model';
import { GROUND_Y } from './constants';

export const AFTERMATH_MS = 2800;

export function aftermathScene(place: StickerPlace, progress: number): StorySceneModel {
  const travel = Math.min(1, Math.max(0, progress));
  const common = {
    id: `aftermath-${place}`,
    world: 'real' as const,
    backdrop: 'pista-dia',
    lines: [],
  };
  if (place === 'moletom') {
    const x = 52 + travel * 130;
    return {
      ...common,
      actors: [
        { id: 'paulo', pose: 'moletom', x, y: GROUND_Y },
        { id: 'adesivo', pose: 'colado', x: x + 1, y: GROUND_Y - 10 },
        { id: 'visitante', pose: 'parado-esquerda', x: 208, y: GROUND_Y },
      ],
    };
  }
  const skatePose = travel < 1 ? 'skate-andando' : 'skate';
  return {
    ...common,
    actors: [
      { id: place === 'poste' ? 'poste' : 'caixote', pose: 'padrao', x: 170, y: GROUND_Y },
      { id: 'adesivo', pose: 'colado', x: 170, y: GROUND_Y - (place === 'poste' ? 20 : 4) },
      {
        id: 'visitante',
        pose: place === 'caixote' ? skatePose : 'parado',
        x: 38 + travel * 103,
        y: GROUND_Y,
      },
    ],
  };
}
