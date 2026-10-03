export const SPEAKER_NAMES: Readonly<Record<string, string>> = {
  paulo: 'Paulo',
  urso: 'Ursinho',
};

export const getSpeakerName = (id: string | null): string | null =>
  id === null ? null : (SPEAKER_NAMES[id] ?? id);
