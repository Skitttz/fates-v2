import { SoundOptions, SoundPlayer } from '@/presentation/protocols';

export type CreateAudio = (src: string) => HTMLAudioElement;
export type ResolveSoundUrl = (id: string) => string;

export const MUSIC_VOLUME = 0.5;
export const EFFECT_VOLUME = 0.8;
export const CROSSFADE_MS = 600;
const FADE_STEP_MS = 50;

const createBrowserAudio: CreateAudio = (src) => new Audio(src);

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export class HtmlAudioSoundPlayer implements SoundPlayer {
  private enabled = false;
  private musicId: string | null = null;
  private readonly missing = new Set<string>();
  private readonly loops = new Set<string>();
  private readonly sustained = new Map<string, HTMLAudioElement>();
  private readonly fades = new Map<HTMLAudioElement, ReturnType<typeof setInterval>>();

  constructor(
    private readonly resolveUrl: ResolveSoundUrl,
    private readonly createAudio: CreateAudio = createBrowserAudio,
  ) {}

  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    if (!enabled) {
      this.fades.forEach((timer) => clearInterval(timer));
      this.fades.clear();
      this.sustained.forEach((audio) => audio.pause());
      return;
    }
    this.loops.forEach((id) => this.startLoop(id));
    if (this.musicId) this.fadeIn(this.musicId);
  }

  play(id: string, { rate = 1, volume = EFFECT_VOLUME }: SoundOptions = {}): void {
    if (!this.enabled || this.missing.has(id)) return;
    const audio = this.load(id);
    audio.playbackRate = rate;
    audio.preservesPitch = false;
    audio.volume = clampVolume(volume);
    this.start(audio);
  }

  loop(id: string): void {
    this.loops.add(id);
    if (this.enabled) this.startLoop(id);
  }

  stopLoop(id: string): void {
    this.loops.delete(id);
    this.sustained.get(id)?.pause();
  }

  playMusic(id: string): void {
    if (this.musicId === id) return;
    const previous = this.musicId;
    this.musicId = id;
    if (!this.enabled) return;
    if (previous) this.fadeOut(previous);
    this.fadeIn(id);
  }

  stopMusic(): void {
    if (this.musicId && this.enabled) this.fadeOut(this.musicId);
    this.musicId = null;
  }

  private load(id: string): HTMLAudioElement {
    const audio = this.createAudio(this.resolveUrl(id));
    audio.addEventListener('error', () => this.missing.add(id));
    return audio;
  }

  private start(audio: HTMLAudioElement): void {
    audio.play()?.catch(() => undefined);
  }

  private sustainedAudio(id: string): HTMLAudioElement | null {
    if (this.missing.has(id)) return null;
    const cached = this.sustained.get(id);
    if (cached) return cached;
    const audio = this.load(id);
    audio.loop = true;
    this.sustained.set(id, audio);
    return audio;
  }

  private startLoop(id: string): void {
    const audio = this.sustainedAudio(id);
    if (!audio) return;
    audio.volume = EFFECT_VOLUME;
    this.start(audio);
  }

  private fadeIn(id: string): void {
    const audio = this.sustainedAudio(id);
    if (!audio) return;
    if (audio.paused) audio.volume = 0;
    this.start(audio);
    this.fade(audio, MUSIC_VOLUME);
  }

  private fadeOut(id: string): void {
    const audio = this.sustained.get(id);
    if (audio) this.fade(audio, 0, () => audio.pause());
  }

  private fade(audio: HTMLAudioElement, to: number, onDone?: () => void): void {
    const running = this.fades.get(audio);
    if (running) clearInterval(running);
    const from = audio.volume;
    const steps = Math.max(1, Math.round(CROSSFADE_MS / FADE_STEP_MS));
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      audio.volume = clampVolume(from + (to - from) * (step / steps));
      if (step < steps) return;
      clearInterval(timer);
      this.fades.delete(audio);
      onDone?.();
    }, FADE_STEP_MS);
    this.fades.set(audio, timer);
  }
}
