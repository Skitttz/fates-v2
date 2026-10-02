import { Link } from '@/presentation/components/navigation';
import {
  DropBanner,
  HeroSection,
  MarqueeBand,
  StreetGallery,
} from '@/presentation/components/sections';
import { buttonVariants, SectionHeading } from '@/presentation/components/ui';
import { ROUTES } from '@/presentation/constants/route';
import { FEATURED_SECTION } from './constants';
import { StoreLayoutProps } from './types';

export default function StoreLayout({ featuredProducts }: StoreLayoutProps) {
  return (
    <div className="w-full">
      <HeroSection />
      <MarqueeBand />

      <div className="mx-auto flex max-w-[100em] flex-col gap-24 px-4 pt-8 sm:px-8">
        <section aria-labelledby="featured-title">
          <SectionHeading
            id="featured-title"
            eyebrow={FEATURED_SECTION.eyebrow}
            title={FEATURED_SECTION.title}
            description={FEATURED_SECTION.description}
            action={
              <Link
                href={ROUTES.PRODUCTS}
                className={buttonVariants({ variant: 'ghost', className: 'hidden sm:inline-flex' })}
              >
                Ver tudo →
              </Link>
            }
          />
          {featuredProducts}
        </section>

        <DropBanner />
        <StreetGallery />
      </div>
    </div>
  );
}
