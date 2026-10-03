import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CROSSFADE_MS,
  EFFECT_VOLUME,
  HtmlAudioSoundPlayer,
  MUSIC_VOLUME,
} from './html-audio-sound-player';

class FakeAudio {
  volume = 1;
  playbackRate = 1;
  preservesPitch = true;
  loop = false;
  paused = true;
  private listeners = new Map<string, () => void>();

  constructor(
    public src: string,
    private readonly rejects = false,
  ) {}

  play = vi.fn(() => {
    this.paused = false;
    return this.rejects ? Promise.reject(new Error('NotSupportedError')) : Promise.resolve();
  });

  pause = vi.fn(() => {
    this.paused = true;
  });

  addEventListener(type: string, listener: () => void) {
    this.listeners.set(type, listener);
  }

  emit(type: string) {
    this.listeners.get(type)?.();
  }
}

const makeSut = (rejects = false) => {
  const created: FakeAudio[] = [];
  const sut = new HtmlAudioSoundPlayer(
    (id) => `/about/sounds/${id}.mp3`,
    (src) => {
      const audio = new FakeAudio(src, rejects);
      created.push(audio);
      return audio as unknown as HTMLAudioElement;
    },
  );
  const find = (id: string) => created.filter(({ src }) => src === `/about/sounds/${id}.mp3`);
  return { sut, created, find };
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('HtmlAudioSoundPlayer', () => {
  it('stays silent and loads nothing while disabled', () => {
    const { sut, created } = makeSut();

    sut.play('ollie');
    sut.loop('skate-roll');
    sut.playMusic('music-real');

    expect(created).toHaveLength(0);
  });

  it('plays an effect with the given rate without keeping the pitch', () => {
    const { sut, find } = makeSut();
    sut.setEnabled(true);

    sut.play('text-blip', { rate: 1.25, volume: 0.3 });

    const [audio] = find('text-blip');
    expect(audio).toMatchObject({ playbackRate: 1.25, preservesPitch: false, volume: 0.3 });
    expect(audio.play).toHaveBeenCalled();
  });

  it('uses the default effect volume', () => {
    const { sut, find } = makeSut();
    sut.setEnabled(true);

    sut.play('ollie');

    expect(find('ollie')[0].volume).toBe(EFFECT_VOLUME);
  });

  it('stops requesting a sound whose file failed to load', () => {
    const { sut, find } = makeSut();
    sut.setEnabled(true);
    sut.play('fall');

    find('fall')[0].emit('error');
    sut.play('fall');

    expect(find('fall')).toHaveLength(1);
  });

  it('swallows a rejected play', async () => {
    const { sut } = makeSut(true);
    sut.setEnabled(true);

    expect(() => sut.play('ollie')).not.toThrow();
    await vi.runAllTimersAsync();
  });

  it('crossfades between musics', () => {
    const { sut, find } = makeSut();
    sut.setEnabled(true);

    sut.playMusic('music-real');
    vi.advanceTimersByTime(CROSSFADE_MS);
    const [real] = find('music-real');
    expect(real).toMatchObject({ volume: MUSIC_VOLUME, loop: true, paused: false });

    sut.playMusic('music-dream');
    vi.advanceTimersByTime(CROSSFADE_MS / 2);
    const [dream] = find('music-dream');
    expect(real.volume).toBeGreaterThan(0);
    expect(dream.volume).toBeGreaterThan(0);

    vi.advanceTimersByTime(CROSSFADE_MS);
    expect(real).toMatchObject({ volume: 0, paused: true });
    expect(dream.volume).toBe(MUSIC_VOLUME);
  });

  it('starts the remembered music and loops when enabled and pauses them when disabled', () => {
    const { sut, find } = makeSut();
    sut.playMusic('music-dream');
    sut.loop('skate-roll');

    sut.setEnabled(true);
    vi.advanceTimersByTime(CROSSFADE_MS);
    expect(find('music-dream')[0].paused).toBe(false);
    expect(find('skate-roll')[0]).toMatchObject({ paused: false, loop: true });

    sut.setEnabled(false);
    expect(find('music-dream')[0].paused).toBe(true);
    expect(find('skate-roll')[0].paused).toBe(true);
  });

  it('stops a loop and the music', () => {
    const { sut, find } = makeSut();
    sut.setEnabled(true);
    sut.loop('skate-roll');
    sut.playMusic('music-real');

    sut.stopLoop('skate-roll');
    sut.stopMusic();
    vi.advanceTimersByTime(CROSSFADE_MS);

    expect(find('skate-roll')[0].paused).toBe(true);
    expect(find('music-real')[0].paused).toBe(true);
  });
});
