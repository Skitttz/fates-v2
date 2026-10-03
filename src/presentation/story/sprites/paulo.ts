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

const pad = (rows: SpriteFrame, size: number): SpriteFrame =>
  rows.map((row) => `${'.'.repeat(size)}${row}${'.'.repeat(size)}`);

const rotateClockwise = (rows: SpriteFrame): SpriteFrame =>
  Array.from({ length: rows[0].length }, (_, column) =>
    rows
      .map((row) => row[column])
      .reverse()
      .join(''),
  );

const sprite = (frames: SpriteFrame[], fps = 0): SpriteDefinition => ({
  palette: PALETTE,
  frames,
  fps,
});

export const PAULO: SpriteSheet = {
  parado: sprite([BODY]),
  skate: sprite(
    [
      [...pad(BODY, 1), BOARD, '..krk....krk..'],
      [...pad(BODY, 1), BOARD, '..kRk....kRk..'],
    ],
    6,
  ),
  deitado: sprite([rotateClockwise(BODY)]),
  sentado: sprite([SITTING]),
};
