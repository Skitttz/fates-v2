import { act, fireEvent, render, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SoundPlayer } from '@/presentation/protocols';
import { SoundProvider, useSound } from '.';

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

describe('useSound', () => {
  it('is muted and unavailable without a provider', () => {
    const { result } = renderHook(() => useSound());

    expect(result.current).toMatchObject({ available: false, enabled: false });
    expect(() => result.current.player.play('ollie')).not.toThrow();
  });

  it('starts enabled by default, toggles the player and disables it on unmount', () => {
    const player = fakePlayer();
    const { result, unmount } = renderHook(() => useSound(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SoundProvider player={player}>{children}</SoundProvider>
      ),
    });

    expect(result.current).toMatchObject({ available: true, enabled: true });
    expect(player.setEnabled).toHaveBeenLastCalledWith(true);
    act(() => result.current.setEnabled(false));
    expect(player.setEnabled).toHaveBeenLastCalledWith(false);
    expect(result.current.enabled).toBe(false);

    unmount();
    expect(player.setEnabled).toHaveBeenLastCalledWith(false);
  });

  it('respects and saves the visitor choice', () => {
    const player = fakePlayer();
    const preference = { load: vi.fn(() => false), save: vi.fn() };
    const { result } = renderHook(() => useSound(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SoundProvider player={player} preference={preference}>
          {children}
        </SoundProvider>
      ),
    });

    expect(result.current.enabled).toBe(false);
    expect(player.setEnabled).not.toHaveBeenCalledWith(true);

    act(() => result.current.setEnabled(true));
    expect(preference.save).toHaveBeenLastCalledWith(true);
  });

  it('unlocks the audio on the first interaction while enabled', () => {
    const player = fakePlayer();
    renderHook(() => useSound(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SoundProvider player={player}>{children}</SoundProvider>
      ),
    });

    fireEvent.pointerDown(window);
    fireEvent.keyDown(window, { key: 'Enter' });

    expect(player.resume).toHaveBeenCalledTimes(2);
  });

  it('renders its children', () => {
    const { getByText } = render(
      <SoundProvider player={fakePlayer()}>
        <p>child</p>
      </SoundProvider>,
    );

    expect(getByText('child')).toBeInTheDocument();
  });
});
