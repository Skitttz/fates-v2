import Image from 'next/image';
import { Reveal, SectionHeading } from '@/presentation/components/ui';
import { cn } from '@/presentation/utils/cn';
import { LOOKBOOK_PHOTOS } from './constants';

export function Lookbook() {
  return (
    <section id="lookbook" className="scroll-mt-24">
      <SectionHeading
        eyebrow="#fatescrew"
        title="Lookbook"
        description="A rua é a vitrine. Cola no pico, cola o sticker, cola com a crew."
      />
      <div className="grid grid-cols-1 gap-10 px-2 sm:grid-cols-3 sm:gap-6">
        {LOOKBOOK_PHOTOS.map((photo, index) => (
          <Reveal key={photo.caption} delay={index * 150}>
            <figure
              className={cn(
                'group relative bg-zinc-50 p-3 pb-14 shadow-brutal-lime transition-transform duration-500 ease-out hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:scale-[1.03]',
                photo.rotation,
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <figcaption className="absolute bottom-3 left-4 font-marker text-xl text-black">
                {photo.caption}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
