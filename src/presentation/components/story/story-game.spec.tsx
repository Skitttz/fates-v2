import '@/presentation/test/mock-next-navigation';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UnexpectedError } from '@/domain/errors';
import { mockStoryModel } from '@/domain/test';
import { LoadStory } from '@/domain/usecases';
import { TYPEWRITER_CHAR_MS } from '@/presentation/hooks/useTypewriter';
import { StoryGame, StoryLoader } from '.';

const mockReducedMotion = (matches: boolean) =>
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );

beforeEach(() => {
  mockReducedMotion(true);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 16),
  );
  vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const advance = () => userEvent.click(screen.getByRole('button', { name: 'Avançar diálogo' }));

describe('StoryGame', () => {
  it('plays the dialogue and reaches the ollie', async () => {
    render(<StoryGame story={mockStoryModel()} />);

    expect(screen.getAllByText('Any narration').length).toBeGreaterThan(0);
    await advance();
    expect(screen.getAllByText('Any line').length).toBeGreaterThan(0);
    await advance();

    expect(screen.getByRole('button', { name: 'Ollie!' })).toBeInTheDocument();
  });

  it('advances only one line per Enter press on the dialogue button', async () => {
    render(<StoryGame story={mockStoryModel()} />);
    screen.getByRole('button', { name: 'Avançar diálogo' }).focus();

    await userEvent.keyboard('{Enter}');

    expect(screen.getAllByText('Any line').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'Ollie!' })).not.toBeInTheDocument();
  });

  it('advances with Space when nothing is focused', async () => {
    render(<StoryGame story={mockStoryModel()} />);

    fireEvent.keyDown(window, { code: 'Space', key: ' ' });

    expect(await screen.findAllByText('Any line')).not.toHaveLength(0);
  });

  it('goes from the ollie to the walk with reduced motion', async () => {
    render(<StoryGame story={mockStoryModel()} />);
    await advance();
    await advance();

    await userEvent.click(screen.getByRole('button', { name: 'Ollie!' }));

    expect(await screen.findByText('Leve o Paulo até o brilho.')).toBeInTheDocument();
  });

  it('skips to the ending and restarts', async () => {
    render(<StoryGame story={mockStoryModel()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Pular história' }));
    expect(screen.getByText('Any epilogue')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Jogar de novo' }));
    expect(screen.getAllByText('Any narration').length).toBeGreaterThan(0);
  });

  it('shows the transcript in text mode', async () => {
    render(<StoryGame story={mockStoryModel()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Ler como texto' }));

    expect(screen.getByText('Any bear line')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Avançar diálogo' })).not.toBeInTheDocument();
  });

  it('finishes the walk when the actor already is at the target', async () => {
    const base = mockStoryModel();
    const story = mockStoryModel({
      scenes: [
        {
          ...base.scenes[1],
          transitionIn: undefined,
          interaction: { type: 'walk-to', actor: 'paulo', targetX: 40 },
        },
        base.scenes[2],
      ],
    });
    render(<StoryGame story={story} />);

    expect(await screen.findAllByText('Any bear line')).not.toHaveLength(0);
  });
});

describe('StoryLoader', () => {
  it('renders the game with the loaded story', async () => {
    const loadStory: LoadStory = { load: vi.fn(async () => mockStoryModel()) };

    render(await StoryLoader({ loadStory }));

    expect(screen.getAllByText('Any narration').length).toBeGreaterThan(0);
  });

  it('renders an error state when loading fails', async () => {
    const loadStory: LoadStory = { load: vi.fn(async () => Promise.reject(new UnexpectedError())) };

    render(await StoryLoader({ loadStory }));

    expect(screen.getByRole('alert')).toHaveTextContent(new UnexpectedError().message);
  });
});

describe('reduced motion off', () => {
  it('types the text progressively', async () => {
    mockReducedMotion(false);
    vi.useFakeTimers();
    render(<StoryGame story={mockStoryModel()} />);

    expect(screen.queryByText('Any narration', { selector: 'span' })).not.toBeInTheDocument();
    for (let step = 0; step < 'Any narration'.length; step += 1) {
      await act(async () => {
        vi.advanceTimersByTime(TYPEWRITER_CHAR_MS);
      });
    }
    expect(screen.getByText('Any narration', { selector: 'span' })).toBeInTheDocument();
  });
});
