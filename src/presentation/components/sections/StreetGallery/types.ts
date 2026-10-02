import { StaticImageData } from 'next/image';

export type StreetGalleryPhoto = {
  src: StaticImageData;
  alt: string;
  caption: string;
  place: string;
  rotation: string;
};
