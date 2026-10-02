import { Product } from '@/presentation/pages/product';
import { makeRemoteLoadProductBySlug } from '../../usecases';

export function ProductFactory({ slug }: { slug: string }) {
  return <Product slug={slug} loadProductBySlug={makeRemoteLoadProductBySlug()} />;
}
