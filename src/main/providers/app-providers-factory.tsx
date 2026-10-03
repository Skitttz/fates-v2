'use client';

import { useState } from 'react';
import { IChildren } from '@/core/types';
import { AccountProvider } from '@/presentation/contexts/account';
import { CartProvider } from '@/presentation/contexts/cart';
import { StoryMemoryProvider } from '@/presentation/contexts/story-memory';
import { makeLocalStoryMemory } from '../usecases/local-story-memory-factory';
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
  storyMemory: makeLocalStoryMemory(),
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
      <CartProvider {...usecases.cart}>
        <StoryMemoryProvider loadMemory={usecases.storyMemory} saveMemory={usecases.storyMemory}>
          {children}
        </StoryMemoryProvider>
      </CartProvider>
    </AccountProvider>
  );
}
