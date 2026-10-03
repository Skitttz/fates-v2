import { tv } from '@/presentation/styles/tv';

export const walkHintStyles = tv({
  slots: {
    root: 'border-4 border-zinc-50 bg-black p-4 font-pixel text-base text-zinc-50',
    shortcuts: 'hidden text-sm text-zinc-400 [@media(pointer:fine)]:block',
  },
});
