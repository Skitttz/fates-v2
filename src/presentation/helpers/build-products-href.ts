import { ROUTES } from '../constants/route';

export const buildProductsHref = ({ query, category }: { query?: string; category?: string }) => {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (category) params.set('category', category);

  const search = params.toString();
  return search ? `${ROUTES.PRODUCTS}?${search}` : ROUTES.PRODUCTS;
};
