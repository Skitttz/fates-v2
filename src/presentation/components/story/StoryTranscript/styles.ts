import { tv } from '@/presentation/styles/tv';

export const storyTranscriptStyles = tv({
  slots: {
    root: 'flex flex-col gap-8 border-4 border-zinc-50 bg-black p-6 font-pixel text-base leading-relaxed text-zinc-100 sm:text-lg',
    scene: 'flex flex-col gap-2',
    backdrop: 'text-sm uppercase tracking-widest text-zinc-500',
    line: '',
    condition: 'text-sm text-zinc-500',
    speaker: 'text-street-lime',
    note: 'text-street-yellow',
    choice: 'flex flex-col gap-1',
    options: 'list-inside list-disc text-zinc-300',
    epilogue: 'text-street-lime',
  },
  variants: {
    narration: { true: { line: 'italic text-zinc-300' } },
  },
});
