'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Link } from '@/presentation/components/navigation';
import { buttonVariants } from '@/presentation/components/ui';
import { resolveStoryPhoto, STORY_PHOTO_SIZES } from '@/presentation/story/photos';
import { ENDING_ACTIONS, ENDING_LABEL } from './constants';
import { storyEndingStyles } from './styles';
import { StoryEndingProps } from './types';

const DROP_CLASS = buttonVariants({ size: 'lg' });
const CITY_CLASS = buttonVariants({ variant: 'outline', size: 'lg' });
const RESTART_CLASS = buttonVariants({ variant: 'ghost', size: 'lg' });

export function StoryEnding({ epilogue, outcome, photoId, onRestart }: StoryEndingProps) {
  const photo = resolveStoryPhoto(photoId);
  const sectionRef = useRef<HTMLElement>(null);
  const styles = storyEndingStyles();

  useEffect(() => {
    sectionRef.current?.focus();
  }, []);

  return (
    <section ref={sectionRef} aria-label={ENDING_LABEL} tabIndex={-1} className={styles.root()}>
      <div className={styles.photo()}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          placeholder="blur"
          sizes={STORY_PHOTO_SIZES}
          className={styles.image()}
        />
      </div>
      {outcome && <p className={styles.outcome()}>{outcome}</p>}
      <p className={styles.epilogue()}>{epilogue}</p>
      <div className={styles.actions()}>
        <Link href={ENDING_ACTIONS.drop.href} className={DROP_CLASS}>
          {ENDING_ACTIONS.drop.label}
        </Link>
        <Link href={ENDING_ACTIONS.city.href} className={CITY_CLASS}>
          {ENDING_ACTIONS.city.label}
        </Link>
        <button type="button" onClick={onRestart} className={RESTART_CLASS}>
          {ENDING_ACTIONS.restart}
        </button>
      </div>
    </section>
  );
}
