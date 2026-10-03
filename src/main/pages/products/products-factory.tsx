import { Products } from '@/presentation/pages/products';
import { ProductsFilters } from '@/presentation/pages/products/types';
import { makeLoadProducts } from '../../usecases';

export function ProductsFactory({ query, category }: ProductsFilters) {
  return <Products loadProducts={makeLoadProducts()} query={query} category={category} />;
}
