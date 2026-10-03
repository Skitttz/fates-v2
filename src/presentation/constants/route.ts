export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT: (slug: string) => `/products/${slug}`,
  ABOUT: '/about',
  CART: '/cart',
  LOGIN: '/login',
} as const;
