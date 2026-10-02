import { notFound } from 'next/navigation';
import { NotFoundError } from '@/domain/errors';
import ProductLayout from './layout';
import { ProductProps } from './types';

export async function Product({ slug, loadProductBySlug }: ProductProps) {
  try {
    const product = await loadProductBySlug.load(slug);
    return <ProductLayout product={product} />;
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}
