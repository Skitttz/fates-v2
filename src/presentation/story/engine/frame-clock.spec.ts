import { describe, expect, it } from 'vitest';
import { createFrameClock, MAX_FRAME_STEP_MS } from './frame-clock';

describe('createFrameClock', () => {
  it('counts the scene time from the first frame of each scene', () => {
    const clock = createFrameClock();

    expect(clock.tick(1000, 'a').sceneTimeMs).toBe(0);
    expect(clock.tick(1400, 'a').sceneTimeMs).toBe(400);
    expect(clock.tick(1420, 'b').sceneTimeMs).toBe(0);
    expect(clock.tick(1500, 'b').sceneTimeMs).toBe(80);
  });

  it('caps the delta between frames', () => {
    const clock = createFrameClock();

    expect(clock.tick(0, 'a').dtMs).toBe(0);
    expect(clock.tick(16, 'a').dtMs).toBe(16);
    expect(clock.tick(5000, 'a').dtMs).toBe(MAX_FRAME_STEP_MS);
  });
});
