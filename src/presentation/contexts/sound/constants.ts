import { SoundPlayer } from '@/presentation/protocols';
import { SoundContextValue } from './types';

const noop = () => undefined;

export const MUTE_SOUND_PLAYER: SoundPlayer = {
  setEnabled: noop,
  play: noop,
  preload: noop,
  resume: noop,
  loop: noop,
  stopLoop: noop,
  playMusic: noop,
  stopMusic: noop,
};

export const UNAVAILABLE_SOUND: SoundContextValue = {
  available: false,
  enabled: false,
  player: MUTE_SOUND_PLAYER,
  setEnabled: noop,
};

export const UNLOCK_EVENTS: readonly (keyof WindowEventMap)[] = ['pointerdown', 'keydown'];
