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

const HEAD_TOP: SpriteFrame = [
  '...kkkkkkkk...',
  '..kccffccccck.',
  '.kccccccccccck',
  '.kuuuuuuuuuuk.',
];

const EYES = {
  frente: '.kuwewuuuwewuk',
  esquerda: '.kuewwuuuewwuk',
  direita: '.kuwweuuuwweuk',
  fechados: '.kukkkuuukkkuk',
};

const MOUTH: Readonly<Record<'neutra' | 'sorriso', SpriteFrame>> = {
  neutra: ['.kuuuuuuuuuuk.', '.kuuuuukuuuuuk', '..kuuuuuuuuk..'],
  sorriso: ['.kuuuuuuuuuuk.', '.kuuukuuukuuuk', '..kuuukkkuuk..'],
};

const BLINK_HOLD_FRAMES = 11;
const BLINK_FPS = 4;

const BODY: SpriteFrame = [
  '.kuuuuuuuuuuk.',
  'kuuvuuuuuuvuuk',
  'kuuvuuuuuuvuuk',
  '.kuuuuuuuuuuk.',
  '.kuuk.kk.kuuk.',
  '.kkkk....kkkk.',
];

const sprite = (frames: SpriteFrame[], fps = 0): SpriteDefinition => ({
  palette: PALETTE,
  frames,
  fps,
});

const face = (eyes: string, rows: SpriteFrame): SpriteFrame => [...HEAD_TOP, eyes, ...rows, ...BODY];

const blinking = (eyes: string, mouth: SpriteFrame): SpriteDefinition =>
  sprite(
    [
      ...Array.from({ length: BLINK_HOLD_FRAMES }, () => face(eyes, mouth)),
      face(EYES.fechados, mouth),
    ],
    BLINK_FPS,
  );

const withLooks = (name: string, mouth: SpriteFrame): SpriteSheet => ({
  [name]: blinking(EYES.frente, mouth),
  [`${name}-esquerda`]: blinking(EYES.esquerda, mouth),
  [`${name}-direita`]: blinking(EYES.direita, mouth),
});

export const URSO: SpriteSheet = {
  chorando: sprite(
    [
      face(EYES.frente, ['.kuutuuuuutuuk', '.kuutuukuutuuk', '..kuuuuuuuuk..']),
      face(EYES.frente, ['.kuuuuuuuuuuk.', '.kuutuukuutuuk', '..kutuuuutuk..']),
    ],
    3,
  ),
  ...withLooks('parado', MOUTH.neutra),
  ...withLooks('sorrindo', MOUTH.sorriso),
};
