import '@/presentation/test/mock-next-navigation';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockStoryModel } from '@/domain/test';
import { SoundProvider } from '@/presentation/contexts/sound';
import { TYPEWRITER_CHAR_MS } from '@/presentation/hooks/useTypewriter';
import { SoundPlayer } from '@/presentation/protocols';
import { PLACING_MS } from '@/presentation/story/engine/constants';
import { BLIP_VOLUME } from '@/presentation/story/sounds';
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
  cleanup();
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

  it('loads the photos under the scene as soon as the choice appears', async () => {
    const { container } = render(<StoryGame story={choiceOnly()} />);
    await reachChoice();

    const photos = container.querySelectorAll('[aria-hidden="true"] img');
    expect(photos).toHaveLength(2);
    photos.forEach((photo) => expect(photo).toHaveAttribute('loading', 'eager'));
  });

  it('stamps the fates logo over the scene while placing', async () => {
    mockReducedMotion(false);
    useAnimationClock();
    render(<StoryGame story={choiceOnly()} />);
    await act(() => vi.advanceTimersByTimeAsync(2000));
    await reachChoice();
    expect(screen.queryByTestId('sticker-stamp')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Caixote' }));

    const stamp = screen.getByTestId('sticker-stamp');
    expect(stamp.querySelector('img')).toBeInTheDocument();
    expect(stamp.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('keeps the chosen place when skipping during the placing', async () => {
    mockReducedMotion(false);
    useAnimationClock();
    render(<StoryGame story={choiceOnly()} />);
    await act(() => vi.advanceTimersByTimeAsync(2000));
    await reachChoice();
    await userEvent.click(screen.getByRole('button', { name: 'Caixote' }));

    await userEvent.click(screen.getByRole('button', { name: 'Pular história' }));
    await act(() => vi.advanceTimersByTimeAsync(PLACING_MS + 100));

    expect(screen.getByRole('region', { name: 'Final da história' })).toBeInTheDocument();
    expect(screen.getByText('Any caixote outcome')).toBeInTheDocument();
  });
});

describe('StoryGame sound', () => {
  const renderWithSound = (story = mockStoryModel()) => {
    const player = fakePlayer();
    render(
      <SoundProvider player={player}>
        <StoryGame story={story} />
      </SoundProvider>,
    );
    return player;
  };

  it('starts with the sound on, shows it as active and lets the visitor turn it off', async () => {
    const player = renderWithSound();
    const toggle = screen.getByRole('button', { name: 'Som: ligado' });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(toggle);

    expect(player.setEnabled).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole('button', { name: 'Som: desligado' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('has no sound toggle without a provider', () => {
    render(<StoryGame story={mockStoryModel()} />);

    expect(screen.queryByRole('button', { name: /^Som:/ })).not.toBeInTheDocument();
  });

  it('plays the music of the current world and the ollie without rolling while paulo stands', async () => {
    const player = renderWithSound();
    expect(player.playMusic).toHaveBeenLastCalledWith('music-real', undefined);

    await toChoice();
    await toChoice();
    await userEvent.click(screen.getByRole('button', { name: 'Ollie!' }));

    expect(player.play).toHaveBeenCalledWith('ollie');
    expect(player.loop).not.toHaveBeenCalledWith('skate-roll');
  });

  it('rolls the skate only while paulo is moving', async () => {
    const player = renderWithSound();
    await toChoice();
    await toChoice();
    await userEvent.click(screen.getByRole('button', { name: 'Ollie!' }));
    await screen.findByText('Leve o Paulo até o brilho.');
    expect(player.loop).not.toHaveBeenCalledWith('skate-roll');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(player.loop).toHaveBeenCalledWith('skate-roll');

    fireEvent.keyUp(window, { key: 'ArrowRight' });
    expect(player.stopLoop).toHaveBeenCalledWith('skate-roll');
  });

  it('plays the menu sound on arrows and the stamp sound on choose', async () => {
    const player = renderWithSound(choiceOnly());
    await reachChoice();

    fireEvent.keyDown(screen.getByRole('button', { name: 'Caixote' }), { key: 'ArrowRight' });
    await userEvent.click(screen.getByRole('button', { name: 'Poste' }));

    expect(player.play).toHaveBeenCalledWith('menu-select');
    expect(player.play).toHaveBeenCalledWith('sticker-place');
  });

  it('skips during the ollie without finishing it or playing its sounds later', async () => {
    mockReducedMotion(false);
    useAnimationClock();
    const player = renderWithSound();
    const step = async (times: number) => {
      for (let index = 0; index < times; index += 1) {
        await act(() => vi.advanceTimersByTimeAsync(50));
      }
    };
    for (let attempt = 0; attempt < 10; attempt += 1) {
      if (screen.queryByRole('button', { name: 'Ollie!' })) break;
      await step(20);
      const advance = screen.queryByRole('button', { name: 'Avançar diálogo' });
      if (advance) await userEvent.click(advance);
    }

    await userEvent.click(screen.getByRole('button', { name: 'Ollie!' }));
    await step(4);
    await userEvent.click(screen.getByRole('button', { name: 'Pular história' }));
    await step(60);

    expect(screen.getByRole('region', { name: 'Final da história' })).toBeInTheDocument();
    const played = vi.mocked(player.play).mock.calls.map(([id]) => id);
    expect(played).toContain('ollie');
    expect(played).not.toContain('fall');
    expect(played).not.toContain('landing');
    expect(played).not.toContain('enter-dream');
  });

  it('preloads the effects but not the musics', () => {
    const player = renderWithSound();

    const [ids] = vi.mocked(player.preload).mock.calls[0];
    expect(ids).toEqual(expect.arrayContaining(['ollie', 'landing', 'fall', 'sticker-place']));
    expect(ids).not.toContain('music-real');
    expect(ids).not.toContain('music-dream');
  });

  it('plays the stamp sound when the sticker hits the scene, not on the click', async () => {
    mockReducedMotion(false);
    useAnimationClock();
    const player = renderWithSound(choiceOnly());
    await act(() => vi.advanceTimersByTimeAsync(2000));
    await reachChoice();
    const stamps = () => vi.mocked(player.play).mock.calls.filter(([id]) => id === 'sticker-place');

    await userEvent.click(screen.getByRole('button', { name: 'Caixote' }));
    expect(stamps()).toHaveLength(0);

    for (let index = 0; index < 12; index += 1) {
      await act(() => vi.advanceTimersByTimeAsync(50));
    }
    expect(stamps()).toHaveLength(1);
  });

  it('blips while the text is typed with the narration pitch', async () => {
    mockReducedMotion(false);
    useAnimationClock();
    const player = renderWithSound();

    for (let letter = 0; letter < 3; letter += 1) {
      await act(() => vi.advanceTimersByTimeAsync(TYPEWRITER_CHAR_MS));
    }

    expect(player.play).toHaveBeenCalledWith('text-blip', { rate: 0.9, volume: BLIP_VOLUME });
  });
});
