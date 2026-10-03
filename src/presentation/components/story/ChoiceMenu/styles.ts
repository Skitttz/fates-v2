import { tv } from '@/presentation/styles/tv';

export const choiceMenuStyles = tv({
  slots: {
    root: 'flex flex-col gap-3 border-4 border-zinc-50 bg-black p-4',
    legend: 'px-2 font-pixel text-lg text-street-lime',
    options: 'grid gap-2 sm:grid-cols-3',
    option:
      'min-h-12 touch-manipulation border-2 border-zinc-50 px-4 font-pixel text-base text-zinc-50 transition-colors hover:bg-street-lime hover:text-black focus-visible:bg-street-lime focus-visible:text-black',
  },
});
