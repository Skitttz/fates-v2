export const STICKER_PLACES = ['caixote', 'poste', 'moletom'] as const;
export type StickerPlace = (typeof STICKER_PLACES)[number];
export type StoryMemoryModel = {
  storyId: string;
  place: StickerPlace;
  ollieLanded: boolean;
};
export const isStickerPlace = (value: unknown): value is StickerPlace =>
  STICKER_PLACES.some((place) => place === value);
