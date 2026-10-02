import { Products } from '@/presentation/pages/products';
import { ProductsFilters } from '@/presentation/pages/products/types';
import { makeRemoteLoadProducts } from '../../usecases';

export function ProductsFactory({ query, category }: ProductsFilters) {
  return <Products loadProducts={makeRemoteLoadProducts()} query={query} category={category} />;
}
