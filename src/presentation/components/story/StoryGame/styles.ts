import { tv } from '@/presentation/styles/tv';

export const storyGameStyles = tv({
  slots: {
    root: 'flex flex-col gap-4',
    status: 'sr-only',
    stage: 'flex flex-col gap-3',
    backdrop: 'sr-only',
    layout:
      'relative grid gap-3 [@media(orientation:landscape)_and_(max-height:500px)]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] [@media(orientation:landscape)_and_(max-height:500px)]:items-start',
    panel: 'flex flex-col gap-3',
    touch: '[@media(pointer:fine)]:hidden',
  },
});
