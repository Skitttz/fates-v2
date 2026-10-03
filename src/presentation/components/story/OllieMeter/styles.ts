import { tv } from '@/presentation/styles/tv';

export const ollieMeterStyles = tv({
  slots: {
    root: 'flex flex-col gap-3 border-4 border-zinc-50 bg-black p-4',
    hint: 'font-pixel text-base text-zinc-50',
    meter: 'relative h-5 border-2 border-zinc-50 bg-zinc-900',
    window: 'absolute inset-y-0 bg-street-lime/40',
    fill: 'absolute inset-y-0 left-0 bg-street-orange',
    action: 'touch-manipulation',
  },
});
