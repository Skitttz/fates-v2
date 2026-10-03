import { CANVAS_HEIGHT, CANVAS_WIDTH, EMPTY_BACKDROP_COLOR, GROUND_Y } from './constants';

type DrawBackdrop = (context: CanvasRenderingContext2D, timeMs: number, animated: boolean) => void;

const CITY: readonly [number, number, number][] = [
  [0, 16, 20],
  [18, 12, 32],
  [32, 20, 16],
  [54, 14, 26],
  [70, 18, 38],
  [90, 12, 22],
  [104, 22, 30],
  [128, 14, 18],
  [144, 18, 28],
  [164, 12, 40],
  [178, 20, 24],
  [200, 16, 34],
  [218, 22, 20],
];

const STARS: readonly [number, number][] = [
  [12, 10],
  [40, 24],
  [66, 8],
  [98, 30],
  [124, 14],
  [152, 6],
  [176, 26],
  [206, 12],
  [228, 34],
];

const FLOATING = [
  { x: 24, y: 30, width: 6, height: 6, color: '#c4b5fd', phase: 0 },
  { x: 70, y: 18, width: 2, height: 22, color: '#d4d4d8', phase: 1.4 },
  { x: 118, y: 40, width: 10, height: 4, color: '#e9d5ff', phase: 2.1 },
  { x: 160, y: 22, width: 5, height: 5, color: '#c4b5fd', phase: 3 },
  { x: 208, y: 46, width: 8, height: 3, color: '#e4e4e7', phase: 4.2 },
];

const fillSky = (context: CanvasRenderingContext2D, stops: readonly [number, string][]) => {
  const gradient = context.createLinearGradient(0, 0, 0, GROUND_Y);
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  context.fillStyle = gradient;
  context.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);
};

const drawCity = (context: CanvasRenderingContext2D, color: string) => {
  context.fillStyle = color;
  CITY.forEach(([x, width, height]) => context.fillRect(x, GROUND_Y - height, width, height));
};

const drawGround = (context: CanvasRenderingContext2D, top: string, bottom: string) => {
  context.fillStyle = top;
  context.fillRect(0, GROUND_Y, CANVAS_WIDTH, 4);
  context.fillStyle = bottom;
  context.fillRect(0, GROUND_Y + 4, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y - 4);
};

const drawRamp = (context: CanvasRenderingContext2D, color: string) => {
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(212, GROUND_Y);
  context.quadraticCurveTo(CANVAS_WIDTH, GROUND_Y, CANVAS_WIDTH, GROUND_Y - 28);
  context.lineTo(CANVAS_WIDTH, GROUND_Y);
  context.closePath();
  context.fill();
};

const drawPistaDia: DrawBackdrop = (context) => {
  fillSky(context, [
    [0, '#1e3a8a'],
    [0.6, '#c2410c'],
    [1, '#ff5a1f'],
  ]);
  context.fillStyle = '#ffd60a';
  context.beginPath();
  context.arc(196, 52, 12, 0, Math.PI * 2);
  context.fill();
  drawCity(context, '#1f2937');
  drawGround(context, '#71717a', '#52525b');
  drawRamp(context, '#a1a1aa');
};

const drawPistaNoite: DrawBackdrop = (context) => {
  fillSky(context, [
    [0, '#0b1026'],
    [1, '#3b0764'],
  ]);
  context.fillStyle = '#f4f4f5';
  STARS.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
  drawCity(context, '#111827');
  context.fillStyle = '#52525b';
  context.fillRect(186, 60, 2, GROUND_Y - 60);
  context.fillStyle = '#ffd60a';
  context.fillRect(182, 58, 8, 3);
  context.globalAlpha = 0.18;
  context.beginPath();
  context.moveTo(186, 61);
  context.lineTo(166, GROUND_Y);
  context.lineTo(206, GROUND_Y);
  context.closePath();
  context.fill();
  context.globalAlpha = 1;
  drawGround(context, '#3f3f46', '#27272a');
  drawRamp(context, '#52525b');
};

const drawSonho: DrawBackdrop = (context, timeMs, animated) => {
  context.fillStyle = '#f4f1ea';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawCity(context, '#ddd6e8');
  context.fillStyle = '#cbc5dc';
  context.fillRect(0, GROUND_Y, CANVAS_WIDTH, 1);
  context.strokeStyle = '#111111';
  FLOATING.forEach(({ x, y, width, height, color, phase }) => {
    const offset = animated ? Math.round(Math.sin(timeMs / 900 + phase) * 3) : 0;
    context.fillStyle = color;
    context.fillRect(x, y + offset, width, height);
    context.strokeRect(x + 0.5, y + offset + 0.5, width - 1, height - 1);
  });
};

export const BACKDROPS: Readonly<Record<string, DrawBackdrop>> = {
  'pista-dia': drawPistaDia,
  'pista-noite': drawPistaNoite,
  sonho: drawSonho,
};

export function drawBackdrop(
  context: CanvasRenderingContext2D,
  id: string,
  timeMs: number,
  animated: boolean,
): void {
  const draw = BACKDROPS[id];
  if (!draw) {
    context.fillStyle = EMPTY_BACKDROP_COLOR;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    return;
  }
  draw(context, timeMs, animated);
}
