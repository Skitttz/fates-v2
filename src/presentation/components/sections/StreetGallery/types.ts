import { StaticImageData } from 'next/image';
import { StickerPlace } from '@/domain/models/story-memory-model';

export type StreetGalleryPhoto = {
  id: StickerPlace;
  src: StaticImageData;
  alt: string;
  caption: string;
  place: string;
  rotation: string;
};
