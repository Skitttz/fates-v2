import { ProductModel } from '../models';

let sequence = 0;

export const mockProductModel = (overrides: Partial<ProductModel> = {}): ProductModel => {
  sequence += 1;

  return {
    id: `product-id-${sequence}`,
    slug: `product-${sequence}`,
    name: `Product ${sequence}`,
    description: 'Any description',
    category: 'camisetas',
    material: '100% algodão',
    price: 99.9,
    sizes: ['P', 'M', 'G'],
    colors: ['Preto'],
    images: ['/images/products/any.png'],
    ...overrides,
  };
};

export const mockProductModels = (amount = 3): ProductModel[] =>
  Array.from({ length: amount }, () => mockProductModel());
