import { Suspense } from 'react';
import { CatalogResults, ProductsGridSkeleton } from '@/presentation/components/product';
import ProductsLayout from './layout';
import { ProductsProps } from './types';

export function Products({ loadProducts, query, category }: ProductsProps) {
  return (
    <ProductsLayout
      query={query}
      category={category}
      results={
        // a key reinicia o Suspense a cada busca, mostrando o skeleton de novo
        <Suspense key={`${query ?? ''}|${category ?? ''}`} fallback={<ProductsGridSkeleton />}>
          <CatalogResults loadProducts={loadProducts} query={query} category={category} />
        </Suspense>
      }
    />
  );
}
