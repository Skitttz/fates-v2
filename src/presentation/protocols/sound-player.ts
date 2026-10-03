export type SoundOptions = { rate?: number; volume?: number };

export type MusicOptions = {
  fadeOutSeconds?: number;
  fadeInSeconds?: number;
  delaySeconds?: number;
};

export interface SoundPlayer {
  setEnabled(enabled: boolean): void;
  play(id: string, options?: SoundOptions): void;
  preload(ids: readonly string[]): void;
  resume(): void;
  loop(id: string): void;
  stopLoop(id: string): void;
  playMusic(id: string, options?: MusicOptions): void;
  stopMusic(): void;
}
