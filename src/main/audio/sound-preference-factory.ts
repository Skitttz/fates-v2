import { SoundPreference } from '@/presentation/protocols';
import { makeLocalStorageAdapter } from '../cache';

export const SOUND_PREFERENCE_KEY = 'fates:about-sound';

export const makeSoundPreference = (): SoundPreference => {
  const storage = makeLocalStorageAdapter();
  return {
    load: () => storage.get<boolean>(SOUND_PREFERENCE_KEY),
    save: (enabled) => storage.set(SOUND_PREFERENCE_KEY, enabled),
  };
};
