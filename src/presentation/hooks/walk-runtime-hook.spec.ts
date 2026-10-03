import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalk } from './useWalk';

let nextId = 0;
const frames = new Map<number, FrameRequestCallback>();
const frame = (time: number) =>
  act(() => {
    const pending = Array.from(frames.values());
    frames.clear();
    pending.forEach((callback) => callback(time));
  });
beforeEach(() => {
  frames.clear();
  nextId = 0;
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frames.set(++nextId, callback);
    return nextId;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    frames.delete(id);
  });
});
afterEach(() => vi.restoreAllMocks());

describe('walk runtime React boundary', () => {
  it('keeps position across pause and does not render React for each moving frame', () => {
    let renders = 0;
    const { result, rerender } = renderHook(
      ({ active }) => {
        renders++;
        return useWalk({ active, startX: 20, targetX: 220, direction: 1, onArrive: vi.fn() });
      },
      { initialProps: { active: true } },
    );
    frame(0);
    frame(50);
    const afterStart = renders;
    for (let t = 100; t <= 400; t += 50) frame(t);
    expect(renders).toBe(afterStart);
    const x = result.current.getSnapshot().x;
    expect(x).toBeGreaterThan(20);
    rerender({ active: false });
    frame(1000);
    expect(result.current.getSnapshot()).toMatchObject({ x, vx: 0 });
    rerender({ active: true });
    frame(2000);
    expect(result.current.getSnapshot().x).toBe(x);
    frame(2050);
    expect(result.current.getSnapshot().x).toBeGreaterThan(x);
  });
});
