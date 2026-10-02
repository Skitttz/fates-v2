import { Link } from '@/presentation/components/navigation';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { AddToCartForm, ProductGallery } from '@/presentation/components/product';
import { Sticker } from '@/presentation/components/ui';
import { getCategoryLabel } from '@/presentation/constants/categories';
import { ROUTES } from '@/presentation/constants/route';
import { buildProductsHref, formatCurrency } from '@/presentation/helpers';
import { PRODUCT_PERKS } from './constants';
import { ProductLayoutProps } from './types';

export default function ProductLayout({ product }: ProductLayoutProps) {
  return (
    <div className="mx-auto flex max-w-[100em] flex-col gap-8 px-4 py-10 sm:px-8">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={ROUTES.HOME} className="hover:text-street-lime">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={buildProductsHref({ category: product.category })}
              className="hover:text-street-lime"
            >
              {getCategoryLabel(product.category)}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-zinc-300">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="animate-page-in">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div
          className="flex animate-page-in flex-col gap-8 lg:sticky lg:top-28 lg:self-start"
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-street-yellow">
                {getCategoryLabel(product.category)}
              </span>
              {product.tag && <Sticker label={product.tag} animated />}
            </div>
            <h1 className="font-display text-5xl uppercase leading-[0.9] sm:text-6xl">
              {product.name}
            </h1>
            <p className="font-display text-3xl text-street-lime">
              {formatCurrency(product.price)}
            </p>
            <p className="max-w-lg leading-relaxed text-zinc-300">{product.description}</p>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Material: <span className="normal-case text-zinc-400">{product.material}</span>
            </p>
          </div>

          <AddToCartForm product={product} />

          <ul className="flex flex-col gap-2 border-t-2 border-dashed border-zinc-800 pt-6 text-sm text-zinc-400">
            {PRODUCT_PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <CheckBadgeIcon className="size-4 text-street-lime" /> {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
