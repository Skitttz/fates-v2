import { Store } from '@/presentation/pages/store';
import { makeRemoteLoadProducts } from '../../usecases';

export function StoreFactory() {
  return <Store loadProducts={makeRemoteLoadProducts()} />;
}
