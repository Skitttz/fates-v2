import '@/presentation/test/mock-next-navigation';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockStoryModel } from '@/domain/test';
import { OllieMeter, StoryGame, StoryToolbar } from '.';
import { GAME_PANEL_CLASS } from './StoryGame/constants';

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 16),
  );
  vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const advance = () => userEvent.click(screen.getByRole('button', { name: 'Avançar diálogo' }));

describe('review fixes', () => {
  it('ignores auto-repeated Enter so a held key does not run through the story', async () => {
    render(<StoryGame story={mockStoryModel()} />);

    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter', repeat: true });
    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter', repeat: true });

    expect(screen.getByRole('status', { name: 'Fala atual' })).toHaveTextContent('Any narration');
  });

  it('does not let the ollie meter react to repeated keys', () => {
    const onResult = vi.fn();
    render(<OllieMeter onResult={onResult} />);

    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter', repeat: true });

    expect(onResult).not.toHaveBeenCalled();
  });

  it('does not take Enter away from other focused buttons during the ollie', () => {
    const onResult = vi.fn();
    render(
      <>
        <button type="button">Pular história</button>
        <OllieMeter onResult={onResult} />
      </>,
    );
    const skip = screen.getByRole('button', { name: 'Pular história' });

    fireEvent.keyDown(skip, { key: 'Enter', code: 'Enter' });

    expect(onResult).not.toHaveBeenCalled();
  });

  it('keeps the toolbar buttons at least 48px tall', () => {
    render(<StoryToolbar mode="game" ended={false} onSkip={vi.fn()} onToggleMode={vi.fn()} />);

    screen.getAllByRole('button').forEach((button) => {
      expect(button.className).toContain('min-h-12');
    });
  });

  it('announces the current line in a live region that stays mounted between scenes', async () => {
    render(<StoryGame story={mockStoryModel()} />);
    const live = screen.getByRole('status', { name: 'Fala atual' });
    expect(live).toHaveTextContent('Any narration');

    await advance();
    await advance();

    expect(screen.getByRole('status', { name: 'Fala atual' })).toBe(live);
    expect(live).toHaveTextContent('');
  });

  it('moves focus to the ending after skipping and back to the dialogue after restarting', async () => {
    render(<StoryGame story={mockStoryModel()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Pular história' }));
    expect(screen.getByRole('region', { name: 'Final da história' })).toHaveFocus();

    await userEvent.click(screen.getByRole('button', { name: 'Jogar de novo' }));
    expect(screen.getByRole('button', { name: 'Avançar diálogo' })).toHaveFocus();
  });

  it('renders the dialogue panel below the canvas instead of over it', () => {
    const { container } = render(<StoryGame story={mockStoryModel()} />);
    const canvas = container.querySelector('canvas[width="240"]');
    const dialogue = screen.getByRole('button', { name: 'Avançar diálogo' });

    expect(canvas?.compareDocumentPosition(dialogue)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(GAME_PANEL_CLASS).not.toMatch(/absolute/);
  });
});
