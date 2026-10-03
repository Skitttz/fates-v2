import { act, fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useStoryInput } from './useStoryInput';

const defaults = {
  enabled: true,
  walking: true,
  phase: 'interaction' as const,
  sceneKey: 'walk',
  onJump: vi.fn(),
  onAdvance: vi.fn(),
};

describe('story input', () => {
  it('resumes the other held direction when the latest arrow is released', () => {
    const { result } = renderHook(() => useStoryInput(defaults));
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(result.current.direction).toBe(-1);
    fireEvent.keyDown(window, { key: 'ArrowRight', repeat: true });
    expect(result.current.direction).toBe(-1);
    fireEvent.keyUp(window, { key: 'ArrowLeft' });
    expect(result.current.direction).toBe(1);
    fireEvent.keyUp(window, { key: 'ArrowRight' });
    expect(result.current.direction).toBe(0);
  });

  it('clears held and touch directions when disabled and requires a fresh press', () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useStoryInput({ ...defaults, enabled }),
      { initialProps: { enabled: true } },
    );
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    act(() => result.current.onDirectionChange(-1));
    rerender({ enabled: false });
    expect(result.current.direction).toBe(0);
    rerender({ enabled: true });
    expect(result.current.direction).toBe(0);
  });

  it('accepts the touch that reactivates the game without needing a second press', () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useStoryInput({ ...defaults, enabled }),
      { initialProps: { enabled: false } },
    );
    act(() => result.current.onDirectionChange(1));
    rerender({ enabled: true });
    expect(result.current.direction).toBe(1);
  });

  it('does not take keyboard navigation from another focused control', () => {
    const { result } = renderHook(() => useStoryInput(defaults));
    const button = document.createElement('button');
    document.body.append(button);
    fireEvent.keyDown(button, { key: 'ArrowRight' });
    expect(result.current.direction).toBe(0);
    button.remove();
  });
});
