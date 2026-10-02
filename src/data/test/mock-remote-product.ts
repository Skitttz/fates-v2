import { RemoteProductModel } from '../models';

export const mockRemoteProductModel = (
  overrides: Partial<RemoteProductModel> = {},
): RemoteProductModel => ({
  id: 1,
  slug: 'camiseta-basic-fates',
  name: 'Camiseta Basic Fates',
  description: 'Any description',
  category: 'camisetas',
  material: '100% algodão',
  price_in_cents: 8990,
  sizes: ['P', 'M', 'G'],
  colors: ['Preto'],
  images: ['/images/products/camiseta-basic-fates.png'],
  tag: 'DROP 01',
  ...overrides,
});
