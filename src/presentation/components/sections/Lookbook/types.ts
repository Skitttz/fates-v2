import { StaticImageData } from 'next/image';

export type LookbookPhoto = {
  src: StaticImageData;
  alt: string;
  caption: string;
  rotation: string;
};
