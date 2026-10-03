import { ROUTES } from '@/presentation/constants/route';

export const ENDING_LABEL = 'Final da história';

export const ENDING_ACTIONS = {
  drop: { label: 'Ver o drop', href: ROUTES.PRODUCTS },
  city: { label: 'Pela cidade', href: `${ROUTES.HOME}#pela-cidade` },
  restart: 'Jogar de novo',
};
