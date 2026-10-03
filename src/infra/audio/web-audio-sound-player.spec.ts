import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CROSSFADE_SECONDS,
  EFFECT_VOLUME,
  MUSIC_VOLUME,
  WebAudioSoundPlayer,
} from './web-audio-sound-player';

class FakeParam {
  value = 1;
  setValueAtTime = vi.fn((value: number) => {
    this.value = value;
  });
  linearRampToValueAtTime = vi.fn((value: number) => {
    this.value = value;
  });
  cancelScheduledValues = vi.fn();
}

class FakeGain {
  gain = new FakeParam();
  connect = vi.fn((node: unknown) => node);
}

class FakeSource {
  buffer: unknown = null;
  loop = false;
  playbackRate = new FakeParam();
  onended: (() => void) | null = null;
  start = vi.fn();
  stop = vi.fn();
  connect = vi.fn((node: unknown) => node);
}

class FakeContext {
  currentTime = 10;
  destination = {};
  state = 'running';
  sources: FakeSource[] = [];
  gains: FakeGain[] = [];
  resume = vi.fn(() => Promise.resolve());
  suspend = vi.fn(() => Promise.resolve());
  decodeAudioData = vi.fn((data: ArrayBuffer) => Promise.resolve({ data }));
  createBufferSource = () => {
    const source = new FakeSource();
    this.sources.push(source);
    return source;
  };
  createGain = () => {
    const gain = new FakeGain();
    this.gains.push(gain);
    return gain;
  };
}

let context: FakeContext;
let fetchSound: ReturnType<typeof vi.fn>;
let missing: Set<string>;

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const makeSut = () =>
  new WebAudioSoundPlayer(
    (id) => `/about/sounds/${id}.mp3`,
    () => context as unknown as AudioContext,
    fetchSound as unknown as (url: string) => Promise<ArrayBuffer>,
  );

const sourceOf = (id: string) =>
  context.sources.filter(
    ({ buffer }) => (buffer as { data: string }).data === `/about/sounds/${id}.mp3`,
  );

beforeEach(() => {
  context = new FakeContext();
  missing = new Set();
  fetchSound = vi.fn((url: string) =>
    missing.has(url) ? Promise.reject(new Error('404')) : Promise.resolve(url),
  );
});

describe('WebAudioSoundPlayer', () => {
  it('stays silent and loads nothing while disabled', async () => {
    const sut = makeSut();

    sut.play('ollie');
    sut.loop('skate-roll');
    sut.playMusic('music-real');
    await flush();

    expect(fetchSound).not.toHaveBeenCalled();
    expect(context.sources).toHaveLength(0);
  });

  it('resumes the audio context when enabled', () => {
    const sut = makeSut();

    sut.setEnabled(true);

    expect(context.resume).toHaveBeenCalled();
  });

  it('plays an effect through a gain with the given rate and volume', async () => {
    const sut = makeSut();
    sut.setEnabled(true);

    sut.play('text-blip', { rate: 1.25, volume: 0.3 });
    await flush();

    const [source] = sourceOf('text-blip');
    expect(source.playbackRate.value).toBe(1.25);
    expect(source.start).toHaveBeenCalled();
    expect(context.gains.at(-1)?.gain.value).toBe(0.3);
  });

  it('uses the default effect volume and decodes each file only once', async () => {
    const sut = makeSut();
    sut.setEnabled(true);

    sut.play('ollie');
    await flush();
    sut.play('ollie');
    await flush();

    expect(context.gains.at(-1)?.gain.value).toBe(EFFECT_VOLUME);
    expect(fetchSound).toHaveBeenCalledTimes(1);
    expect(sourceOf('ollie')).toHaveLength(2);
  });

  it('stays silent when a file is missing and retries after toggling the sound', async () => {
    missing.add('/about/sounds/fall.mp3');
    const sut = makeSut();
    sut.setEnabled(true);

    expect(() => sut.play('fall')).not.toThrow();
    await flush();
    expect(sourceOf('fall')).toHaveLength(0);

    missing.clear();
    sut.setEnabled(false);
    sut.setEnabled(true);
    sut.play('fall');
    await flush();
    expect(sourceOf('fall')).toHaveLength(1);
  });

  it('crossfades between musics with gain ramps', async () => {
    const sut = makeSut();
    sut.setEnabled(true);

    sut.playMusic('music-real');
    await flush();
    const [real] = sourceOf('music-real');
    expect(real.loop).toBe(true);
    const realGain = context.gains.at(-1)!;
    expect(realGain.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(
      MUSIC_VOLUME,
      context.currentTime + CROSSFADE_SECONDS,
    );

    sut.playMusic('music-dream');
    await flush();
    expect(realGain.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(
      0,
      context.currentTime + CROSSFADE_SECONDS,
    );
    expect(real.stop).toHaveBeenCalledWith(context.currentTime + CROSSFADE_SECONDS);
    expect(sourceOf('music-dream')[0].start).toHaveBeenCalled();
  });

  it('fades the old music out and starts the new one later and slower when asked', async () => {
    const sut = makeSut();
    sut.setEnabled(true);
    sut.playMusic('music-dream');
    await flush();
    const dreamGain = context.gains.at(-1)!;

    sut.playMusic('music-real', { fadeOutSeconds: 2, delaySeconds: 1.5, fadeInSeconds: 2.5 });
    await flush();

    expect(dreamGain.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(
      0,
      context.currentTime + 2,
    );
    const [real] = sourceOf('music-real');
    expect(real.start).toHaveBeenCalledWith(context.currentTime + 1.5);
    expect(context.gains.at(-1)!.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(
      MUSIC_VOLUME,
      context.currentTime + 1.5 + 2.5,
    );
  });

  it('does not start a music that was replaced while it was loading', async () => {
    const sut = makeSut();
    sut.setEnabled(true);

    sut.playMusic('music-real');
    sut.playMusic('music-dream');
    await flush();

    expect(sourceOf('music-real')).toHaveLength(0);
    expect(sourceOf('music-dream')).toHaveLength(1);
  });

  it('starts the remembered music and loops when enabled and stops everything when disabled', async () => {
    const sut = makeSut();
    sut.playMusic('music-dream');
    sut.loop('skate-roll');

    sut.setEnabled(true);
    await flush();
    sut.play('sticker-found');
    await flush();
    expect(sourceOf('music-dream')[0].start).toHaveBeenCalled();
    expect(sourceOf('skate-roll')[0]).toMatchObject({ loop: true });

    sut.setEnabled(false);
    expect(sourceOf('music-dream')[0].stop).toHaveBeenCalled();
    expect(sourceOf('skate-roll')[0].stop).toHaveBeenCalled();
    expect(sourceOf('sticker-found')[0].stop).toHaveBeenCalled();
    expect(context.suspend).toHaveBeenCalled();
  });

  it('preloads the given sounds only once the sound is enabled', async () => {
    const sut = makeSut();

    sut.preload(['ollie', 'fall']);
    await flush();
    expect(fetchSound).not.toHaveBeenCalled();

    sut.setEnabled(true);
    await flush();
    expect(fetchSound).toHaveBeenCalledTimes(2);

    sut.play('ollie');
    await flush();
    expect(fetchSound).toHaveBeenCalledTimes(2);
    expect(sourceOf('ollie')).toHaveLength(1);
  });

  it('resumes a blocked context on demand only while enabled', () => {
    const sut = makeSut();
    sut.resume();
    expect(context.resume).not.toHaveBeenCalled();

    sut.setEnabled(true);
    context.resume.mockClear();
    sut.resume();

    expect(context.resume).toHaveBeenCalledTimes(1);
  });

  it('skips effects while the browser keeps the audio blocked', async () => {
    context.state = 'suspended';
    const sut = makeSut();
    sut.setEnabled(true);

    sut.play('text-blip');
    sut.playMusic('music-real');
    await flush();

    expect(sourceOf('text-blip')).toHaveLength(0);
    expect(sourceOf('music-real')).toHaveLength(1);
  });

  it('stops a loop', async () => {
    const sut = makeSut();
    sut.setEnabled(true);
    sut.loop('skate-roll');
    await flush();

    sut.stopLoop('skate-roll');

    expect(sourceOf('skate-roll')[0].stop).toHaveBeenCalled();
  });
});
