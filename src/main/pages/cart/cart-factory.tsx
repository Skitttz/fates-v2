'use client';

import { useState } from 'react';
import { Cart } from '@/presentation/pages/cart';
import { makePlaceOrder } from '../../usecases';

export function CartFactory() {
  const [placeOrder] = useState(makePlaceOrder);

  return <Cart placeOrder={placeOrder} />;
}
