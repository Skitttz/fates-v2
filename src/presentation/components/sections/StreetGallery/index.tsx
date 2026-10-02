import Image from 'next/image';
import { Reveal, SectionHeading } from '@/presentation/components/ui';
import { cn } from '@/presentation/utils/cn';
import { STREET_GALLERY_ID, STREET_GALLERY_PHOTOS, STREET_GALLERY_SECTION } from './constants';

export function StreetGallery() {
  return (
    <section id={STREET_GALLERY_ID} className="scroll-mt-24">
      <SectionHeading
        eyebrow={STREET_GALLERY_SECTION.eyebrow}
        title={STREET_GALLERY_SECTION.title}
        description={STREET_GALLERY_SECTION.description}
      />
      <div className="grid grid-cols-1 gap-12 px-2 sm:grid-cols-3 sm:gap-8 lg:gap-14 xl:gap-20 2xl:px-10">
        {STREET_GALLERY_PHOTOS.map((photo, index) => (
          <Reveal key={photo.caption} delay={index * 150}>
            <figure
              className={cn(
                'group relative bg-zinc-50 p-3 pb-20 shadow-brutal-lime transition-transform duration-500 ease-out hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:scale-[1.03]',
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
              <figcaption className="absolute bottom-3 left-4 right-4 flex flex-col gap-1">
                <span className="font-marker text-xl leading-tight text-black">
                  {photo.caption}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  {photo.place}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
