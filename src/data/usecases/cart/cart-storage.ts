import { CartItemModel } from '@/domain/models';
import { GetStorage, SetStorage } from '../../protocols/cache';

export type CartStorage = GetStorage & SetStorage;

export const MAX_ITEM_QUANTITY = 10;

const isCartItem = (value: unknown): value is CartItemModel =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as CartItemModel).id === 'string' &&
  typeof (value as CartItemModel).quantity === 'number';

export const readCart = (storage: GetStorage, key: string): CartItemModel[] => {
  const items = storage.get(key);
  return Array.isArray(items) ? items.filter(isCartItem) : [];
};

export const writeCart = (storage: SetStorage, key: string, items: CartItemModel[]) => {
  storage.set(key, items);
  return items;
};

export const buildCartItemId = ({
  productId,
  size,
  color,
}: Pick<CartItemModel, 'productId' | 'size' | 'color'>) => `${productId}:${size}:${color}`;

export const clampQuantity = (quantity: number) =>
  Math.min(Math.max(Math.trunc(quantity), 1), MAX_ITEM_QUANTITY);
