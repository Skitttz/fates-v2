'use client';

import { useState } from 'react';
import { Cart } from '@/presentation/pages/cart';
import { makeRemotePlaceOrder } from '../../usecases';

export function CartFactory() {
  const [placeOrder] = useState(makeRemotePlaceOrder);

  return <Cart placeOrder={placeOrder} />;
}
