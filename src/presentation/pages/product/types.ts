import { ProductModel } from '@/domain/models';
import { LoadProductBySlug } from '@/domain/usecases';

export type ProductProps = {
  slug: string;
  loadProductBySlug: LoadProductBySlug;
};

export type ProductLayoutProps = {
  product: ProductModel;
};
