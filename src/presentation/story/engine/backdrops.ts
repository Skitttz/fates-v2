import { CANVAS_HEIGHT, CANVAS_WIDTH, EMPTY_BACKDROP_COLOR, GROUND_Y } from './constants';

type DrawBackdrop = (
  context: CanvasRenderingContext2D,
  timeMs: number,
  animated: boolean,
  focusX: number,
) => void;

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

const DREAM_PARALLAX = { far: 0.04, near: 0.1 };
const DREAM_CITY = { far: '#ebe6f2', near: '#ddd6e8', farShift: 9 };
const CITY_REPEATS = [-CANVAS_WIDTH, 0, CANVAS_WIDTH];

export const DREAM_CLOUD = { fill: '#ffffff', edge: '#e4dff0' };
export const DREAM_STAR_COLORS = ['#a78bfa', '#f472b6'] as const;
export const CLOUD_SPEED = 3;
const CLOUD_WRAP = CANVAS_WIDTH + 40;

const CLOUDS: readonly { x: number; y: number }[] = [
  { x: 14, y: 20 },
  { x: 92, y: 40 },
  { x: 150, y: 14 },
  { x: 204, y: 46 },
];

const DREAM_STARS: readonly { x: number; y: number; phase: number }[] = [
  { x: 30, y: 10, phase: 0 },
  { x: 62, y: 28, phase: 1.1 },
  { x: 118, y: 8, phase: 2.3 },
  { x: 136, y: 30, phase: 0.6 },
  { x: 176, y: 12, phase: 3.1 },
  { x: 222, y: 26, phase: 1.7 },
  { x: 88, y: 16, phase: 2.8 },
];

const drawCloud = (context: CanvasRenderingContext2D, x: number, y: number) => {
  context.fillStyle = DREAM_CLOUD.edge;
  context.fillRect(x - 1, y + 1, 20, 6);
  context.fillRect(x + 2, y - 1, 8, 3);
  context.fillRect(x + 9, y, 7, 2);
  context.fillStyle = DREAM_CLOUD.fill;
  context.fillRect(x, y + 2, 18, 4);
  context.fillRect(x + 3, y, 6, 2);
  context.fillRect(x + 10, y + 1, 5, 1);
};

const drawDreamSky = (
  context: CanvasRenderingContext2D,
  timeMs: number,
  animated: boolean,
  shift: number,
) => {
  DREAM_STARS.forEach(({ x, y, phase }, index) => {
    context.globalAlpha = animated ? 0.35 + 0.65 * ((Math.sin(timeMs / 500 + phase) + 1) / 2) : 1;
    context.fillStyle = DREAM_STAR_COLORS[index % DREAM_STAR_COLORS.length];
    context.fillRect(x, y - 1, 1, 3);
    context.fillRect(x - 1, y, 3, 1);
  });
  context.globalAlpha = 1;
  const drift = animated ? (timeMs / 1000) * CLOUD_SPEED : 0;
  CLOUDS.forEach(({ x, y }) => {
    const travelled = x - drift - shift * DREAM_PARALLAX.far;
    const position = (((travelled % CLOUD_WRAP) + CLOUD_WRAP) % CLOUD_WRAP) - 20;
    drawCloud(context, Math.round(position), y);
  });
};

const fillSky = (context: CanvasRenderingContext2D, stops: readonly [number, string][]) => {
  const gradient = context.createLinearGradient(0, 0, 0, GROUND_Y);
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  context.fillStyle = gradient;
  context.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);
};

const drawCity = (context: CanvasRenderingContext2D, color: string, offset = 0) => {
  context.fillStyle = color;
  const repeats = offset === 0 ? [0] : CITY_REPEATS;
  repeats.forEach((base) =>
    CITY.forEach(([x, width, height]) =>
      context.fillRect(x + base + offset, GROUND_Y - height, width, height),
    ),
  );
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

const drawSonho: DrawBackdrop = (context, timeMs, animated, focusX) => {
  const shift = animated ? focusX - CANVAS_WIDTH / 2 : 0;
  context.fillStyle = '#f4f1ea';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawDreamSky(context, timeMs, animated, shift);
  drawCity(context, DREAM_CITY.far, DREAM_CITY.farShift - Math.round(shift * DREAM_PARALLAX.far));
  drawCity(context, DREAM_CITY.near, -Math.round(shift * DREAM_PARALLAX.near));
  context.fillStyle = '#cbc5dc';
  context.fillRect(0, GROUND_Y, CANVAS_WIDTH, 1);
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
  focusX = CANVAS_WIDTH / 2,
): void {
  const draw = BACKDROPS[id];
  if (!draw) {
    context.fillStyle = EMPTY_BACKDROP_COLOR;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    return;
  }
  draw(context, timeMs, animated, focusX);
}
