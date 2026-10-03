import { tv } from '@/presentation/styles/tv';

export const walkIntroStyles = tv({
  slots: {
    root: 'flex h-full w-full items-start justify-center pt-[8%]',
    card: 'border-2 border-zinc-50 bg-black/80 px-4 py-2 text-center font-pixel text-zinc-50',
    title: 'text-lg text-street-lime',
    shortcuts: 'hidden text-xs text-zinc-300 [@media(pointer:fine)]:block',
    touch: 'text-xs text-zinc-300 [@media(pointer:fine)]:hidden',
  },
  variants: {
    animated: { true: { card: 'animate-page-in' } },
  },
});
