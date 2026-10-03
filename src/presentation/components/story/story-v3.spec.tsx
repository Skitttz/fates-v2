import '@/presentation/test/mock-next-navigation';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockStoryModel } from '@/domain/test';
import { SoundProvider } from '@/presentation/contexts/sound';
import { SoundPlayer } from '@/presentation/protocols';
import { WALK_SOUND_VOLUME } from '@/presentation/story/sounds';
import { WALK_INTRO_MS } from './StoryGame/constants';
import { StoryGame } from '.';

const mockReducedMotion = (matches: boolean) =>
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );

const fakePlayer = (): SoundPlayer => ({
  setEnabled: vi.fn(),
  play: vi.fn(),
  preload: vi.fn(),
  resume: vi.fn(),
  loop: vi.fn(),
  stopLoop: vi.fn(),
  playMusic: vi.fn(),
  stopMusic: vi.fn(),
});

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

const walkOnly = () => {
  const base = mockStoryModel();
  return mockStoryModel({
    scenes: [
      {
        ...base.scenes[1],
        transitionIn: undefined,
        interaction: {
          type: 'walk-to',
          actor: 'paulo',
          targetX: 150,
          obstacles: [{ id: 'cone', x: 84 }],
        },
      },
      base.scenes[2],
    ],
  });
};

const renderWithSound = (story = walkOnly()) => {
  const player = fakePlayer();
  render(
    <SoundProvider player={player}>
      <StoryGame story={story} />
    </SoundProvider>,
  );
  return player;
};

const advance = () => userEvent.click(screen.getByRole('button', { name: 'Avançar diálogo' }));

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

describe('StoryGame v3', () => {
  it('shows "Sua vez!" and only lets paulo move after the intro', async () => {
    mockReducedMotion(false);
    useAnimationClock();
    render(<StoryGame story={walkOnly()} />);

    expect(screen.getByText('Sua vez!')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    await act(() => vi.advanceTimersByTimeAsync(300));
    expect(screen.getByText('Sua vez!')).toBeInTheDocument();

    await act(() => vi.advanceTimersByTimeAsync(WALK_INTRO_MS));
    expect(screen.queryByText('Sua vez!')).not.toBeInTheDocument();
  });

  it('releases the controls at once with reduced motion', () => {
    render(<StoryGame story={walkOnly()} />);

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(screen.queryByText('Sua vez!')).not.toBeInTheDocument();
  });

  it('jumps with space during the walk and plays the jump sound once per key press', async () => {
    const player = renderWithSound();

    fireEvent.keyDown(window, { key: ' ', code: 'Space' });
    fireEvent.keyDown(window, { key: ' ', code: 'Space', repeat: true });
    await act(() => new Promise((resolve) => setTimeout(resolve, 60)));

    const jumps = vi.mocked(player.play).mock.calls.filter(([id]) => id === 'ollie');
    expect(jumps).toHaveLength(1);
    expect(jumps[0][1]).toEqual({ volume: WALK_SOUND_VOLUME });
  });

  it('offers a jump button on touch', () => {
    render(<StoryGame story={walkOnly()} />);

    expect(screen.getByRole('button', { name: 'Pular' })).toBeInTheDocument();
  });

  it('stops walking when the window loses focus', () => {
    const player = renderWithSound();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(player.loop).toHaveBeenCalledWith('skate-roll');

    fireEvent.blur(window);

    expect(player.stopLoop).toHaveBeenCalledWith('skate-roll');
  });

  it('leaves space to the page after a click outside during the walk', () => {
    const player = renderWithSound();
    fireEvent.pointerDown(document.body);

    const event = new KeyboardEvent('keydown', {
      key: ' ',
      code: 'Space',
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(vi.mocked(player.play).mock.calls.map(([id]) => id)).not.toContain('ollie');
  });

  it('lets space scroll the transcript in text mode', async () => {
    render(<StoryGame story={walkOnly()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ler como texto' }));
    fireEvent.pointerDown(screen.getByText('Any bear line'));

    const event = new KeyboardEvent('keydown', {
      key: ' ',
      code: 'Space',
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('plays the fall sound even when the ollie is cut short by reduced motion', async () => {
    const player = renderWithSound(mockStoryModel());
    await advance();
    await advance();

    await userEvent.click(screen.getByRole('button', { name: 'Ollie!' }));

    const played = vi.mocked(player.play).mock.calls.map(([id]) => id);
    expect(played).toContain('fall');
  });
});
