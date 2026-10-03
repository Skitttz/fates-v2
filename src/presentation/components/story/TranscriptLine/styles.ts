import { tv } from '@/presentation/styles/tv';

export const transcriptLineStyles = tv({
  slots: {
    root: '',
    condition: 'text-sm text-zinc-500',
    speaker: 'text-street-lime',
  },
  variants: {
    narration: { true: { root: 'italic text-zinc-300' } },
  },
});
