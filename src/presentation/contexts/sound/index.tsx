'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UNAVAILABLE_SOUND } from './constants';
import { SoundContextValue, SoundProviderProps } from './types';

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ player, children }: SoundProviderProps) {
  const [enabled, setEnabledState] = useState(false);

  const setEnabled = useCallback(
    (value: boolean) => {
      player.setEnabled(value);
      setEnabledState(value);
    },
    [player],
  );

  useEffect(() => () => player.setEnabled(false), [player]);

  const value = useMemo(
    () => ({ available: true, enabled, player, setEnabled }),
    [enabled, player, setEnabled],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export const useSound = (): SoundContextValue => useContext(SoundContext) ?? UNAVAILABLE_SOUND;

export { MUTE_SOUND_PLAYER } from './constants';
