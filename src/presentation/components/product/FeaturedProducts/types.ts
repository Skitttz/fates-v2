import { LoadProducts } from '@/domain/usecases';

export interface FeaturedProductsProps {
  loadProducts: LoadProducts;
  limit: number;
}
