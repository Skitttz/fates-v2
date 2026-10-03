import { SoundOptions, SoundPlayer } from '@/presentation/protocols';

export type ResolveSoundUrl = (id: string) => string;
export type CreateAudioContext = () => AudioContext;
export type FetchSound = (url: string) => Promise<ArrayBuffer>;

export const MUSIC_VOLUME = 0.25;
export const EFFECT_VOLUME = 0.8;
export const CROSSFADE_SECONDS = 0.6;

type Channel = { source: AudioBufferSourceNode; gain: GainNode };

const createBrowserContext: CreateAudioContext = () => new AudioContext();

const fetchBrowserSound: FetchSound = (url) =>
  fetch(url).then((response) =>
    response.ok ? response.arrayBuffer() : Promise.reject(new Error(String(response.status))),
  );

export class WebAudioSoundPlayer implements SoundPlayer {
  private context: AudioContext | null = null;
  private enabled = false;
  private musicId: string | null = null;
  private readonly loops = new Set<string>();
  private readonly preloads = new Set<string>();
  private readonly missing = new Set<string>();
  private readonly buffers = new Map<string, Promise<AudioBuffer | null>>();
  private readonly sustained = new Map<string, Channel>();
  private readonly effects = new Set<AudioBufferSourceNode>();

  constructor(
    private readonly resolveUrl: ResolveSoundUrl,
    private readonly createContext: CreateAudioContext = createBrowserContext,
    private readonly fetchSound: FetchSound = fetchBrowserSound,
  ) {}

  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    if (!enabled) {
      this.sustained.forEach(({ source }) => source.stop());
      this.sustained.clear();
      this.effects.forEach((source) => source.stop());
      this.effects.clear();
      void this.context?.suspend();
      return;
    }
    this.context ??= this.createContext();
    void this.context.resume();
    this.missing.clear();
    this.preloads.forEach((id) => void this.buffer(id));
    this.loops.forEach((id) => this.startLoop(id));
    if (this.musicId) this.startMusic(this.musicId);
  }

  resume(): void {
    if (this.enabled) void this.context?.resume();
  }

  play(id: string, { rate = 1, volume = EFFECT_VOLUME }: SoundOptions = {}): void {
    if (!this.enabled || this.missing.has(id) || !this.audible()) return;
    void this.buffer(id).then((buffer) => {
      if (!buffer || !this.enabled || !this.audible()) return;
      const { source } = this.channel(buffer, volume);
      source.playbackRate.value = rate;
      source.onended = () => this.effects.delete(source);
      this.effects.add(source);
      source.start();
    });
  }

  preload(ids: readonly string[]): void {
    ids.forEach((id) => {
      this.preloads.add(id);
      if (this.enabled) void this.buffer(id);
    });
  }

  loop(id: string): void {
    this.loops.add(id);
    if (this.enabled) this.startLoop(id);
  }

  stopLoop(id: string): void {
    this.loops.delete(id);
    this.sustained.get(id)?.source.stop();
    this.sustained.delete(id);
  }

  playMusic(id: string): void {
    if (this.musicId === id) return;
    const previous = this.musicId;
    this.musicId = id;
    if (!this.enabled) return;
    if (previous) this.fadeOut(previous);
    this.startMusic(id);
  }

  stopMusic(): void {
    if (this.musicId && this.enabled) this.fadeOut(this.musicId);
    this.musicId = null;
  }

  private audible(): boolean {
    return this.context?.state === 'running';
  }

  private buffer(id: string): Promise<AudioBuffer | null> {
    const cached = this.buffers.get(id);
    if (cached) return cached;
    const context = this.context;
    if (!context) return Promise.resolve(null);
    const loading = this.fetchSound(this.resolveUrl(id))
      .then((data) => context.decodeAudioData(data))
      .catch(() => {
        this.missing.add(id);
        this.buffers.delete(id);
        return null;
      });
    this.buffers.set(id, loading);
    return loading;
  }

  private channel(buffer: AudioBuffer, volume: number): Channel {
    const context = this.context as AudioContext;
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain).connect(context.destination);
    return { source, gain };
  }

  private startLoop(id: string): void {
    void this.buffer(id).then((buffer) => {
      if (!buffer || !this.enabled || !this.loops.has(id) || this.sustained.has(id)) return;
      const channel = this.channel(buffer, EFFECT_VOLUME);
      channel.source.loop = true;
      this.sustained.set(id, channel);
      channel.source.start();
    });
  }

  private startMusic(id: string): void {
    void this.buffer(id).then((buffer) => {
      if (!buffer || !this.enabled || this.musicId !== id || this.sustained.has(id)) return;
      const channel = this.channel(buffer, 0);
      const now = (this.context as AudioContext).currentTime;
      channel.source.loop = true;
      channel.gain.gain.setValueAtTime(0, now);
      channel.gain.gain.linearRampToValueAtTime(MUSIC_VOLUME, now + CROSSFADE_SECONDS);
      this.sustained.set(id, channel);
      channel.source.start();
    });
  }

  private fadeOut(id: string): void {
    const channel = this.sustained.get(id);
    if (!channel || !this.context) return;
    const now = this.context.currentTime;
    channel.gain.gain.cancelScheduledValues(now);
    channel.gain.gain.setValueAtTime(channel.gain.gain.value, now);
    channel.gain.gain.linearRampToValueAtTime(0, now + CROSSFADE_SECONDS);
    channel.source.stop(now + CROSSFADE_SECONDS);
    this.sustained.delete(id);
  }
}
