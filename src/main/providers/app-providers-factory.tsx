'use client';

import { useState } from 'react';
import { IChildren } from '@/core/types';
import { AccountProvider } from '@/presentation/contexts/account';
import { CartProvider } from '@/presentation/contexts/cart';
import {
  makeLocalAddToCart,
  makeLocalClearCart,
  makeLocalLoadCart,
  makeLocalLoadCurrentAccount,
  makeLocalRemoveFromCart,
  makeLocalSaveCurrentAccount,
  makeLocalUpdateCartItemQuantity,
} from '../usecases';

const makeUsecases = () => ({
  account: {
    loadCurrentAccount: makeLocalLoadCurrentAccount(),
    saveCurrentAccount: makeLocalSaveCurrentAccount(),
  },
  cart: {
    loadCart: makeLocalLoadCart(),
    addToCart: makeLocalAddToCart(),
    removeFromCart: makeLocalRemoveFromCart(),
    updateCartItemQuantity: makeLocalUpdateCartItemQuantity(),
    clearCart: makeLocalClearCart(),
  },
});

export function AppProvidersFactory({ children }: IChildren) {
  const [usecases] = useState(makeUsecases);

  return (
    <AccountProvider {...usecases.account}>
      <CartProvider {...usecases.cart}>{children}</CartProvider>
    </AccountProvider>
  );
}
