import { buttonVariants } from '@/presentation/components/ui';
import { quietFocusStyles } from '@/presentation/styles/focus';
import { tv } from '@/presentation/styles/tv';

export const storyEndingStyles = tv({
  slots: {
    root: ['flex animate-page-in flex-col gap-6', quietFocusStyles()],
    photo: 'relative aspect-video overflow-hidden border-4 border-zinc-50',
    image: 'object-cover',
    outcome: 'font-pixel text-lg leading-relaxed text-street-lime sm:text-xl',
    epilogue: 'font-pixel text-lg leading-relaxed text-zinc-50 sm:text-xl',
    actions: 'flex flex-wrap gap-3',
    drop: buttonVariants({ size: 'lg' }),
    city: buttonVariants({ variant: 'outline', size: 'lg' }),
    restart: buttonVariants({ variant: 'ghost', size: 'lg' }),
  },
});
