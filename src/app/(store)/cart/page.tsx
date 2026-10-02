import type { Metadata } from 'next';
import { CartFactory } from '@/main/pages/cart/cart-factory';

export const metadata: Metadata = {
  title: 'Carrinho',
};

export default function CartRouter() {
  return <CartFactory />;
}
