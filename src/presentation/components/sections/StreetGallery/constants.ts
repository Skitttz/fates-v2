import RandomImg1 from '@/presentation/assets/mock-i-random-1.jpg';
import RandomImg2 from '@/presentation/assets/mock-i-random-2.jpg';
import RandomImg3 from '@/presentation/assets/mock-i-random-3.jpg';
import { StreetGalleryPhoto } from './types';

export const STREET_GALLERY_ID = 'pela-cidade';

export const STREET_GALLERY_SECTION = {
  eyebrow: 'registros',
  title: 'Pela cidade',
  description: 'Na pista, no poste, no muro. Onde a Fates passa, fica a marca.',
};

export const STREET_GALLERY_PHOTOS: StreetGalleryPhoto[] = [
  {
    src: RandomImg1,
    alt: 'Adesivo Fates colado em um obstáculo da pista de skate',
    caption: 'pista da praça',
    rotation: '-rotate-3',
  },
  {
    src: RandomImg2,
    alt: 'Adesivos da Fates sobre um moletom verde',
    caption: 'adesivos do drop',
    rotation: 'rotate-2',
  },
  {
    src: RandomImg3,
    alt: 'Adesivos Fates colados em um poste amarelo perto da pista',
    caption: 'poste da pista',
    rotation: '-rotate-1',
  },
];
