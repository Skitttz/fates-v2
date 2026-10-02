import { ROUTES } from '@/presentation/constants/route';

export const CART_PAGE = {
  title: 'Carrinho',
  checkout: 'Finalizar compra',
  processing: 'Processando...',
  loginToCheckout: 'Entrar para finalizar',
};

export const CART_EMPTY = {
  sticker: 'VAZIO',
  title: 'Seu carrinho tá vazio',
  description: 'Bora garantir as peças do drop antes que acabe.',
  action: 'Ver drop 01',
};

export const LOGIN_REDIRECT_URL = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CART)}`;
