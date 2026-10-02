import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { STICKY_HEADER_THRESHOLD } from './constants';
import { StickyHeader } from '.';

const scrollTo = async (y: number) => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  fireEvent.scroll(window);
  await act(() => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))));
};

describe('StickyHeader', () => {
  afterEach(async () => {
    await scrollTo(0);
  });

  it('starts expanded at the top of the page', () => {
    render(<StickyHeader>conteúdo</StickyHeader>);

    expect(screen.getByRole('banner')).toHaveAttribute('data-scrolled', 'false');
  });

  it('compacts after scrolling past the threshold and expands again at the top', async () => {
    render(<StickyHeader>conteúdo</StickyHeader>);
    const header = screen.getByRole('banner');

    await scrollTo(STICKY_HEADER_THRESHOLD + 1);
    expect(header).toHaveAttribute('data-scrolled', 'true');

    await scrollTo(0);
    expect(header).toHaveAttribute('data-scrolled', 'false');
  });
});
