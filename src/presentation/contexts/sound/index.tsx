'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UNAVAILABLE_SOUND, UNLOCK_EVENTS } from './constants';
import { SoundContextValue, SoundProviderProps } from './types';

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ player, preference, children }: SoundProviderProps) {
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    const initial = preference?.load() ?? true;
    player.setEnabled(initial);
    setEnabledState(initial);
    return () => player.setEnabled(false);
  }, [player, preference]);

  useEffect(() => {
    if (!enabled) return;
    const unlock = () => player.resume();
    UNLOCK_EVENTS.forEach((type) => window.addEventListener(type, unlock));
    return () => UNLOCK_EVENTS.forEach((type) => window.removeEventListener(type, unlock));
  }, [enabled, player]);

  const setEnabled = useCallback(
    (value: boolean) => {
      player.setEnabled(value);
      setEnabledState(value);
      preference?.save(value);
    },
    [player, preference],
  );

  const value = useMemo(
    () => ({ available: true, enabled, player, setEnabled }),
    [enabled, player, setEnabled],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export const useSound = (): SoundContextValue => useContext(SoundContext) ?? UNAVAILABLE_SOUND;

export { MUTE_SOUND_PLAYER } from './constants';
