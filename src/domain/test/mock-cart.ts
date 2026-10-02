import { AddToCart } from '../usecases';

export const mockAddToCartParams = (
  overrides: Partial<AddToCart.Params> = {},
): AddToCart.Params => ({
  productId: 'product-id-1',
  slug: 'any-product',
  name: 'Any Product',
  image: '/images/products/any.png',
  price: 100,
  size: 'M',
  color: 'Preto',
  quantity: 1,
  ...overrides,
});
