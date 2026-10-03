import { tv } from '@/presentation/styles/tv';

export const storyEndingStyles = tv({
  slots: {
    root: 'flex animate-page-in flex-col gap-6 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
    photo: 'relative aspect-video overflow-hidden border-4 border-zinc-50',
    image: 'object-cover',
    outcome: 'font-pixel text-lg leading-relaxed text-street-lime sm:text-xl',
    epilogue: 'font-pixel text-lg leading-relaxed text-zinc-50 sm:text-xl',
    actions: 'flex flex-wrap gap-3',
  },
});
