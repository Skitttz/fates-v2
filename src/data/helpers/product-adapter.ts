import { ProductModel } from '@/domain/models';
import { RemoteProductModel } from '../models';

/** a API devolve caminhos relativos (/public/...); resolve contra a origem da própria API */
export const resolveAssetUrl = (path: string, apiUrl: string): string => {
  try {
    return new URL(path, apiUrl).toString();
  } catch {
    return path;
  }
};

export const adaptRemoteProduct = (remote: RemoteProductModel, apiUrl: string): ProductModel => ({
  id: remote.id,
  slug: remote.slug,
  name: remote.name,
  description: remote.description,
  category: remote.category,
  material: remote.material,
  price: remote.price,
  sizes: remote.sizes,
  colors: remote.colors,
  images: remote.images.map((image) => resolveAssetUrl(image, apiUrl)),
  ...(remote.tag ? { tag: remote.tag } : {}),
});
