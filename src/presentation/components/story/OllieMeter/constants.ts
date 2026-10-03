import { OLLIE_WINDOW } from '@/presentation/story/engine/ollie';

export const OLLIE_LABELS = {
  hint: 'Aperte quando a barra entrar na faixa verde.',
  action: 'Ollie!',
  meter: 'Força do ollie',
};

export const OLLIE_WINDOW_STYLE = {
  left: `${OLLIE_WINDOW.min}%`,
  width: `${OLLIE_WINDOW.max - OLLIE_WINDOW.min}%`,
};
