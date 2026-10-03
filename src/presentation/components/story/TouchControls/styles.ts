import { tv } from '@/presentation/styles/tv';

export const touchControlsStyles = tv({
  slots: {
    root: 'flex items-center justify-between gap-4',
    button:
      'grid size-16 touch-none select-none place-items-center border-4 border-zinc-50 bg-black text-zinc-50 shadow-brutal-lime active:translate-x-1 active:translate-y-1 active:shadow-none',
    icon: 'size-7',
  },
});
