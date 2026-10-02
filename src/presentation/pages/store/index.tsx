import { ProductModel } from '@/domain/models';
import { getErrorMessage } from '@/presentation/utils/getErrorMessage';
import { FEATURED_LIMIT } from './constants';
import StoreLayout from './layout';
import { StoreProps } from './types';

export async function Store({ loadProducts }: StoreProps) {
  let products: ProductModel[] = [];
  let error: string | undefined;

  try {
    products = (await loadProducts.load()).slice(0, FEATURED_LIMIT);
  } catch (err) {
    error = getErrorMessage(err);
  }

  return <StoreLayout products={products} error={error} />;
}
