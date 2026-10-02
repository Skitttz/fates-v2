import { NextRequest, NextResponse } from 'next/server';
import { findProducts, simulateLatency } from '../_data/products';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  await simulateLatency();

  const results = findProducts({
    query: searchParams.get('q') ?? undefined,
    category: searchParams.get('category') ?? undefined,
  });

  return NextResponse.json({ results });
}
