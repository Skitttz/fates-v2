'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getImageFit } from '@/presentation/helpers';
import { cn } from '@/presentation/utils/cn';
import { ProductGalleryProps } from './types';

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0);
  const image = images[current];

  return (
    <div className="flex flex-col gap-4">
      <div className="group relative aspect-square overflow-hidden border-2 border-zinc-800 bg-zinc-100">
        {image && (
          <Image
            key={image}
            src={image}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              'animate-page-in transition-transform duration-700 group-hover:scale-105',
              getImageFit(image) === 'contain' ? 'object-contain p-10' : 'object-cover',
            )}
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((thumb, index) => (
            <button
              key={thumb}
              type="button"
              aria-label={`Ver imagem ${index + 1} de ${name}`}
              aria-pressed={index === current}
              onClick={() => setCurrent(index)}
              className={cn(
                'relative size-20 overflow-hidden border-2 bg-zinc-100 transition-all',
                index === current
                  ? 'border-street-lime shadow-brutal-lime'
                  : 'border-zinc-800 opacity-60 hover:opacity-100',
              )}
            >
              <Image
                src={thumb}
                alt=""
                fill
                sizes="80px"
                className={getImageFit(thumb) === 'contain' ? 'object-contain p-2' : 'object-cover'}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
