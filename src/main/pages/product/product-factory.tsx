import { Product } from '@/presentation/pages/product';
import { makeLoadProductBySlug } from '../../usecases';

export function ProductFactory({ slug }: { slug: string }) {
  return <Product slug={slug} loadProductBySlug={makeLoadProductBySlug()} />;
}
