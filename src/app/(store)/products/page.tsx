import type { Metadata } from 'next';
import { ProductsFactory } from '@/main/pages/products/products-factory';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Produtos',
};

type ProductsRouterProps = {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
};

const firstValue = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

export default async function ProductsRouter({ searchParams }: ProductsRouterProps) {
  const filters = await searchParams;
  return <ProductsFactory query={firstValue(filters.q)} category={firstValue(filters.category)} />;
}
