import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GRAFFITI_COLORS, GRAFFITI_DURATION_MS } from './constants';
import { GraffitiTag } from '.';

describe('GraffitiTag', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('tags the word with the first color when it enters the viewport', () => {
    render(<GraffitiTag text="FATES" />);

    expect(screen.getByTestId('graffiti-tag')).toHaveAttribute('data-color', GRAFFITI_COLORS[0]);
  });

  it('ignores hovers while the paint is still running', () => {
    render(<GraffitiTag text="FATES" />);
    const tag = screen.getByTestId('graffiti-tag');

    fireEvent.pointerEnter(tag);

    expect(tag).toHaveAttribute('data-color', GRAFFITI_COLORS[0]);
  });

  it('re-tags over the previous paint with the next color on hover', () => {
    const { container } = render(<GraffitiTag text="FATES" />);
    const tag = screen.getByTestId('graffiti-tag');

    act(() => {
      vi.advanceTimersByTime(GRAFFITI_DURATION_MS);
    });
    fireEvent.pointerEnter(tag);

    expect(tag).toHaveAttribute('data-color', GRAFFITI_COLORS[1]);
    const fills = Array.from(container.querySelectorAll('text'), (text) =>
      text.getAttribute('fill'),
    );
    expect(fills).toContain(GRAFFITI_COLORS[0]);
    expect(fills).toContain(GRAFFITI_COLORS[1]);
  });
});
