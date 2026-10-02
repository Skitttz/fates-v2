import { ProductModel } from '@/domain/models';
import { RemoteProductModel } from '../models';

export const adaptRemoteProduct = (remote: RemoteProductModel): ProductModel => ({
  id: remote.id,
  slug: remote.slug,
  name: remote.name,
  description: remote.description,
  category: remote.category,
  material: remote.material,
  price: remote.price_in_cents / 100,
  sizes: remote.sizes,
  colors: remote.colors,
  images: remote.images,
  ...(remote.tag ? { tag: remote.tag } : {}),
});
