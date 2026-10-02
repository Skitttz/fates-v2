import { NextResponse } from 'next/server';
import { findProducts, simulateLatency } from '../_data/products';

type OrderItem = { productId: number; size: string; color: string; quantity: number };

export async function POST(request: Request) {
  const token = request.headers.get('x-access-token');
  if (!token?.startsWith('fake-token-')) {
    return NextResponse.json({ error: 'Access denied' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { items?: OrderItem[] } | null;
  const items = body?.items ?? [];
  const catalog = findProducts({});

  const isValid =
    items.length > 0 &&
    items.every(
      (item) =>
        catalog.some((product) => product.id === item.productId) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
  }

  await simulateLatency(700);

  const total_in_cents = items.reduce((total, item) => {
    const product = catalog.find(({ id }) => id === item.productId)!;
    return total + product.price_in_cents * item.quantity;
  }, 0);

  return NextResponse.json({
    code: `FTS-${Date.now().toString(36).toUpperCase()}`,
    total_in_cents,
    created_at: new Date().toISOString(),
  });
}
