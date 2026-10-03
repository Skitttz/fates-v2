import { tv } from '@/presentation/styles/tv';

export const dialogueBoxStyles = tv({
  slots: {
    root: 'relative',
    button:
      'flex min-h-28 w-full touch-manipulation flex-col gap-2 border-4 border-zinc-50 bg-black p-4 text-left font-pixel text-base leading-relaxed text-zinc-50 sm:text-lg',
    speaker: 'flex items-center gap-2 text-street-lime',
    text: '',
    hint: 'absolute bottom-2 right-3 animate-pulse text-xs',
  },
  variants: {
    narration: { true: { text: 'italic text-zinc-300' } },
  },
});
