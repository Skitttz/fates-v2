import Image from 'next/image';
import Link from 'next/link';
import HeroImg from '@/presentation/assets/hero.png';
import { buttonVariants, GlitchText, SpinningBadge } from '@/presentation/components/ui';
import { HERO_BADGE_TEXT, HERO_DEFAULTS } from './constants';
import { HeroSectionProps } from './types';

export function HeroSection({
  eyebrow = HERO_DEFAULTS.eyebrow,
  title = HERO_DEFAULTS.title,
  description = HERO_DEFAULTS.description,
  primaryCta = HERO_DEFAULTS.primaryCta,
  secondaryCta = HERO_DEFAULTS.secondaryCta,
}: HeroSectionProps) {
  return (
    <section className="grain relative isolate h-[80vh] min-h-[34rem] overflow-hidden">
      <Image
        src={HeroImg}
        alt=""
        fill
        priority
        quality={90}
        placeholder="blur"
        sizes="100vw"
        className="-z-10 animate-ken-burns object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-zinc-950 to-transparent"
      />

      <div className="mx-auto flex h-full max-w-[100em] flex-col justify-center gap-6 px-4 sm:px-8">
        <p className="animate-page-in font-marker text-xl text-street-lime sm:text-2xl">
          {eyebrow}
        </p>

        <h1
          className="animate-page-in font-display text-7xl uppercase leading-[0.85] sm:text-8xl lg:text-[10rem]"
          style={{ animationDelay: '100ms' }}
        >
          <GlitchText text={title} />
        </h1>

        <p
          className="max-w-md animate-page-in text-sm leading-relaxed text-zinc-200 sm:text-base"
          style={{ animationDelay: '200ms' }}
        >
          {description}
        </p>

        <div
          className="flex animate-page-in flex-wrap gap-4 pt-2"
          style={{ animationDelay: '300ms' }}
        >
          <Link href={primaryCta.href} className={buttonVariants({ size: 'lg' })}>
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            {secondaryCta.label}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-24 right-12 z-10 hidden sm:block">
        <SpinningBadge text={HERO_BADGE_TEXT} />
      </div>
    </section>
  );
}
