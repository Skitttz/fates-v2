import { ReactNode } from 'react';
import { CartItemModel } from '@/domain/models';
import {
  AddToCart,
  ClearCart,
  LoadCart,
  RemoveFromCart,
  UpdateCartItemQuantity,
} from '@/domain/usecases';

export type CartContextValue = {
  items: CartItemModel[];
  ready: boolean;
  totalItems: number;
  subtotal: number;
  /** muda a cada item adicionado, usado para animar o contador */
  lastAddedAt: number;
  addItem: (params: AddToCart.Params) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
};

export type CartProviderProps = {
  children: ReactNode;
  loadCart: LoadCart;
  addToCart: AddToCart;
  removeFromCart: RemoveFromCart;
  updateCartItemQuantity: UpdateCartItemQuantity;
  clearCart: ClearCart;
};
