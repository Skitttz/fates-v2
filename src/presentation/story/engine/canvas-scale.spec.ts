import { describe, expect, it } from 'vitest';
import { canvasWidth, computeCanvasScale } from './canvas-scale';

describe('computeCanvasScale', () => {
  it('uses whole numbers when there is room for at least twice the size', () => {
    expect(computeCanvasScale(960, 900)).toBe(4);
  });

  it('keeps a fractional scale on narrow screens so the canvas fills the width', () => {
    expect(computeCanvasScale(358, 844)).toBeCloseTo(358 / 240);
  });

  it('limits the canvas by the viewport height on short landscape screens', () => {
    const scale = computeCanvasScale(812, 390);

    expect(scale * 135).toBeLessThanOrEqual(390 * 0.7);
  });
});

describe('canvasWidth', () => {
  it('fills the wrapper until the scale is known and then uses whole pixels', () => {
    expect(canvasWidth(null)).toBe('100%');
    expect(canvasWidth(3)).toBe(720);
  });
});
