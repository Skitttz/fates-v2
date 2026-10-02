import { RemoteProductModel } from '../models';

export const mockRemoteProductModel = (
  overrides: Partial<RemoteProductModel> = {},
): RemoteProductModel => ({
  id: '9b4a22c2-4c27-409a-a421-754594b115f9',
  slug: 'camiseta-masculina-fates',
  name: 'Camiseta Masculina Fates',
  description: 'Any description',
  category: 'camisetas',
  material: '100% algodão',
  price: 70,
  sizes: ['P', 'M', 'G'],
  colors: ['Preto'],
  images: ['/public/images/clothings/camiseta-masculina-fates.png'],
  tag: 'DROP 01',
  createdAt: '2026-10-02T00:00:00.000Z',
  ...overrides,
});
