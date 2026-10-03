import { SpriteSheet } from './types';

const BOARD = `k${'o'.repeat(12)}k`;

export const PRANCHA: SpriteSheet = {
  rolando: {
    palette: { k: '#111111', o: '#ff5a1f', r: '#d4d4d8', R: '#71717a' },
    fps: 8,
    frames: [
      [BOARD, '..krk....krk..'],
      [BOARD, '..kRk....kRk..'],
    ],
  },
};
