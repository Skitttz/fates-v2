import { ReactNode } from 'react';
import { LoadProducts } from '@/domain/usecases';

export type ProductsFilters = {
  query?: string;
  category?: string;
};

export type ProductsProps = ProductsFilters & {
  loadProducts: LoadProducts;
};

export type ProductsLayoutProps = ProductsFilters & {
  results: ReactNode;
};
