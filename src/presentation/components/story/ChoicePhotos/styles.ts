import { tv } from '@/presentation/styles/tv';

export const choicePhotosStyles = tv({
  base: 'object-cover opacity-0',
  variants: {
    visible: { true: 'opacity-100' },
  },
});
