import Image from 'next/image';
import { resolveStoryPhoto, STORY_PHOTO_SIZES } from '@/presentation/story/photos';
import { choicePhotosStyles } from './styles';
import { ChoicePhotosProps } from './types';

export function ChoicePhotos({ options, chosen }: ChoicePhotosProps) {
  return (
    <>
      {options.map((option) => {
        const visible = option.id === chosen;

        return (
          <Image
            key={option.id}
            src={resolveStoryPhoto(option.photo).src}
            alt=""
            fill
            loading="eager"
            placeholder="blur"
            sizes={STORY_PHOTO_SIZES}
            className={choicePhotosStyles({ visible })}
          />
        );
      })}
    </>
  );
}
