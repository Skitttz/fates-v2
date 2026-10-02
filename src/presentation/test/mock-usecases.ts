import { vi } from 'vitest';
import { AccountModel, CartItemModel } from '@/domain/models';
import {
  AddToCart,
  Authentication,
  ClearCart,
  LoadCart,
  LoadCurrentAccount,
  PlaceOrder,
  RemoveFromCart,
  SaveCurrentAccount,
  UpdateCartItemQuantity,
} from '@/domain/usecases';
import { Validation } from '../protocols';

export class ValidationStub implements Validation {
  errors: Record<string, string | null> = {};

  validate(fieldName: string): string | null {
    return this.errors[fieldName] ?? null;
  }
}

export class AuthenticationSpy implements Authentication {
  params?: Authentication.Params;
  callsCount = 0;
  account: AccountModel = { name: 'Fates Crew', email: 'demo@fates.com', accessToken: 'token' };
  error?: Error;

  async auth(params: Authentication.Params): Promise<AccountModel> {
    this.params = params;
    this.callsCount += 1;
    if (this.error) throw this.error;
    return this.account;
  }
}

export class InMemoryAccount implements LoadCurrentAccount, SaveCurrentAccount {
  constructor(public account: AccountModel | null = null) {}

  async load() {
    return this.account;
  }

  async save(account: AccountModel | null) {
    this.account = account;
  }
}

export class InMemoryCart
  implements LoadCart, AddToCart, RemoveFromCart, UpdateCartItemQuantity, ClearCart
{
  constructor(public items: CartItemModel[] = []) {}

  async load() {
    return this.items;
  }

  async add(params: AddToCart.Params) {
    this.items = [...this.items, { ...params, id: `${params.productId}:${params.size}` }];
    return this.items;
  }

  async remove(itemId: string) {
    this.items = this.items.filter((item) => item.id !== itemId);
    return this.items;
  }

  async update({ itemId, quantity }: UpdateCartItemQuantity.Params) {
    this.items = this.items.map((item) => (item.id === itemId ? { ...item, quantity } : item));
    return this.items;
  }

  async clear() {
    this.items = [];
  }
}

export class PlaceOrderSpy implements PlaceOrder {
  params?: PlaceOrder.Params;
  error?: Error;
  order = { code: 'FTS-TEST', total: 89.9, createdAt: '2026-01-01T00:00:00.000Z' };

  place = vi.fn(async (params: PlaceOrder.Params) => {
    this.params = params;
    if (this.error) throw this.error;
    return this.order;
  });
}
