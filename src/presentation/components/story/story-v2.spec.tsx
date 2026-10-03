import '@/presentation/test/mock-next-navigation';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockStoryModel } from '@/domain/test';
import { PLACING_MS } from '@/presentation/story/engine/constants';
import { StoryGame } from '.';

const mockReducedMotion = (matches: boolean) =>
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );

const choiceOnly = () => mockStoryModel({ scenes: [mockStoryModel().scenes[2]] });

const useAnimationClock = () =>
  vi.useFakeTimers({
    shouldAdvanceTime: true,
    toFake: [
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval',
      'requestAnimationFrame',
      'cancelAnimationFrame',
      'performance',
      'Date',
    ],
  });

beforeEach(() => {
  mockReducedMotion(true);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 16),
  );
  vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const toChoice = () => userEvent.click(screen.getByRole('button', { name: 'Avançar diálogo' }));

const reachChoice = async () => {
  for (let attempt = 0; attempt < 5 && !screen.queryByRole('group'); attempt += 1) {
    await toChoice();
  }
};

describe('StoryGame v2', () => {
  it('shows the outcome of the choice on the ending', async () => {
    render(<StoryGame story={choiceOnly()} />);
    await toChoice();

    await userEvent.click(screen.getByRole('button', { name: 'Poste' }));

    expect(await screen.findByText('Any poste outcome')).toBeInTheDocument();
  });

  it('plays the placing animation before the ending and chooses only once', async () => {
    mockReducedMotion(false);
    useAnimationClock();
    render(<StoryGame story={choiceOnly()} />);
    await act(() => vi.advanceTimersByTimeAsync(2000));
    await reachChoice();

    await userEvent.click(screen.getByRole('button', { name: 'Caixote' }));

    expect(screen.queryByRole('button', { name: 'Poste' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Final da história' })).not.toBeInTheDocument();
    await act(() => vi.advanceTimersByTimeAsync(PLACING_MS + 100));
    expect(screen.getByRole('region', { name: 'Final da história' })).toBeInTheDocument();
    expect(screen.getByText('Any caixote outcome')).toBeInTheDocument();
  });

  it('skips to the ending during the placing without choosing twice', async () => {
    mockReducedMotion(false);
    useAnimationClock();
    render(<StoryGame story={choiceOnly()} />);
    await act(() => vi.advanceTimersByTimeAsync(2000));
    await reachChoice();
    await userEvent.click(screen.getByRole('button', { name: 'Caixote' }));

    await userEvent.click(screen.getByRole('button', { name: 'Pular história' }));
    await act(() => vi.advanceTimersByTimeAsync(PLACING_MS + 100));

    expect(screen.getByRole('region', { name: 'Final da história' })).toBeInTheDocument();
    expect(screen.queryByText('Any caixote outcome')).not.toBeInTheDocument();
  });
});
