import { SpriteDefinition, SpriteFrame, SpritePalette, SpriteSheet } from './types';

const PALETTE: SpritePalette = {
  k: '#111111',
  p: '#f472b6',
  P: '#db2777',
  l: '#c084fc',
  c: '#e8c9a0',
  f: '#ec4899',
  w: '#ffffff',
  r: '#dc2626',
  t: '#ef4444',
};

const HEAD_TOP: SpriteFrame = [
  '.kkk.kkkkkkk.kkk',
  'klllkccfffcckllk',
  'klPkccccccccckPk',
  '.kpkkkkkkkkkkpk.',
  '.kppppppppppppk.',
  '.kppkppppppkppk.',
];

const EYES = {
  frente: '.kpwrwppppwrwpk.',
  esquerda: '.kprwwpppprwwpk.',
  direita: '.kpwwrppppwwrpk.',
  fechados: '.kpkkkppppkkkpk.',
};

const BODY: SpriteFrame = [
  '...kkppppppkk...',
  '..kPppppppppPk..',
  '..kPppppppppPk..',
  '..kppppppppppk..',
  '..kppk....kppk..',
  '..kkkk....kkkk..',
];

const BLINK_HOLD_FRAMES = 11;
const BLINK_FPS = 4;
const TEAR_FPS = 3;

type Mouth = 'triste' | 'sorriso';

type Tears = [string, string, string, string];

const DRY: Tears = ['p', 'p', 'p', 'p'];
const TEARS_A: Tears = ['t', 't', 't', 'p'];
const TEARS_B: Tears = ['p', 't', 't', 't'];

const lowerFace = (mouth: Mouth, [first, second, third, chin]: Tears): SpriteFrame => {
  const rows =
    mouth === 'triste'
      ? [
          `.kpp${first}pppppp${first}ppk.`,
          `.kpp${second}pkkkkp${second}ppk.`,
          `.kpp${third}kwppwk${third}ppk.`,
        ]
      : [
          `.kpp${first}pppppp${first}ppk.`,
          `.kpp${second}kppppk${second}ppk.`,
          `.kpp${third}pkwwkp${third}ppk.`,
        ];
  return [...rows, `..kp${chin}pppppp${chin}pk..`];
};

const frame = (eyes: string, mouth: Mouth, tears: Tears = DRY): SpriteFrame => [
  ...HEAD_TOP,
  eyes,
  ...lowerFace(mouth, tears),
  ...BODY,
];

const sprite = (frames: SpriteFrame[], fps = 0): SpriteDefinition => ({
  palette: PALETTE,
  frames,
  fps,
});

const blinking = (eyes: string, mouth: Mouth): SpriteDefinition =>
  sprite(
    [
      ...Array.from({ length: BLINK_HOLD_FRAMES }, () => frame(eyes, mouth)),
      frame(EYES.fechados, mouth),
    ],
    BLINK_FPS,
  );

const withLooks = (name: string, mouth: Mouth): SpriteSheet => ({
  [name]: blinking(EYES.frente, mouth),
  [`${name}-esquerda`]: blinking(EYES.esquerda, mouth),
  [`${name}-direita`]: blinking(EYES.direita, mouth),
});

export const URSO: SpriteSheet = {
  chorando: sprite(
    [frame(EYES.frente, 'triste', TEARS_A), frame(EYES.frente, 'triste', TEARS_B)],
    TEAR_FPS,
  ),
  ...withLooks('parado', 'triste'),
  ...withLooks('sorrindo', 'sorriso'),
};
