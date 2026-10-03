import { quietFocusStyles } from '@/presentation/styles/focus';
import { tv } from '@/presentation/styles/tv';

export const storyAftermathStyles = tv({
  slots: {
    root: ['flex flex-col gap-4', quietFocusStyles()],
    heading: 'flex items-center gap-3 font-pixel text-street-lime',
    marker: 'h-2 w-2 bg-street-lime',
    panel: 'border-4 border-zinc-50 bg-black p-5 font-pixel',
    title: 'mb-3 text-xl text-street-lime',
    text: 'text-lg leading-relaxed text-zinc-50',
    action: 'self-start',
  },
});
