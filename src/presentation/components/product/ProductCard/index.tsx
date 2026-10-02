import Image from 'next/image';
import Link from 'next/link';

import { Sticker } from '@/presentation/components/ui';
import { getCategoryLabel } from '@/presentation/constants/categories';
import { ROUTES } from '@/presentation/constants/route';
import { formatCurrency, getImageFit } from '@/presentation/helpers';
import { cn } from '@/presentation/utils/cn';
import { ProductCardProps } from './types';

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [image] = product.images;

  return (
    <Link
      href={ROUTES.PRODUCT(product.slug)}
      data-testid="product-card"
      className="group flex flex-col gap-4 focus-visible:ring-offset-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden border-2 border-zinc-800 bg-zinc-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-street-lime group-hover:shadow-brutal-lime">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              'transition-transform duration-500 ease-out group-hover:-rotate-2 group-hover:scale-110',
              getImageFit(image) === 'contain' ? 'object-contain p-8' : 'object-cover',
            )}
          />
        )}
        {product.tag && (
          <Sticker
            label={product.tag}
            className="absolute left-3 top-3 group-hover:animate-wobble"
          />
        )}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 translate-y-full bg-street-lime py-3 text-center font-display text-sm uppercase tracking-widest text-black transition-transform duration-300 group-hover:translate-y-0"
        >
          Ver peça →
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-street-yellow">
            {getCategoryLabel(product.category)}
          </span>
          <h3 className="font-display text-xl uppercase leading-tight transition-colors group-hover:text-street-lime">
            {product.name}
          </h3>
        </div>
        <p className="shrink-0 font-display text-lg">{formatCurrency(product.price)}</p>
      </div>
    </Link>
  );
}
