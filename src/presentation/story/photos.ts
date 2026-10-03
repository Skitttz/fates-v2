import { StaticImageData } from 'next/image';
import { StoryModel } from '@/domain/models';
import CaixoteImg from '@/presentation/assets/mock-i-random-1.jpg';
import MoletomImg from '@/presentation/assets/mock-i-random-2.jpg';
import PosteImg from '@/presentation/assets/mock-i-random-3.jpg';

export type StoryPhoto = { src: StaticImageData; alt: string };

export const STORY_PHOTOS: Readonly<Record<string, StoryPhoto>> = {
  caixote: {
    src: CaixoteImg,
    alt: 'Adesivo da Fates colado na lateral de um caixote da pista de skate',
  },
  poste: {
    src: PosteImg,
    alt: 'Adesivos da Fates colados num poste amarelo com a pista ao fundo',
  },
  moletom: {
    src: MoletomImg,
    alt: 'Adesivos da Fates espalhados sobre um moletom verde',
  },
};

export const DEFAULT_STORY_PHOTO = 'caixote';

export const resolveStoryPhoto = (id: string | null): StoryPhoto =>
  (id ? STORY_PHOTOS[id] : undefined) ?? STORY_PHOTOS[DEFAULT_STORY_PHOTO];

export const photoForChoice = (story: StoryModel, choiceId: string | null): string | null => {
  if (!choiceId) return null;
  for (const scene of story.scenes) {
    if (scene.interaction?.type !== 'choice') continue;
    const option = scene.interaction.options.find(({ id }) => id === choiceId);
    if (option) return option.photo;
  }
  return null;
};
