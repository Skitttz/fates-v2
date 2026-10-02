import { describe, expect, it } from 'vitest';
import { mockAddToCartParams } from '@/domain/test';
import { StorageSpy } from '../../test';
import {
  LocalAddToCart,
  LocalClearCart,
  LocalLoadCart,
  LocalRemoveFromCart,
  LocalUpdateCartItemQuantity,
} from './local-cart';
import { MAX_ITEM_QUANTITY } from './cart-storage';

const KEY = 'cart';

const makeSut = () => {
  const storage = new StorageSpy();
  return {
    storage,
    load: new LocalLoadCart(KEY, storage),
    add: new LocalAddToCart(KEY, storage),
    remove: new LocalRemoveFromCart(KEY, storage),
    update: new LocalUpdateCartItemQuantity(KEY, storage),
    clear: new LocalClearCart(KEY, storage),
  };
};

describe('LocalCart', () => {
  it('loads an empty cart when storage is empty or corrupted', async () => {
    const { load, storage } = makeSut();
    await expect(load.load()).resolves.toEqual([]);

    storage.set(KEY, 'corrupted');
    await expect(load.load()).resolves.toEqual([]);
  });

  it('adds a new item with an id based on product, size and color', async () => {
    const { add, load } = makeSut();

    const items = await add.add(mockAddToCartParams({ productId: 7, size: 'G', color: 'Preto' }));

    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('7:G:Preto');
    await expect(load.load()).resolves.toEqual(items);
  });

  it('merges quantity when the same variant is added twice', async () => {
    const { add } = makeSut();

    await add.add(mockAddToCartParams({ quantity: 2 }));
    const items = await add.add(mockAddToCartParams({ quantity: 3 }));

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(5);
  });

  it('keeps different sizes as separate items', async () => {
    const { add } = makeSut();

    await add.add(mockAddToCartParams({ size: 'P' }));
    const items = await add.add(mockAddToCartParams({ size: 'G' }));

    expect(items).toHaveLength(2);
  });

  it('never exceeds the max quantity per item', async () => {
    const { add } = makeSut();

    const items = await add.add(mockAddToCartParams({ quantity: MAX_ITEM_QUANTITY + 5 }));

    expect(items[0].quantity).toBe(MAX_ITEM_QUANTITY);
  });

  it('updates the quantity of an item', async () => {
    const { add, update } = makeSut();
    const [item] = await add.add(mockAddToCartParams());

    const items = await update.update({ itemId: item.id, quantity: 4 });

    expect(items[0].quantity).toBe(4);
  });

  it('removes the item when quantity is updated below 1', async () => {
    const { add, update } = makeSut();
    const [item] = await add.add(mockAddToCartParams());

    await expect(update.update({ itemId: item.id, quantity: 0 })).resolves.toEqual([]);
  });

  it('removes an item by id', async () => {
    const { add, remove } = makeSut();
    await add.add(mockAddToCartParams({ size: 'P' }));
    const items = await add.add(mockAddToCartParams({ size: 'G' }));

    const result = await remove.remove(items[0].id);

    expect(result).toEqual([items[1]]);
  });

  it('clears the cart', async () => {
    const { add, clear, load } = makeSut();
    await add.add(mockAddToCartParams());

    await clear.clear();

    await expect(load.load()).resolves.toEqual([]);
  });
});
