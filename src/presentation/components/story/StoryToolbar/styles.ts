import { buttonVariants } from '@/presentation/components/ui';
import { tv } from '@/presentation/styles/tv';

export const storyToolbarStyles = tv({
  slots: {
    root: 'flex flex-wrap justify-end gap-2',
    sound: buttonVariants({ variant: 'ghost', size: 'sm', className: 'min-h-12' }),
    soundIcon: 'size-4',
    mode: buttonVariants({ variant: 'outline', size: 'sm', className: 'min-h-12' }),
    skip: buttonVariants({ variant: 'ghost', size: 'sm', className: 'min-h-12' }),
  },
  variants: {
    soundOn: {
      true: {
        sound: 'border-2 border-street-lime text-street-lime',
        soundIcon: 'motion-safe:animate-pulse',
      },
    },
  },
});
