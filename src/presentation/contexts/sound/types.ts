import { ReactNode } from 'react';
import { SoundPlayer } from '@/presentation/protocols';

export interface SoundContextValue {
  available: boolean;
  enabled: boolean;
  player: SoundPlayer;
  setEnabled: (enabled: boolean) => void;
}

export interface SoundProviderProps {
  player: SoundPlayer;
  children: ReactNode;
}
