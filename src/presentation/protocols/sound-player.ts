export type SoundOptions = { rate?: number; volume?: number };

export interface SoundPlayer {
  setEnabled(enabled: boolean): void;
  play(id: string, options?: SoundOptions): void;
  loop(id: string): void;
  stopLoop(id: string): void;
  playMusic(id: string): void;
  stopMusic(): void;
}
