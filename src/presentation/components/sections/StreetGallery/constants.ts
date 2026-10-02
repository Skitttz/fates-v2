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
    alt: 'Adesivo da Fates colado na lateral de um caixote da pista de skate, com um skatista desfocado ao fundo',
    caption: 'testemunha de toda sessão',
    place: 'lateral do caixote',
    rotation: '-rotate-3',
  },
  {
    src: RandomImg2,
    alt: 'Adesivos da Fates espalhados sobre um tecido verde',
    caption: 'antes de ganhar a rua',
    place: 'adesivos do drop 01',
    rotation: 'rotate-2',
  },
  {
    src: RandomImg3,
    alt: 'Adesivos da Fates, entre eles o ursinho de boné, colados num poste amarelo com a pista ao fundo',
    caption: 'todo poste é vitrine',
    place: 'ao lado da pista',
    rotation: '-rotate-1',
  },
];
