import { Suspense } from 'react';
import { FeaturedProducts, ProductsGridSkeleton } from '@/presentation/components/product';
import { FEATURED_LIMIT } from './constants';
import StoreLayout from './layout';
import { StoreProps } from './types';

export function Store({ loadProducts }: StoreProps) {
  return (
    <StoreLayout
      featuredProducts={
        <Suspense fallback={<ProductsGridSkeleton amount={FEATURED_LIMIT} />}>
          <FeaturedProducts loadProducts={loadProducts} limit={FEATURED_LIMIT} />
        </Suspense>
      }
    />
  );
}
