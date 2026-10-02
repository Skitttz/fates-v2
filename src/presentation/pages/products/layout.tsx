import Link from 'next/link';
import { EmptyState, ErrorState } from '@/presentation/components/feedback';
import { CategoryFilter, ProductsGrid, SearchForm } from '@/presentation/components/product';
import { buttonVariants, GlitchText } from '@/presentation/components/ui';
import { ROUTES } from '@/presentation/constants/route';
import { PRODUCTS_EMPTY, PRODUCTS_PAGE } from './constants';
import { ProductsLayoutProps } from './types';

export default function ProductsLayout({ products, error, query, category }: ProductsLayoutProps) {
  return (
    <div className="mx-auto flex max-w-[100em] flex-col gap-10 px-4 py-12 sm:px-8">
      <header className="flex flex-col gap-4">
        <span className="animate-page-in font-marker text-lg text-street-lime">
          {PRODUCTS_PAGE.eyebrow}
        </span>
        <h1 className="font-display text-6xl uppercase leading-none sm:text-8xl">
          <GlitchText text={PRODUCTS_PAGE.title} />
        </h1>
        <p className="max-w-md text-sm text-zinc-400 sm:text-base">{PRODUCTS_PAGE.description}</p>
      </header>

      <div className="flex flex-col gap-4 border-y-2 border-zinc-800 py-6 lg:flex-row lg:items-center lg:justify-between">
        <SearchForm query={query} category={category} />
        <CategoryFilter query={query} category={category} />
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : products.length === 0 ? (
        <EmptyState
          sticker={PRODUCTS_EMPTY.sticker}
          title={PRODUCTS_EMPTY.title}
          description={PRODUCTS_EMPTY.description}
          action={
            <Link href={ROUTES.PRODUCTS} className={buttonVariants({ variant: 'outline' })}>
              {PRODUCTS_EMPTY.action}
            </Link>
          }
        />
      ) : (
        <section aria-label="Resultados" className="flex flex-col gap-6">
          <p aria-live="polite" className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            {products.length} {products.length === 1 ? 'peça encontrada' : 'peças encontradas'}
            {query && (
              <>
                {' '}
                para <span className="text-street-lime">“{query}”</span>
              </>
            )}
          </p>
          <ProductsGrid products={products} />
        </section>
      )}
    </div>
  );
}
