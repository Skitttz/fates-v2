import { afterEach, describe, expect, it, vi } from 'vitest';
import { watchVisibility } from './visibility';

type Entries = { isIntersecting: boolean }[];

const stubObserver = () => {
  const observer = { report: (_: Entries) => undefined as void, disconnected: false };
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: (entries: Entries) => void) {
        observer.report = callback;
      }
      observe() {}
      disconnect() {
        observer.disconnected = true;
      }
    },
  );
  return observer;
};

const setHidden = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', { configurable: true, value: hidden });
  document.dispatchEvent(new Event('visibilitychange'));
};

afterEach(() => {
  setHidden(false);
  vi.unstubAllGlobals();
});

describe('watchVisibility', () => {
  it('reports visible at once and follows the screen', () => {
    const observer = stubObserver();
    const onChange = vi.fn();
    watchVisibility(document.createElement('canvas'), onChange);
    expect(onChange).toHaveBeenLastCalledWith(true);

    observer.report([{ isIntersecting: false }]);
    expect(onChange).toHaveBeenLastCalledWith(false);

    observer.report([{ isIntersecting: true }]);
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it('is hidden while the tab is hidden, even on screen', () => {
    stubObserver();
    const onChange = vi.fn();
    watchVisibility(document.createElement('canvas'), onChange);

    setHidden(true);
    expect(onChange).toHaveBeenLastCalledWith(false);

    setHidden(false);
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it('stops watching when released', () => {
    const observer = stubObserver();
    const onChange = vi.fn();
    const release = watchVisibility(document.createElement('canvas'), onChange);

    release();
    onChange.mockClear();
    setHidden(true);

    expect(observer.disconnected).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('works without an intersection observer', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const onChange = vi.fn();

    watchVisibility(document.createElement('canvas'), onChange);

    expect(onChange).toHaveBeenLastCalledWith(true);
  });
});
