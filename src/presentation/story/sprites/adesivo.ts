import { SpriteFrame, SpriteSheet } from './types';

const frame = (outline: string): SpriteFrame => [
  outline.repeat(12),
  `${outline}kkkkkkkkkk${outline}`,
  `${outline}kwwkwkwwwk${outline}`,
  `${outline}kwkkwkkwkk${outline}`,
  `${outline}kkkkkkkkkk${outline}`,
  outline.repeat(12),
];

const GLOWING = {
  palette: { n: '#22c55e', N: '#c4f82a', k: '#111111', w: '#f4f4f5' },
  fps: 3,
  frames: [frame('n'), frame('N')],
};

export const ADESIVO: SpriteSheet = {
  brilhando: GLOWING,
  girando: GLOWING,
};
