'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CartItemModel } from '@/domain/models';
import { AddToCart } from '@/domain/usecases';
import { CartContextValue, CartProviderProps } from './types';

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  loadCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
}: CartProviderProps) {
  const [items, setItems] = useState<CartItemModel[]>([]);
  const [ready, setReady] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);

  useEffect(() => {
    loadCart
      .load()
      .then(setItems)
      .finally(() => setReady(true));
  }, [loadCart]);

  const addItem = useCallback(
    async (params: AddToCart.Params) => {
      setItems(await addToCart.add(params));
      setLastAddedAt(Date.now());
    },
    [addToCart],
  );

  const removeItem = useCallback(
    async (itemId: string) => setItems(await removeFromCart.remove(itemId)),
    [removeFromCart],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) =>
      setItems(await updateCartItemQuantity.update({ itemId, quantity })),
    [updateCartItemQuantity],
  );

  const clear = useCallback(async () => {
    await clearCart.clear();
    setItems([]);
  }, [clearCart]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      lastAddedAt,
      totalItems: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }),
    [items, ready, lastAddedAt, addItem, removeItem, updateQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
