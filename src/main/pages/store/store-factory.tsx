import { Store } from '@/presentation/pages/store';
import { makeLoadProducts } from '../../usecases';

export function StoreFactory() {
  return <Store loadProducts={makeLoadProducts()} />;
}
