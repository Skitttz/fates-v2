import { CartItemModel } from '@/domain/models';
import {
  AddToCart,
  ClearCart,
  LoadCart,
  RemoveFromCart,
  UpdateCartItemQuantity,
} from '@/domain/usecases';
import { buildCartItemId, CartStorage, clampQuantity, readCart, writeCart } from './cart-storage';

export class LocalLoadCart implements LoadCart {
  constructor(
    private readonly key: string,
    private readonly storage: CartStorage,
  ) {}

  async load(): Promise<CartItemModel[]> {
    return readCart(this.storage, this.key);
  }
}

export class LocalAddToCart implements AddToCart {
  constructor(
    private readonly key: string,
    private readonly storage: CartStorage,
  ) {}

  async add(params: AddToCart.Params): Promise<CartItemModel[]> {
    const items = readCart(this.storage, this.key);
    const id = buildCartItemId(params);
    const existing = items.find((item) => item.id === id);

    if (existing) {
      return writeCart(
        this.storage,
        this.key,
        items.map((item) =>
          item.id === id
            ? { ...item, quantity: clampQuantity(item.quantity + params.quantity) }
            : item,
        ),
      );
    }

    return writeCart(this.storage, this.key, [
      ...items,
      { ...params, id, quantity: clampQuantity(params.quantity) },
    ]);
  }
}

export class LocalRemoveFromCart implements RemoveFromCart {
  constructor(
    private readonly key: string,
    private readonly storage: CartStorage,
  ) {}

  async remove(itemId: string): Promise<CartItemModel[]> {
    const items = readCart(this.storage, this.key);
    return writeCart(
      this.storage,
      this.key,
      items.filter((item) => item.id !== itemId),
    );
  }
}

export class LocalUpdateCartItemQuantity implements UpdateCartItemQuantity {
  constructor(
    private readonly key: string,
    private readonly storage: CartStorage,
  ) {}

  async update({ itemId, quantity }: UpdateCartItemQuantity.Params): Promise<CartItemModel[]> {
    const items = readCart(this.storage, this.key);

    if (quantity < 1) {
      return writeCart(
        this.storage,
        this.key,
        items.filter((item) => item.id !== itemId),
      );
    }

    return writeCart(
      this.storage,
      this.key,
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: clampQuantity(quantity) } : item,
      ),
    );
  }
}

export class LocalClearCart implements ClearCart {
  constructor(
    private readonly key: string,
    private readonly storage: CartStorage,
  ) {}

  async clear(): Promise<void> {
    this.storage.set(this.key, null);
  }
}
