import { ErrorState } from '@/presentation/components/feedback';
import { getErrorMessage } from '@/presentation/utils/getErrorMessage';
import { ProductsGrid } from '../ProductsGrid';
import { FeaturedProductsProps } from './types';

/** busca e renderiza os destaques; renderizado dentro de um Suspense */
export async function FeaturedProducts({ loadProducts, limit }: FeaturedProductsProps) {
  try {
    const products = await loadProducts.load();
    return <ProductsGrid products={products.slice(0, limit)} />;
  } catch (error) {
    return <ErrorState message={getErrorMessage(error)} />;
  }
}
