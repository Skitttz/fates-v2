import { SpriteDefinition, SpriteFrame, SpritePalette, SpriteSheet } from './types';

const PALETTE: SpritePalette = {
  k: '#111111',
  u: '#7c3aed',
  v: '#5b21b6',
  c: '#d6c3a1',
  f: '#ff4fa3',
  w: '#f4f4f5',
  e: '#dc2626',
  t: '#5ce1e6',
};

const HEAD: SpriteFrame = [
  '...kkkkkkkk...',
  '..kccffccccck.',
  '.kccccccccccck',
  '.kuuuuuuuuuuk.',
  '.kuwewuuuwewuk',
];

const BODY: SpriteFrame = [
  '.kuuuuuuuuuuk.',
  'kuuvuuuuuuvuuk',
  'kuuvuuuuuuvuuk',
  '.kuuuuuuuuuuk.',
  '.kuuk.kk.kuuk.',
  '.kkkk....kkkk.',
];

const face = (rows: SpriteFrame): SpriteFrame => [...HEAD, ...rows, ...BODY];

const sprite = (frames: SpriteFrame[], fps = 0): SpriteDefinition => ({
  palette: PALETTE,
  frames,
  fps,
});

export const URSO: SpriteSheet = {
  chorando: sprite(
    [
      face(['.kuutuuuuutuuk', '.kuutuukuutuuk', '..kuuuuuuuuk..']),
      face(['.kuuuuuuuuuuk.', '.kuutuukuutuuk', '..kutuuuutuk..']),
    ],
    3,
  ),
  parado: sprite([face(['.kuuuuuuuuuuk.', '.kuuuuukuuuuuk', '..kuuuuuuuuk..'])]),
  sorrindo: sprite([face(['.kuuuuuuuuuuk.', '.kuuukuuukuuuk', '..kuuukkkuuk..'])]),
};
