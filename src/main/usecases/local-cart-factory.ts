import {
  LocalAddToCart,
  LocalClearCart,
  LocalLoadCart,
  LocalRemoveFromCart,
  LocalUpdateCartItemQuantity,
} from '@/data/usecases';
import {
  AddToCart,
  ClearCart,
  LoadCart,
  RemoveFromCart,
  UpdateCartItemQuantity,
} from '@/domain/usecases';
import { makeLocalStorageAdapter } from '../cache';
import { STORAGE_KEYS } from '../config';

export const makeLocalLoadCart = (): LoadCart =>
  new LocalLoadCart(STORAGE_KEYS.CART, makeLocalStorageAdapter());

export const makeLocalAddToCart = (): AddToCart =>
  new LocalAddToCart(STORAGE_KEYS.CART, makeLocalStorageAdapter());

export const makeLocalRemoveFromCart = (): RemoveFromCart =>
  new LocalRemoveFromCart(STORAGE_KEYS.CART, makeLocalStorageAdapter());

export const makeLocalUpdateCartItemQuantity = (): UpdateCartItemQuantity =>
  new LocalUpdateCartItemQuantity(STORAGE_KEYS.CART, makeLocalStorageAdapter());

export const makeLocalClearCart = (): ClearCart =>
  new LocalClearCart(STORAGE_KEYS.CART, makeLocalStorageAdapter());
