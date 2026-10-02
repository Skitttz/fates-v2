'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AccessDeniedError } from '@/domain/errors';
import { useAccount } from '@/presentation/contexts/account';
import { useCart } from '@/presentation/contexts/cart';
import { getErrorMessage } from '@/presentation/utils/getErrorMessage';
import { LOGIN_REDIRECT_URL } from './constants';
import CartLayout from './layout';
import { CartProps, CheckoutStatus } from './types';

export function Cart({ placeOrder }: CartProps) {
  const router = useRouter();
  const { items, ready, subtotal, totalItems, removeItem, updateQuantity, clear } = useCart();
  const { account, signOut } = useAccount();
  const [status, setStatus] = useState<CheckoutStatus>({ type: 'idle' });

  async function handleCheckout() {
    if (!account) {
      router.push(LOGIN_REDIRECT_URL);
      return;
    }

    setStatus({ type: 'processing' });
    try {
      const order = await placeOrder.place({
        items: items.map(({ productId, size, color, quantity }) => ({
          productId,
          size,
          color,
          quantity,
        })),
      });
      await clear();
      setStatus({ type: 'done', order });
    } catch (error) {
      if (error instanceof AccessDeniedError) {
        await signOut();
        router.push(LOGIN_REDIRECT_URL);
        return;
      }
      setStatus({ type: 'error', message: getErrorMessage(error) });
    }
  }

  return (
    <CartLayout
      items={items}
      ready={ready}
      subtotal={subtotal}
      totalItems={totalItems}
      isAuthenticated={!!account}
      status={status}
      onRemove={removeItem}
      onQuantityChange={updateQuantity}
      onCheckout={handleCheckout}
    />
  );
}
