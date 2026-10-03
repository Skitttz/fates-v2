import { SpriteFrame, SpritePalette, SpriteSheet } from './types';

export const TRANSPARENT_PIXEL = '.';

export type CreateCanvas = (width: number, height: number) => HTMLCanvasElement | null;

export type SpriteCache = Map<string, { frames: HTMLCanvasElement[]; fps: number; loop: boolean }>;

export const spriteKey = (actor: string, pose: string) => `${actor}:${pose}`;

export const createBrowserCanvas: CreateCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

export function drawPixels(
  context: CanvasRenderingContext2D,
  frame: SpriteFrame,
  palette: SpritePalette,
): void {
  frame.forEach((row, y) => {
    row.split('').forEach((pixel, x) => {
      const color = palette[pixel];
      if (pixel === TRANSPARENT_PIXEL || !color) return;
      context.fillStyle = color;
      context.fillRect(x, y, 1, 1);
    });
  });
}

const rasterize = (
  frame: SpriteFrame,
  palette: SpritePalette,
  createCanvas: CreateCanvas,
): HTMLCanvasElement | null => {
  const canvas = createCanvas(frame[0]?.length ?? 0, frame.length);
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return null;
  drawPixels(context, frame, palette);
  return canvas;
};

export function createSpriteCache(
  sheets: Readonly<Record<string, SpriteSheet>>,
  createCanvas: CreateCanvas,
): SpriteCache {
  const cache: SpriteCache = new Map();

  Object.entries(sheets).forEach(([actor, sheet]) => {
    Object.entries(sheet).forEach(([pose, definition]) => {
      const frames = definition.frames
        .map((frame) => rasterize(frame, definition.palette, createCanvas))
        .filter((frame): frame is HTMLCanvasElement => frame !== null);
      if (frames.length > 0)
        cache.set(spriteKey(actor, pose), {
          frames,
          fps: definition.fps,
          loop: definition.loop ?? true,
        });
    });
  });

  return cache;
}

export function getSpriteFrame(
  cache: SpriteCache,
  actor: string,
  pose: string,
  timeMs: number,
): HTMLCanvasElement | null {
  const entry = cache.get(spriteKey(actor, pose));
  if (!entry) return null;
  if (entry.fps <= 0 || entry.frames.length === 1) return entry.frames[0];
  const index = Math.floor((Math.max(timeMs, 0) / 1000) * entry.fps);
  return entry.loop
    ? entry.frames[index % entry.frames.length]
    : entry.frames[Math.min(index, entry.frames.length - 1)];
}
