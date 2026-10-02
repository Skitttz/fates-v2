import { ProductModel } from '@/domain/models';

export interface ProductCardProps {
  product: ProductModel;
  priority?: boolean;
}
