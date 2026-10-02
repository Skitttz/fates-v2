import type { Metadata } from 'next';
import { ProductFactory } from '@/main/pages/product/product-factory';
import { makeRemoteLoadProductBySlug } from '@/main/usecases';

export const dynamic = 'force-dynamic';

type ProductRouterProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductRouterProps): Promise<Metadata> {
  try {
    const product = await makeRemoteLoadProductBySlug().load((await params).slug);
    return { title: product.name, description: product.description };
  } catch {
    return { title: 'Produto' };
  }
}

export default async function ProductRouter({ params }: ProductRouterProps) {
  return <ProductFactory slug={(await params).slug} />;
}
