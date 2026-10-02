import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveViewTransition, smoothScrollTo, startPageTransition } from './view-transition';

const mockReducedMotion = (matches: boolean) =>
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches }));

describe('startPageTransition', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete (document as { startViewTransition?: unknown }).startViewTransition;
  });

  it('just navigates when the browser has no View Transitions', () => {
    mockReducedMotion(false);
    const navigate = vi.fn();

    startPageTransition(navigate);

    expect(navigate).toHaveBeenCalledOnce();
  });

  it('runs the navigation inside a view transition that waits for the new route', async () => {
    mockReducedMotion(false);
    let update: Promise<void> | undefined;
    const startViewTransition = vi.fn((callback: () => Promise<void>) => {
      update = callback();
    });
    Object.assign(document, { startViewTransition });
    const navigate = vi.fn();

    startPageTransition(navigate);
    resolveViewTransition();

    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledOnce();
    await expect(update).resolves.toBeUndefined();
  });

  it('skips the animation when the user prefers reduced motion', () => {
    mockReducedMotion(true);
    const startViewTransition = vi.fn();
    Object.assign(document, { startViewTransition });
    const navigate = vi.fn();

    startPageTransition(navigate);

    expect(startViewTransition).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledOnce();
  });
});

describe('smoothScrollTo', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('scrolls smoothly to the section and updates the hash', () => {
    mockReducedMotion(false);
    document.body.innerHTML = '<section id="lookbook"></section>';
    const section = document.getElementById('lookbook')!;
    section.scrollIntoView = vi.fn();

    expect(smoothScrollTo('#lookbook')).toBe(true);
    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(window.location.hash).toBe('#lookbook');
  });

  it('returns false when the section does not exist', () => {
    mockReducedMotion(false);
    expect(smoothScrollTo('#missing')).toBe(false);
  });
});
