import { CANVAS_HEIGHT, CANVAS_WIDTH, MAX_VIEWPORT_HEIGHT_RATIO } from './constants';

export const computeCanvasScale = (availableWidth: number, viewportHeight: number): number => {
  const ratio = Math.min(
    availableWidth / CANVAS_WIDTH,
    (viewportHeight * MAX_VIEWPORT_HEIGHT_RATIO) / CANVAS_HEIGHT,
  );
  return ratio >= 2 ? Math.floor(ratio) : ratio;
};

export const canvasWidth = (scale: number | null): number | string =>
  scale ? CANVAS_WIDTH * scale : '100%';
