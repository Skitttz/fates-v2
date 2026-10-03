import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { useProgress } from './useProgress';
import { TYPEWRITER_CHAR_MS, useTypewriter } from './useTypewriter';
import { WALK_MAX_STEP_MS, WALK_SPEED, useWalk } from './useWalk';

const frames: FrameRequestCallback[] = [];
const flushFrame = (time: number) =>
  act(() => {
    const pending = frames.splice(0);
    pending.forEach((callback) => callback(time));
  });

beforeEach(() => {
  frames.length = 0;
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frames.push(callback);
    return frames.length;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
  vi.spyOn(performance, 'now').mockReturnValue(0);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('usePrefersReducedMotion', () => {
  it('reads the media query', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
  });
});

describe('useTypewriter', () => {
  it('reveals one character at a time and can be completed', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTypewriter('Oi!', false));

    expect(result.current.visibleText).toBe('');
    act(() => {
      vi.advanceTimersByTime(TYPEWRITER_CHAR_MS);
    });
    expect(result.current.visibleText).toBe('O');

    act(() => result.current.complete());
    expect(result.current).toMatchObject({ visibleText: 'Oi!', done: true });
  });

  it('shows the whole text at once when instant', () => {
    const { result } = renderHook(() => useTypewriter('Oi!', true));

    expect(result.current).toMatchObject({ visibleText: 'Oi!', done: true });
  });

  it('restarts when the text changes', () => {
    const { result, rerender } = renderHook(({ text }) => useTypewriter(text, false), {
      initialProps: { text: 'Oi' },
    });
    act(() => result.current.complete());

    rerender({ text: 'Tchau' });

    expect(result.current.visibleText).toBe('');
  });
});

describe('useWalk', () => {
  it('moves towards the direction and calls onArrive once', async () => {
    const onArrive = vi.fn();
    const { result } = renderHook(() =>
      useWalk({ active: true, startX: 100, targetX: 102, direction: 1, onArrive }),
    );

    await flushFrame(WALK_MAX_STEP_MS);
    await flushFrame(WALK_MAX_STEP_MS * 2);

    expect(result.current).toBeGreaterThan(100);
    expect(onArrive).toHaveBeenCalledTimes(1);
  });

  it('limits each step so a long pause does not teleport the actor', async () => {
    const { result } = renderHook(() =>
      useWalk({ active: true, startX: 20, targetX: 200, direction: 1, onArrive: vi.fn() }),
    );

    await flushFrame(5000);

    expect(result.current).toBeCloseTo(20 + (WALK_SPEED * WALK_MAX_STEP_MS) / 1000, 5);
  });

  it('stays still without direction', async () => {
    const { result } = renderHook(() =>
      useWalk({ active: true, startX: 20, targetX: 200, direction: 0, onArrive: vi.fn() }),
    );

    await flushFrame(16);

    expect(result.current).toBe(20);
  });
});

describe('useProgress', () => {
  it('finishes immediately when the duration is zero', () => {
    const onDone = vi.fn();
    const { result } = renderHook(() => useProgress(true, 0, onDone));

    expect(result.current).toBe(1);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('advances with animation frames and calls onDone at the end', async () => {
    const onDone = vi.fn();
    const { result } = renderHook(() => useProgress(true, 100, onDone));

    await flushFrame(50);
    expect(result.current).toBeCloseTo(0.5);

    await flushFrame(100);
    expect(result.current).toBe(1);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('stays at zero while inactive', () => {
    const { result } = renderHook(() => useProgress(false, 100, vi.fn()));

    expect(result.current).toBe(0);
  });
});

describe('useWalk target bounds', () => {
  it('arrives at a target outside the walkable area', async () => {
    const onArrive = vi.fn();
    renderHook(() => useWalk({ active: true, startX: 228, targetX: 400, direction: 1, onArrive }));

    await flushFrame(WALK_MAX_STEP_MS);
    await flushFrame(WALK_MAX_STEP_MS * 2);
    await flushFrame(WALK_MAX_STEP_MS * 3);

    expect(onArrive).toHaveBeenCalledTimes(1);
  });
});
