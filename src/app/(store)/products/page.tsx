import type { Metadata } from 'next';
import { ProductsFactory } from '@/main/pages/products/products-factory';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Produtos',
};

type ProductsRouterProps = {
  searchParams: { q?: string | string[]; category?: string | string[] };
};

const firstValue = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

export default function ProductsRouter({ searchParams }: ProductsRouterProps) {
  return (
    <ProductsFactory
      query={firstValue(searchParams.q)}
      category={firstValue(searchParams.category)}
    />
  );
}
