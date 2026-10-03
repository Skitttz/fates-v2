import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useGameFocus } from './useGameFocus';

function Harness() {
  const ref = useRef<HTMLElement>(null);
  const engaged = useGameFocus(ref);
  return (
    <div>
      <section ref={ref} aria-label="jogo">
        <p>cena</p>
        <button type="button">Ler como texto</button>
      </section>
      <p>fora</p>
      <output>{engaged ? 'jogando' : 'livre'}</output>
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

describe('useGameFocus', () => {
  it('lets the page scroll until the visitor interacts with the game', () => {
    render(<Harness />);

    expect(space(document.body)).toBe(false);
  });

  it('holds space and arrows for the game after an interaction inside it', () => {
    render(<Harness />);
    fireEvent.pointerDown(screen.getByText('cena'));

    expect(screen.getByText('jogando')).toBeInTheDocument();
    expect(space(document.body)).toBe(true);
  });

  it('keeps space working on a focused button of the game', () => {
    render(<Harness />);
    fireEvent.pointerDown(screen.getByText('cena'));

    expect(space(screen.getByRole('button', { name: 'Ler como texto' }))).toBe(false);
  });

  it('releases the keys after a click outside the game', () => {
    render(<Harness />);
    fireEvent.pointerDown(screen.getByText('cena'));
    fireEvent.pointerDown(screen.getByText('fora'));

    expect(screen.getByText('livre')).toBeInTheDocument();
    expect(space(document.body)).toBe(false);
  });
});
