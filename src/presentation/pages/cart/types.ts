import { CartItemModel, OrderModel } from '@/domain/models';
import { PlaceOrder } from '@/domain/usecases';

export type CartProps = {
  placeOrder: PlaceOrder;
};

export type CheckoutStatus =
  | { type: 'idle' }
  | { type: 'processing' }
  | { type: 'done'; order: OrderModel }
  | { type: 'error'; message: string };

export type CartLayoutProps = {
  items: CartItemModel[];
  ready: boolean;
  subtotal: number;
  totalItems: number;
  isAuthenticated: boolean;
  status: CheckoutStatus;
  onRemove: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onCheckout: () => void;
};
