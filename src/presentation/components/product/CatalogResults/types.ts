import { LoadProducts } from '@/domain/usecases';

export interface CatalogResultsProps {
  loadProducts: LoadProducts;
  query?: string;
  category?: string;
}
