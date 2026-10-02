import { ProductModel } from '@/domain/models';
import { getErrorMessage } from '@/presentation/utils/getErrorMessage';
import ProductsLayout from './layout';
import { ProductsProps } from './types';

export async function Products({ loadProducts, query, category }: ProductsProps) {
  let products: ProductModel[] = [];
  let error: string | undefined;

  try {
    products = await loadProducts.load({ query, category });
  } catch (err) {
    error = getErrorMessage(err);
  }

  return <ProductsLayout products={products} error={error} query={query} category={category} />;
}
