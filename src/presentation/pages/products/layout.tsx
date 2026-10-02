import { CategoryFilter, SearchForm } from '@/presentation/components/product';
import { GlitchText } from '@/presentation/components/ui';
import { PRODUCTS_PAGE } from './constants';
import { ProductsLayoutProps } from './types';

export default function ProductsLayout({ query, category, results }: ProductsLayoutProps) {
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

      {results}
    </div>
  );
}
