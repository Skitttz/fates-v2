import { CartItemModel } from '../models';

export interface LoadCart {
  load: () => Promise<CartItemModel[]>;
}

export interface AddToCart {
  add: (params: AddToCart.Params) => Promise<CartItemModel[]>;
}

export namespace AddToCart {
  export type Params = Omit<CartItemModel, 'id'>;
}

export interface RemoveFromCart {
  remove: (itemId: string) => Promise<CartItemModel[]>;
}

export interface UpdateCartItemQuantity {
  update: (params: UpdateCartItemQuantity.Params) => Promise<CartItemModel[]>;
}

export namespace UpdateCartItemQuantity {
  export type Params = {
    itemId: string;
    quantity: number;
  };
}

export interface ClearCart {
  clear: () => Promise<void>;
}
