import RandomImg1 from '@/presentation/assets/mock-i-random-1.jpg';
import RandomImg2 from '@/presentation/assets/mock-i-random-2.jpg';
import RandomImg3 from '@/presentation/assets/mock-i-random-3.jpg';
import { LookbookPhoto } from './types';

export const LOOKBOOK_SECTION = {
  eyebrow: '#fates',
  title: 'Lookbook',
  description: 'A rua é a vitrine. Cola no pico, cola o sticker, cola com quem é da rua.',
};

export const LOOKBOOK_PHOTOS: LookbookPhoto[] = [
  {
    src: RandomImg1,
    alt: 'Adesivo Fates colado em um obstáculo da pista de skate',
    caption: 'pico da praça',
    rotation: '-rotate-3',
  },
  {
    src: RandomImg2,
    alt: 'Adesivos da Fates sobre um moletom verde',
    caption: 'sticker game',
    rotation: 'rotate-2',
  },
  {
    src: RandomImg3,
    alt: 'Adesivos Fates colados em um poste amarelo perto da pista',
    caption: 'poste do skate',
    rotation: '-rotate-1',
  },
];
