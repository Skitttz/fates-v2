import { SpriteSheet } from './types';

const WIDTH = 24;
const EDGE = 'k'.repeat(WIDTH);
const row = (fill: string) => `k${fill.repeat(WIDTH - 2)}k`;

export const CAIXOTE: SpriteSheet = {
  padrao: {
    palette: { k: '#111111', g: '#a1a1aa', G: '#71717a' },
    fps: 0,
    frames: [[EDGE, row('g'), row('g'), ...Array.from({ length: 8 }, () => row('G')), EDGE]],
  },
};
