import { HtmlAudioSoundPlayer } from '@/infra/audio';
import { SoundPlayer } from '@/presentation/protocols';

export const SOUNDS_PATH = '/about/sounds';

export const makeSoundPlayer = (): SoundPlayer =>
  new HtmlAudioSoundPlayer((id) => `${SOUNDS_PATH}/${id}.mp3`);
