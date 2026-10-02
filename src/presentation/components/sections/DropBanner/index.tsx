import Image from 'next/image';
import { Link } from '@/presentation/components/navigation';
import LaunchImg from '@/presentation/assets/lancamento.jpg';
import { Reveal } from '@/presentation/components/ui';
import { ROUTES } from '@/presentation/constants/route';
import { DROP_BANNER } from './constants';

export function DropBanner() {
  return (
    <Reveal as="section" aria-label="Lançamento">
      <Link
        href={ROUTES.PRODUCTS}
        className="group relative block overflow-hidden border-2 border-zinc-800 transition-all duration-300 hover:border-street-lime hover:shadow-brutal-lime"
      >
        <Image
          src={LaunchImg}
          alt={DROP_BANNER.alt}
          placeholder="blur"
          sizes="(max-width: 1600px) 100vw, 1600px"
          className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute bottom-3 right-3 -rotate-3 border-2 border-black bg-street-orange px-4 py-2 font-display text-sm uppercase tracking-widest text-black shadow-brutal transition-transform group-hover:rotate-0 group-hover:scale-110 sm:bottom-6 sm:right-6 sm:text-base">
          {DROP_BANNER.cta}
        </span>
      </Link>
    </Reveal>
  );
}
