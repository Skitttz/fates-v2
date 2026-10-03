import { act, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGameFocus } from './useGameFocus';

function Harness({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const holding = useGameFocus(ref, enabled);
  return (
    <div>
      <section ref={ref} aria-label="jogo">
        <p>cena</p>
        <button type="button">Ler como texto</button>
      </section>
      <p>fora</p>
      <a href="#fim">fim</a>
      <output>{holding ? 'jogando' : 'livre'}</output>
    </div>
  );
}

const space = (target: Element) => {
  const event = new KeyboardEvent('keydown', {
    key: ' ',
    code: 'Space',
    bubbles: true,
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event.defaultPrevented;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useGameFocus', () => {
  it('holds space and arrows while the game is on screen and untouched', () => {
    render(<Harness />);

    expect(screen.getByText('jogando')).toBeInTheDocument();
    expect(space(document.body)).toBe(true);
  });

  it('keeps space working on a focused button of the game', () => {
    render(<Harness />);

    expect(space(screen.getByRole('button', { name: 'Ler como texto' }))).toBe(false);
  });

  it('releases the keys after a click outside and takes them back after a click inside', () => {
    render(<Harness />);

    fireEvent.pointerDown(screen.getByText('fora'));
    expect(screen.getByText('livre')).toBeInTheDocument();
    expect(space(document.body)).toBe(false);

    fireEvent.pointerDown(screen.getByText('cena'));
    expect(space(document.body)).toBe(true);
  });

  it('releases the keys after the focus leaves the game', () => {
    render(<Harness />);
    const button = screen.getByRole('button', { name: 'Ler como texto' });

    fireEvent.focusOut(button, { relatedTarget: screen.getByRole('link', { name: 'fim' }) });

    expect(space(document.body)).toBe(false);
  });

  it('releases the keys when the game leaves the screen', () => {
    let report: (entries: { isIntersecting: boolean }[]) => void = () => undefined;
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: typeof report) {
          report = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    render(<Harness />);

    act(() => report([{ isIntersecting: false }]));

    expect(space(document.body)).toBe(false);
  });

  it('never holds the keys when disabled', () => {
    render(<Harness enabled={false} />);

    expect(space(document.body)).toBe(false);
  });
});
