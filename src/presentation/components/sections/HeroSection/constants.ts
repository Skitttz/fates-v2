import { ROUTES } from '@/presentation/constants/route';

export const HERO_DEFAULTS = {
  eyebrow: 'Desperte sua',
  title: 'Essência',
  description:
    'Seja a sua própria tendência, crie seu estilo, siga seus instintos e não tenha medo de ser diferente.',
  primaryCta: { label: 'Ver drop 01', href: ROUTES.PRODUCTS },
  secondaryCta: { label: 'Lookbook', href: '#lookbook' as const },
};

export const HERO_BADGE_TEXT = 'Drop 01 • Fates • Streetwear • Fates • ';
