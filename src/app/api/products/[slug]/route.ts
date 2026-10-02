import { NextResponse } from 'next/server';
import { findProductBySlug, simulateLatency } from '../../_data/products';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  await simulateLatency();

  const product = findProductBySlug(params.slug);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
