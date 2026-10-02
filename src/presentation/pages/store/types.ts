import { ProductModel } from '@/domain/models';
import { LoadProducts } from '@/domain/usecases';

export type StoreProps = {
  loadProducts: LoadProducts;
};

export type StoreLayoutProps = {
  products: ProductModel[];
  error?: string;
};
