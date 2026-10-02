import { CartItemModel } from '@/domain/models';

export interface CartItemRowProps {
  item: CartItemModel;
  onRemove: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}
