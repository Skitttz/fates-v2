import { SpriteDefinition, SpriteFrame, SpritePalette, SpriteSheet } from './types';

const PALETTE: SpritePalette = {
  k: '#111111',
  c: '#1f2937',
  h: '#2b1d14',
  s: '#c98b5e',
  w: '#f4f4f5',
  p: '#27272a',
  b: '#e4e4e7',
  o: '#ff5a1f',
  r: '#d4d4d8',
  R: '#71717a',
};

const BODY: SpriteFrame = [
  '...kkkkkk...',
  '..kcccccck..',
  '..kcccccckkk',
  '..khhssssk..',
  '..khsskssk..',
  '..kssssssk..',
  '...kssssk...',
  '....kssk....',
  '..kkwwwwkk..',
  '.kswwwwwwsk.',
  '.kswwwwwwsk.',
  '.kswwwwwwsk.',
  '..kwwwwwwk..',
  '..kwwwwwwk..',
  '..kppppppk..',
  '..kppppppk..',
  '..kppkkppk..',
  '..kppk.kppk.',
  '..kppk.kppk.',
  '..kppk.kppk.',
  '.kbbbk.kbbbk',
  '.kkkkk.kkkkk',
];

const SITTING: SpriteFrame = [...BODY.slice(0, 16), '..kppppppbbk', '..kkkkkkkkkk'];

const BOARD = `k${'o'.repeat(12)}k`;

const WHEELS = ['..krk....krk..', '..kRk....kRk..'] as const;

const CROUCH: SpriteFrame = [
  ...BODY.slice(0, 14),
  '..kppppppk..',
  '.kppkkkkppk.',
  '.kbbbk.kbbbk',
  '.kkkkk.kkkkk',
];

const TUCK: SpriteFrame = [...BODY.slice(0, 14), '.kppkkkkppk.', '.kbbbk.kbbbk', '.kkkkk.kkkkk'];

const KNEEL: SpriteFrame = [...BODY.slice(0, 17), '..kppk.kppk.', '.kbbbk.kbbbk', '.kkkkk.kkkkk'];

const LEAN: SpriteFrame = BODY.map((row, index) => (index < 8 ? `.${row}` : `${row}.`));

const TILTED_BOARD: SpriteFrame = [
  '..........kook',
  '......kooook..',
  '..kooook......',
  '.krk..........',
];

const pad = (rows: SpriteFrame, size: number): SpriteFrame =>
  rows.map((row) => `${'.'.repeat(size)}${row}${'.'.repeat(size)}`);

const rotateCounterClockwise = (rows: SpriteFrame): SpriteFrame =>
  Array.from({ length: rows[0].length }, (_, column) =>
    rows.map((row) => row[row.length - 1 - column]).join(''),
  );

const sprite = (frames: SpriteFrame[], fps = 0): SpriteDefinition => ({
  palette: PALETTE,
  frames,
  fps,
});

const onBoard = (rows: SpriteFrame, wheels: string): SpriteFrame => [
  ...pad(rows, 1),
  BOARD,
  wheels,
];

export const PAULO: SpriteSheet = {
  moletom: { ...sprite([BODY]), palette: { ...PALETTE, w: '#166534' } },
  parado: sprite([BODY]),
  skate: sprite([onBoard(BODY, WHEELS[0]), onBoard(BODY, WHEELS[1])], 6),
  'skate-andando': sprite(
    [
      [...pad(LEAN, 1), `${BOARD}.`, `${WHEELS[0]}.`],
      [...pad(LEAN, 1), `${BOARD}.`, `${WHEELS[1]}.`],
    ],
    8,
  ),
  agachado: sprite([onBoard(CROUCH, WHEELS[0])]),
  'ollie-pop': sprite([[...pad(BODY, 1), ...TILTED_BOARD]]),
  'ollie-ar': sprite([onBoard(TUCK, WHEELS[0])]),
  'ollie-descida': sprite([onBoard(KNEEL, WHEELS[0])]),
  'deitado-costas': sprite([rotateCounterClockwise(BODY)]),
  sentado: sprite([SITTING]),
  levantando: { ...sprite([SITTING, KNEEL, BODY], 4), loop: false },
};
