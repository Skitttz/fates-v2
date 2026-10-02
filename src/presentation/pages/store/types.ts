import { ReactNode } from 'react';
import { LoadProducts } from '@/domain/usecases';

export type StoreProps = {
  loadProducts: LoadProducts;
};

export type StoreLayoutProps = {
  featuredProducts: ReactNode;
};
