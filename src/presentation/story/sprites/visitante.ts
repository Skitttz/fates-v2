import { PAULO } from './paulo';
import { SpriteSheet } from './types';

const outfits: SpriteSheet = Object.fromEntries(
  Object.entries(PAULO).map(([pose, sprite]) => [
    pose,
    {
      ...sprite,
      palette: { ...sprite.palette, w: '#facc15', c: '#f97316', p: '#1e3a8a' },
    },
  ]),
);

export const VISITANTE: SpriteSheet = {
  ...outfits,
  'parado-esquerda': {
    ...outfits.parado,
    frames: outfits.parado.frames.map((frame) => {
      const width = Math.max(...frame.map((row) => row.length));
      return frame.map((row) => row.padEnd(width, '.').split('').reverse().join(''));
    }),
  },
};
