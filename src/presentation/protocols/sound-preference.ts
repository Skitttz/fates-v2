export interface SoundPreference {
  load(): boolean | null;
  save(enabled: boolean): void;
}
