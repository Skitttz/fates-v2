'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Link } from '@/presentation/components/navigation';
import { buttonVariants } from '@/presentation/components/ui';
import { resolveStoryPhoto } from '@/presentation/story/photos';
import { ENDING_ACTIONS, ENDING_LABEL } from './constants';
import { StoryEndingProps } from './types';

export function StoryEnding({ epilogue, outcome, photoId, onRestart }: StoryEndingProps) {
  const photo = resolveStoryPhoto(photoId);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    sectionRef.current?.focus();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label={ENDING_LABEL}
      tabIndex={-1}
      className="flex animate-page-in flex-col gap-6 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
    >
      <div className="relative aspect-video overflow-hidden border-4 border-zinc-50">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          placeholder="blur"
          sizes="(max-width: 1024px) 100vw, 960px"
          className="object-cover"
        />
      </div>
      {outcome && (
        <p className="font-pixel text-lg leading-relaxed text-street-lime sm:text-xl">{outcome}</p>
      )}
      <p className="font-pixel text-lg leading-relaxed text-zinc-50 sm:text-xl">{epilogue}</p>
      <div className="flex flex-wrap gap-3">
        <Link href={ENDING_ACTIONS.drop.href} className={buttonVariants({ size: 'lg' })}>
          {ENDING_ACTIONS.drop.label}
        </Link>
        <Link
          href={ENDING_ACTIONS.city.href}
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          {ENDING_ACTIONS.city.label}
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className={buttonVariants({ variant: 'ghost', size: 'lg' })}
        >
          {ENDING_ACTIONS.restart}
        </button>
      </div>
    </section>
  );
}
