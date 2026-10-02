import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnchorLink } from '.';

describe('AnchorLink', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('prevents the jump and scrolls smoothly to the section', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
    render(
      <>
        <AnchorLink href="#lookbook">Lookbook</AnchorLink>
        <section id="lookbook" />
      </>,
    );
    const section = document.getElementById('lookbook')!;
    section.scrollIntoView = vi.fn();

    const notPrevented = fireEvent.click(screen.getByRole('link', { name: 'Lookbook' }));

    expect(notPrevented).toBe(false);
    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });
});
