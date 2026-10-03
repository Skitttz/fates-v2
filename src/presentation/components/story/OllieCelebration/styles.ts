import { tv } from '@/presentation/styles/tv';

export const ollieCelebrationStyles = tv({
  slots: {
    root: 'flex justify-center pt-[8%]',
    panel: 'border-2 border-street-lime bg-black/90 px-5 py-3 text-center font-pixel',
    title: 'text-2xl text-street-lime',
    message: 'text-sm text-zinc-50',
    badge:
      'self-start border-2 border-street-lime bg-black px-3 py-1 font-pixel text-sm text-street-lime',
  },
});
