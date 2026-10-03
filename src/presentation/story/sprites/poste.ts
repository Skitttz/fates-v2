import { SpriteSheet } from './types';

export const POSTE: SpriteSheet = {
  padrao: {
    palette: { k: '#27272a', y: '#facc15', s: '#a16207' },
    fps: 0,
    frames: [
      [
        '.kkkkkk.',
        '.kyyyyk.',
        '.kyyyyk.',
        '.kkkkkk.',
        ...Array.from({ length: 30 }, () => '..kyys..'),
        '.kssssk.',
        'kkkkkkkk',
      ],
    ],
  },
};
