import { EmptyState, ErrorState } from '@/presentation/components/feedback';
import { Link } from '@/presentation/components/navigation';
import { buttonVariants } from '@/presentation/components/ui';
import { ROUTES } from '@/presentation/constants/route';
import { getErrorMessage } from '@/presentation/utils/getErrorMessage';
import { ProductsGrid } from '../ProductsGrid';
import { CATALOG_COUNT, CATALOG_EMPTY } from './constants';
import { CatalogResultsProps } from './types';

/** busca e renderiza o resultado do catálogo; renderizado dentro de um Suspense */
export async function CatalogResults({ loadProducts, query, category }: CatalogResultsProps) {
  let products;
  try {
    products = await loadProducts.load({ query, category });
  } catch (error) {
    return <ErrorState message={getErrorMessage(error)} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        sticker={CATALOG_EMPTY.sticker}
        title={CATALOG_EMPTY.title}
        description={CATALOG_EMPTY.description}
        action={
          <Link href={ROUTES.PRODUCTS} className={buttonVariants({ variant: 'outline' })}>
            {CATALOG_EMPTY.action}
          </Link>
        }
      />
    );
  }

  return (
    <section aria-label="Resultados" className="flex flex-col gap-6">
      <p aria-live="polite" className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        {products.length} {products.length === 1 ? CATALOG_COUNT.singular : CATALOG_COUNT.plural}
        {query && (
          <>
            {' '}
            {CATALOG_COUNT.queryPrefix} <span className="text-street-lime">“{query}”</span>
          </>
        )}
      </p>
      <ProductsGrid products={products} />
    </section>
  );
}
