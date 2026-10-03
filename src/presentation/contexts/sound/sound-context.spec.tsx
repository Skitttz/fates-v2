import { act, render, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SoundPlayer } from '@/presentation/protocols';
import { SoundProvider, useSound } from '.';

const fakePlayer = (): SoundPlayer => ({
  setEnabled: vi.fn(),
  play: vi.fn(),
  preload: vi.fn(),
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

  it('starts disabled, toggles the player and disables it on unmount', () => {
    const player = fakePlayer();
    const { result, unmount } = renderHook(() => useSound(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SoundProvider player={player}>{children}</SoundProvider>
      ),
    });

    expect(result.current).toMatchObject({ available: true, enabled: false });
    act(() => result.current.setEnabled(true));
    expect(player.setEnabled).toHaveBeenLastCalledWith(true);
    expect(result.current.enabled).toBe(true);

    unmount();
    expect(player.setEnabled).toHaveBeenLastCalledWith(false);
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
