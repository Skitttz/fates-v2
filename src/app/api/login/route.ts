import { NextResponse } from 'next/server';
import { simulateLatency } from '../_data/products';
import { DEMO_USER } from '../_data/users';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  await simulateLatency(500);

  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  if (body.email !== DEMO_USER.email || body.password !== DEMO_USER.password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    access_token: `fake-token-${crypto.randomUUID()}`,
  });
}
